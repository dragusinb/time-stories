import { create } from 'zustand';

/**
 * Events System
 *
 * Manages timed events that provide bonuses to players:
 * - Weekend events (automatic)
 * - Holiday events (date-based)
 * - Special promotional events (manual)
 */

export type EventType =
    | 'weekend_boost'
    | 'holiday'
    | 'special'
    | 'anniversary'
    | 'new_year'
    | 'halloween'
    | 'summer';

export interface GameEvent {
    id: string;
    type: EventType;
    name: string;
    description: string;
    icon: string;
    startDate: Date;
    endDate: Date;
    bonuses: {
        productionMultiplier?: number; // e.g., 2 for 2x
        coinBonus?: number; // Extra coins on purchases
        dailyRewardMultiplier?: number; // e.g., 1.5 for 50% more
        labBonusMultiplier?: number; // Daily lab bonus multiplier
    };
    theme?: {
        primaryColor: string;
        secondaryColor: string;
        bgGradient: string;
    };
}

// Predefined recurring events
const RECURRING_EVENTS: Omit<GameEvent, 'id' | 'startDate' | 'endDate'>[] = [
    {
        type: 'weekend_boost',
        name: 'Weekend Power Surge',
        description: '2x Lab production all weekend!',
        icon: '⚡',
        bonuses: {
            productionMultiplier: 2,
        },
        theme: {
            primaryColor: '#8b5cf6',
            secondaryColor: '#6366f1',
            bgGradient: 'from-purple-900/50 to-indigo-900/50',
        },
    },
];

// Holiday events (month/day based)
const HOLIDAY_EVENTS: Array<{
    month: number; // 0-11
    day: number;
    duration: number; // days
    event: Omit<GameEvent, 'id' | 'startDate' | 'endDate'>;
}> = [
    {
        month: 0, // January
        day: 1,
        duration: 3,
        event: {
            type: 'new_year',
            name: 'New Year Celebration',
            description: 'Start the year with 2x everything!',
            icon: '🎆',
            bonuses: {
                productionMultiplier: 2,
                dailyRewardMultiplier: 2,
                labBonusMultiplier: 2,
            },
            theme: {
                primaryColor: '#fbbf24',
                secondaryColor: '#f59e0b',
                bgGradient: 'from-amber-900/50 to-yellow-900/50',
            },
        },
    },
    {
        month: 9, // October
        day: 28,
        duration: 5,
        event: {
            type: 'halloween',
            name: 'Spooky Timeline',
            description: 'Mysterious forces boost your Lab!',
            icon: '🎃',
            bonuses: {
                productionMultiplier: 1.5,
                labBonusMultiplier: 2,
            },
            theme: {
                primaryColor: '#f97316',
                secondaryColor: '#ea580c',
                bgGradient: 'from-orange-900/50 to-red-900/50',
            },
        },
    },
    {
        month: 11, // December
        day: 20,
        duration: 12,
        event: {
            type: 'holiday',
            name: 'Winter Solstice',
            description: 'The longest nights bring the greatest power!',
            icon: '❄️',
            bonuses: {
                productionMultiplier: 2,
                dailyRewardMultiplier: 1.5,
                coinBonus: 10,
            },
            theme: {
                primaryColor: '#06b6d4',
                secondaryColor: '#0891b2',
                bgGradient: 'from-cyan-900/50 to-blue-900/50',
            },
        },
    },
    {
        month: 6, // July
        day: 1,
        duration: 7,
        event: {
            type: 'summer',
            name: 'Summer Solstice',
            description: 'Harness the power of the sun!',
            icon: '☀️',
            bonuses: {
                productionMultiplier: 1.5,
                labBonusMultiplier: 1.5,
            },
            theme: {
                primaryColor: '#eab308',
                secondaryColor: '#ca8a04',
                bgGradient: 'from-yellow-900/50 to-orange-900/50',
            },
        },
    },
];

// Check if it's a weekend
const isWeekend = (date: Date = new Date()): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
};

// Get weekend event dates (Friday 6pm to Monday 6am local time)
const getWeekendEventDates = (): { start: Date; end: Date } => {
    const now = new Date();
    const day = now.getDay();

    // Find the most recent Friday
    const friday = new Date(now);
    const daysUntilFriday = (day + 7 - 5) % 7;
    friday.setDate(friday.getDate() - daysUntilFriday);
    friday.setHours(18, 0, 0, 0); // 6 PM Friday

    // Monday 6 AM
    const monday = new Date(friday);
    monday.setDate(monday.getDate() + 3);
    monday.setHours(6, 0, 0, 0);

    return { start: friday, end: monday };
};

// Check if a date falls within a holiday event
const getHolidayEvent = (date: Date = new Date()): GameEvent | null => {
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    for (const holiday of HOLIDAY_EVENTS) {
        const startDate = new Date(year, holiday.month, holiday.day);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + holiday.duration);

        if (date >= startDate && date < endDate) {
            return {
                ...holiday.event,
                id: `${holiday.event.type}-${year}`,
                startDate,
                endDate,
            };
        }
    }

    return null;
};

interface EventsState {
    // Manual/special events (for promotions)
    specialEvents: GameEvent[];

    // Computed
    getActiveEvents: () => GameEvent[];
    getCurrentProductionMultiplier: () => number;
    getCurrentDailyRewardMultiplier: () => number;
    getCurrentLabBonusMultiplier: () => number;
    getCurrentCoinBonus: () => number;
    hasActiveEvent: () => boolean;

    // Admin actions (for future use)
    addSpecialEvent: (event: Omit<GameEvent, 'id'>) => void;
    removeSpecialEvent: (eventId: string) => void;
}

export const useEventsStore = create<EventsState>()((set, get) => ({
    specialEvents: [],

    getActiveEvents: () => {
        const now = new Date();
        const activeEvents: GameEvent[] = [];

        // Check weekend event
        const { start: weekendStart, end: weekendEnd } = getWeekendEventDates();
        if (now >= weekendStart && now < weekendEnd) {
            const weekendEvent = RECURRING_EVENTS.find((e) => e.type === 'weekend_boost');
            if (weekendEvent) {
                activeEvents.push({
                    ...weekendEvent,
                    id: `weekend-${weekendStart.toISOString().split('T')[0]}`,
                    startDate: weekendStart,
                    endDate: weekendEnd,
                });
            }
        }

        // Check holiday events
        const holidayEvent = getHolidayEvent(now);
        if (holidayEvent) {
            activeEvents.push(holidayEvent);
        }

        // Check special events
        const { specialEvents } = get();
        for (const event of specialEvents) {
            if (now >= event.startDate && now < event.endDate) {
                activeEvents.push(event);
            }
        }

        return activeEvents;
    },

    getCurrentProductionMultiplier: () => {
        const activeEvents = get().getActiveEvents();
        let multiplier = 1;

        for (const event of activeEvents) {
            if (event.bonuses.productionMultiplier) {
                multiplier *= event.bonuses.productionMultiplier;
            }
        }

        return multiplier;
    },

    getCurrentDailyRewardMultiplier: () => {
        const activeEvents = get().getActiveEvents();
        let multiplier = 1;

        for (const event of activeEvents) {
            if (event.bonuses.dailyRewardMultiplier) {
                multiplier *= event.bonuses.dailyRewardMultiplier;
            }
        }

        return multiplier;
    },

    getCurrentLabBonusMultiplier: () => {
        const activeEvents = get().getActiveEvents();
        let multiplier = 1;

        for (const event of activeEvents) {
            if (event.bonuses.labBonusMultiplier) {
                multiplier *= event.bonuses.labBonusMultiplier;
            }
        }

        return multiplier;
    },

    getCurrentCoinBonus: () => {
        const activeEvents = get().getActiveEvents();
        let bonus = 0;

        for (const event of activeEvents) {
            if (event.bonuses.coinBonus) {
                bonus += event.bonuses.coinBonus;
            }
        }

        return bonus;
    },

    hasActiveEvent: () => {
        return get().getActiveEvents().length > 0;
    },

    addSpecialEvent: (event) => {
        const id = `special-${Date.now()}`;
        set((state) => ({
            specialEvents: [...state.specialEvents, { ...event, id }],
        }));
    },

    removeSpecialEvent: (eventId) => {
        set((state) => ({
            specialEvents: state.specialEvents.filter((e) => e.id !== eventId),
        }));
    },
}));

// Convenience exports
export const getActiveEvents = () => useEventsStore.getState().getActiveEvents();
export const getProductionMultiplier = () => useEventsStore.getState().getCurrentProductionMultiplier();
export const hasActiveEvent = () => useEventsStore.getState().hasActiveEvent();
