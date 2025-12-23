import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState } from '@/types';

interface Store extends UserState {
    addCoins: (amount: number) => void;
    spendCoins: (amount: number) => boolean;
    unlockAct: (actId: string) => void;
    completeMinigame: (minigameId: string) => void;
    completeStory: (storyId: string) => void;
    isActUnlocked: (actId: string) => boolean;
}

export const useStore = create<Store>()(
    persist(
        (set, get) => ({
            coins: 100, // Starter bonus
            unlockedActs: [],
            completedMinigames: [],
            completedStories: [],

            addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),

            spendCoins: (amount) => {
                const currentCoins = get().coins;
                if (currentCoins >= amount) {
                    set((state) => ({ coins: state.coins - amount }));
                    return true;
                }
                return false;
            },

            unlockAct: (actId) => set((state) => ({ unlockedActs: [...state.unlockedActs, actId] })),

            completeMinigame: (minigameId) =>
                set((state) => ({ completedMinigames: [...state.completedMinigames, minigameId] })),

            completeStory: (storyId) =>
                set((state) => {
                    if (state.completedStories.includes(storyId)) return state;
                    return { completedStories: [...state.completedStories, storyId] };
                }),

            isActUnlocked: (actId) => get().unlockedActs.includes(actId),
        }),
        {
            name: 'time-stories-storage',
        }
    )
);
