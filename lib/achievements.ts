import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AchievementCategory =
    | 'story'
    | 'minigame'
    | 'collection'
    | 'dedication'
    | 'special';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string; // Emoji or icon name
    category: AchievementCategory;
    requirement: number;
    reward: {
        coins: number;
        badge?: string;
    };
    secret?: boolean; // Hidden until unlocked
}

interface AchievementProgress {
    achievementId: string;
    currentProgress: number;
    unlockedAt?: string; // ISO date
    rewardClaimed: boolean;
}

interface AchievementsState {
    progress: AchievementProgress[];
    totalUnlocked: number;

    // Actions
    getProgress: (achievementId: string) => AchievementProgress | undefined;
    updateProgress: (achievementId: string, progress: number) => boolean; // Returns true if newly unlocked
    incrementProgress: (achievementId: string, amount?: number) => boolean;
    claimReward: (achievementId: string) => { coins: number; badge?: string } | null;
    isUnlocked: (achievementId: string) => boolean;
    getUnlockedAchievements: () => Achievement[];
    getLockedAchievements: () => Achievement[];
    getAchievementsByCategory: (category: AchievementCategory) => Achievement[];
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
    // Story Achievements
    {
        id: 'first_story',
        title: 'Time Traveler',
        description: 'Complete your first story',
        icon: '🎭',
        category: 'story',
        requirement: 1,
        reward: { coins: 50 },
    },
    {
        id: 'all_stories',
        title: 'Master Historian',
        description: 'Complete all available stories',
        icon: '📚',
        category: 'story',
        requirement: 3,
        reward: { coins: 200, badge: 'historian' },
    },
    {
        id: 'apollo_complete',
        title: 'Moon Walker',
        description: 'Complete the Apollo 11 story',
        icon: '🌙',
        category: 'story',
        requirement: 1,
        reward: { coins: 75 },
    },
    {
        id: 'archimedes_complete',
        title: 'Eureka!',
        description: 'Complete the Archimedes story',
        icon: '⚙️',
        category: 'story',
        requirement: 1,
        reward: { coins: 75 },
    },

    // Minigame Achievements
    {
        id: 'first_minigame',
        title: 'Game On',
        description: 'Complete your first minigame',
        icon: '🎮',
        category: 'minigame',
        requirement: 1,
        reward: { coins: 10 },
    },
    {
        id: 'minigame_master_10',
        title: 'Puzzle Solver',
        description: 'Complete 10 minigames',
        icon: '🧩',
        category: 'minigame',
        requirement: 10,
        reward: { coins: 50 },
    },
    {
        id: 'minigame_master_50',
        title: 'Minigame Master',
        description: 'Complete 50 minigames',
        icon: '🏆',
        category: 'minigame',
        requirement: 50,
        reward: { coins: 150, badge: 'minigame_master' },
    },
    {
        id: 'perfect_score',
        title: 'Perfectionist',
        description: 'Get a perfect score on any minigame',
        icon: '💯',
        category: 'minigame',
        requirement: 1,
        reward: { coins: 25 },
    },
    {
        id: 'perfect_10',
        title: 'Flawless',
        description: 'Get 10 perfect minigame scores',
        icon: '⭐',
        category: 'minigame',
        requirement: 10,
        reward: { coins: 100 },
    },

    // Collection Achievements
    {
        id: 'first_artifact',
        title: 'Collector',
        description: 'Unlock your first artifact in the Lab',
        icon: '🏺',
        category: 'collection',
        requirement: 1,
        reward: { coins: 20 },
    },
    {
        id: 'all_artifacts',
        title: 'Curator',
        description: 'Unlock all artifacts',
        icon: '🗃️',
        category: 'collection',
        requirement: 10, // Adjust based on total artifacts
        reward: { coins: 300, badge: 'curator' },
    },
    {
        id: 'first_prestige',
        title: 'Timeline Reset',
        description: 'Prestige for the first time',
        icon: '🔄',
        category: 'collection',
        requirement: 1,
        reward: { coins: 100 },
    },
    {
        id: 'prestige_5',
        title: 'Temporal Loop',
        description: 'Prestige 5 times',
        icon: '♾️',
        category: 'collection',
        requirement: 5,
        reward: { coins: 250, badge: 'looper' },
    },

    // Dedication Achievements
    {
        id: 'streak_7',
        title: 'Weekly Warrior',
        description: 'Maintain a 7-day login streak',
        icon: '🔥',
        category: 'dedication',
        requirement: 7,
        reward: { coins: 75 },
    },
    {
        id: 'streak_30',
        title: 'Dedicated Traveler',
        description: 'Maintain a 30-day login streak',
        icon: '🌟',
        category: 'dedication',
        requirement: 30,
        reward: { coins: 200, badge: 'dedicated' },
    },
    {
        id: 'total_login_30',
        title: 'Regular',
        description: 'Log in for 30 total days',
        icon: '📅',
        category: 'dedication',
        requirement: 30,
        reward: { coins: 100 },
    },

    // Special/Secret Achievements
    {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Play between midnight and 4 AM',
        icon: '🦉',
        category: 'special',
        requirement: 1,
        reward: { coins: 30 },
        secret: true,
    },
    {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Complete an act in under 30 seconds',
        icon: '⚡',
        category: 'special',
        requirement: 1,
        reward: { coins: 40 },
        secret: true,
    },
    {
        id: 'wealthy',
        title: 'Time Baron',
        description: 'Accumulate 1000 coins at once',
        icon: '💰',
        category: 'special',
        requirement: 1000,
        reward: { coins: 100 },
        secret: true,
    },
];

export const useAchievementsStore = create<AchievementsState>()(
    persist(
        (set, get) => ({
            progress: [],
            totalUnlocked: 0,

            getProgress: (achievementId) => {
                return get().progress.find((p) => p.achievementId === achievementId);
            },

            updateProgress: (achievementId, progress) => {
                const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
                if (!achievement) return false;

                const existing = get().progress.find((p) => p.achievementId === achievementId);
                const wasUnlocked = existing && existing.currentProgress >= achievement.requirement;
                const isNowUnlocked = progress >= achievement.requirement;
                const newlyUnlocked = !wasUnlocked && isNowUnlocked;

                set((state) => {
                    const otherProgress = state.progress.filter((p) => p.achievementId !== achievementId);
                    const updatedProgress: AchievementProgress = {
                        achievementId,
                        currentProgress: progress,
                        unlockedAt: newlyUnlocked ? new Date().toISOString() : existing?.unlockedAt,
                        rewardClaimed: existing?.rewardClaimed || false,
                    };

                    return {
                        progress: [...otherProgress, updatedProgress],
                        totalUnlocked: newlyUnlocked ? state.totalUnlocked + 1 : state.totalUnlocked,
                    };
                });

                return newlyUnlocked;
            },

            incrementProgress: (achievementId, amount = 1) => {
                const existing = get().getProgress(achievementId);
                const currentProgress = existing?.currentProgress || 0;
                return get().updateProgress(achievementId, currentProgress + amount);
            },

            claimReward: (achievementId) => {
                const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
                const progress = get().getProgress(achievementId);

                if (!achievement || !progress) return null;
                if (progress.currentProgress < achievement.requirement) return null;
                if (progress.rewardClaimed) return null;

                set((state) => ({
                    progress: state.progress.map((p) =>
                        p.achievementId === achievementId ? { ...p, rewardClaimed: true } : p
                    ),
                }));

                return achievement.reward;
            },

            isUnlocked: (achievementId) => {
                const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
                const progress = get().getProgress(achievementId);
                if (!achievement || !progress) return false;
                return progress.currentProgress >= achievement.requirement;
            },

            getUnlockedAchievements: () => {
                const state = get();
                return ACHIEVEMENTS.filter((a) => state.isUnlocked(a.id));
            },

            getLockedAchievements: () => {
                const state = get();
                return ACHIEVEMENTS.filter((a) => !state.isUnlocked(a.id) && !a.secret);
            },

            getAchievementsByCategory: (category) => {
                return ACHIEVEMENTS.filter((a) => a.category === category);
            },
        }),
        {
            name: 'timestories-achievements',
        }
    )
);

// Helper to check and trigger achievements from other parts of the app
export const checkAchievements = {
    onMinigameComplete: (score: number) => {
        const store = useAchievementsStore.getState();
        store.incrementProgress('first_minigame');
        store.incrementProgress('minigame_master_10');
        store.incrementProgress('minigame_master_50');
        if (score === 100) {
            store.incrementProgress('perfect_score');
            store.incrementProgress('perfect_10');
        }
    },

    onStoryComplete: (storyId: string, totalStories: number) => {
        const store = useAchievementsStore.getState();
        store.incrementProgress('first_story');
        store.updateProgress('all_stories', totalStories);

        if (storyId === 'story-1') {
            store.updateProgress('apollo_complete', 1);
        } else if (storyId === 'story-3') {
            store.updateProgress('archimedes_complete', 1);
        }
    },

    onArtifactUnlock: (totalArtifacts: number) => {
        const store = useAchievementsStore.getState();
        store.incrementProgress('first_artifact');
        store.updateProgress('all_artifacts', totalArtifacts);
    },

    onPrestige: (prestigeCount: number) => {
        const store = useAchievementsStore.getState();
        store.updateProgress('first_prestige', Math.min(1, prestigeCount));
        store.updateProgress('prestige_5', prestigeCount);
    },

    onLogin: (streak: number, totalDays: number) => {
        const store = useAchievementsStore.getState();
        store.updateProgress('streak_7', streak);
        store.updateProgress('streak_30', streak);
        store.updateProgress('total_login_30', totalDays);

        // Check night owl
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 4) {
            store.updateProgress('night_owl', 1);
        }
    },

    onCoinsChange: (coins: number) => {
        const store = useAchievementsStore.getState();
        store.updateProgress('wealthy', coins);
    },

    onActComplete: (duration: number) => {
        const store = useAchievementsStore.getState();
        if (duration < 30) {
            store.updateProgress('speed_demon', 1);
        }
    },
};
