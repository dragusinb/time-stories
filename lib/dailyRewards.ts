import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DailyReward {
    day: number;
    coins: number;
    bonus?: string; // Special bonus description
    claimed: boolean;
}

interface DailyRewardsState {
    // State
    lastClaimDate: string | null; // ISO date string (YYYY-MM-DD)
    currentStreak: number;
    longestStreak: number;
    totalDaysClaimed: number;
    streakProtectionUsed: boolean; // One free miss per week
    weekStartDate: string | null;

    // Computed
    canClaimToday: () => boolean;
    getTodayReward: () => DailyReward;
    getWeekRewards: () => DailyReward[];
    getStreakMultiplier: () => number;

    // Actions
    claimDailyReward: () => { coins: number; bonus?: string } | null;
    useStreakProtection: () => boolean;
    checkAndResetStreak: () => void;
}

// Reward schedule for 7 days
const DAILY_REWARDS: Omit<DailyReward, 'claimed'>[] = [
    { day: 1, coins: 10 },
    { day: 2, coins: 15 },
    { day: 3, coins: 20 },
    { day: 4, coins: 25 },
    { day: 5, coins: 30 },
    { day: 6, coins: 40 },
    { day: 7, coins: 50, bonus: 'Weekly Bonus!' },
];

// Get today's date as YYYY-MM-DD
const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
};

// Get the start of the current week (Sunday)
const getWeekStart = (): string => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    return weekStart.toISOString().split('T')[0];
};

// Check if two dates are consecutive
const areConsecutiveDays = (date1: string, date2: string): boolean => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays === 1;
};

// Check if date was yesterday
const wasYesterday = (dateStr: string): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateStr === yesterday.toISOString().split('T')[0];
};

export const useDailyRewardsStore = create<DailyRewardsState>()(
    persist(
        (set, get) => ({
            lastClaimDate: null,
            currentStreak: 0,
            longestStreak: 0,
            totalDaysClaimed: 0,
            streakProtectionUsed: false,
            weekStartDate: null,

            canClaimToday: () => {
                const { lastClaimDate } = get();
                const today = getTodayDate();
                return lastClaimDate !== today;
            },

            getTodayReward: () => {
                const { currentStreak, canClaimToday } = get();
                // Day index is based on streak (1-7, cycling)
                const dayIndex = currentStreak % 7;
                const reward = DAILY_REWARDS[dayIndex];
                return {
                    ...reward,
                    claimed: !canClaimToday(),
                };
            },

            getWeekRewards: () => {
                const { currentStreak, lastClaimDate } = get();
                const today = getTodayDate();

                return DAILY_REWARDS.map((reward, index) => {
                    // Calculate which days have been claimed this cycle
                    const cyclePosition = currentStreak % 7;
                    const isClaimed = index < cyclePosition ||
                        (index === cyclePosition && lastClaimDate === today);

                    return {
                        ...reward,
                        claimed: isClaimed,
                    };
                });
            },

            getStreakMultiplier: () => {
                const { currentStreak } = get();
                // Bonus multiplier based on streak
                if (currentStreak >= 30) return 1.5;
                if (currentStreak >= 14) return 1.3;
                if (currentStreak >= 7) return 1.2;
                if (currentStreak >= 3) return 1.1;
                return 1.0;
            },

            claimDailyReward: () => {
                const state = get();
                const today = getTodayDate();

                // Can't claim if already claimed today
                if (state.lastClaimDate === today) {
                    return null;
                }

                // Check streak continuity
                let newStreak = state.currentStreak;
                const weekStart = getWeekStart();

                if (state.lastClaimDate === null) {
                    // First time claiming
                    newStreak = 1;
                } else if (state.lastClaimDate === today) {
                    // Already claimed today
                    return null;
                } else if (wasYesterday(state.lastClaimDate)) {
                    // Consecutive day - increment streak
                    newStreak = state.currentStreak + 1;
                } else {
                    // Streak broken - check if protection available
                    const daysSinceLastClaim = Math.floor(
                        (new Date(today).getTime() - new Date(state.lastClaimDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                    if (daysSinceLastClaim === 2 && !state.streakProtectionUsed &&
                        state.weekStartDate === weekStart) {
                        // Use streak protection (missed only 1 day)
                        newStreak = state.currentStreak + 1;
                        set({ streakProtectionUsed: true });
                    } else {
                        // Streak is broken, reset to 1
                        newStreak = 1;
                    }
                }

                // Reset streak protection on new week
                const shouldResetProtection = state.weekStartDate !== weekStart;

                // Get reward for current day in cycle
                const dayIndex = (newStreak - 1) % 7;
                const baseReward = DAILY_REWARDS[dayIndex];

                // Apply streak multiplier
                const multiplier = state.getStreakMultiplier();
                const finalCoins = Math.floor(baseReward.coins * multiplier);

                // Update state
                set({
                    lastClaimDate: today,
                    currentStreak: newStreak,
                    longestStreak: Math.max(state.longestStreak, newStreak),
                    totalDaysClaimed: state.totalDaysClaimed + 1,
                    weekStartDate: weekStart,
                    streakProtectionUsed: shouldResetProtection ? false : state.streakProtectionUsed,
                });

                return {
                    coins: finalCoins,
                    bonus: baseReward.bonus,
                };
            },

            useStreakProtection: () => {
                const { streakProtectionUsed } = get();
                if (streakProtectionUsed) return false;
                set({ streakProtectionUsed: true });
                return true;
            },

            checkAndResetStreak: () => {
                const { lastClaimDate, currentStreak } = get();
                if (!lastClaimDate) return;

                const today = getTodayDate();
                const daysSinceLastClaim = Math.floor(
                    (new Date(today).getTime() - new Date(lastClaimDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                // If more than 2 days passed, streak is definitely broken
                if (daysSinceLastClaim > 2 && currentStreak > 0) {
                    set({ currentStreak: 0 });
                }
            },
        }),
        {
            name: 'timestories-daily-rewards',
        }
    )
);

export { DAILY_REWARDS };
