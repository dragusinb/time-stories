import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState } from '@/types';

interface Store extends UserState {
    addCoins: (amount: number) => void;
    spendCoins: (amount: number) => boolean;
    unlockAct: (actId: string) => void;
    completeMinigame: (minigameId: string) => void;
    isActUnlocked: (actId: string) => boolean;
}

export const useStore = create<Store>()(
    persist(
        (set, get) => ({
            coins: 100, // Starter bonus? Or 0? User said "Starter Pack 100 coins $4.99". Maybe start with 0 or some freebies. Let's start with 0.
            unlockedActs: [],
            completedMinigames: [],

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

            isActUnlocked: (actId) => get().unlockedActs.includes(actId),
        }),
        {
            name: 'time-stories-storage',
        }
    )
);
