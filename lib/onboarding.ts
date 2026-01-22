import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
    hasCompletedOnboarding: boolean;
    currentStep: number;
    hasSeenMinigameTutorial: boolean;
    hasSeenLabIntro: boolean;
    hasSeenTrophyIntro: boolean;

    // Actions
    completeOnboarding: () => void;
    setCurrentStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    markMinigameTutorialSeen: () => void;
    markLabIntroSeen: () => void;
    markTrophyIntroSeen: () => void;
    resetOnboarding: () => void;
}

export const ONBOARDING_STEPS = [
    {
        id: 'welcome',
        title: 'Welcome to TimeStories',
        description: 'Embark on interactive journeys through history',
    },
    {
        id: 'stories',
        title: 'Choose Your Adventure',
        description: 'Explore different eras with unique stories and challenges',
    },
    {
        id: 'minigames',
        title: 'Interactive Minigames',
        description: 'Solve puzzles and complete challenges to progress',
    },
    {
        id: 'coins',
        title: 'Earn & Spend Coins',
        description: 'Complete acts to earn coins and unlock more content',
    },
    {
        id: 'lab',
        title: 'The Temporal Lab',
        description: 'Build your lab, collect artifacts, and generate energy',
    },
    {
        id: 'ready',
        title: "You're Ready!",
        description: 'Start your first adventure and make history',
    },
];

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set, get) => ({
            hasCompletedOnboarding: false,
            currentStep: 0,
            hasSeenMinigameTutorial: false,
            hasSeenLabIntro: false,
            hasSeenTrophyIntro: false,

            completeOnboarding: () => set({ hasCompletedOnboarding: true }),

            setCurrentStep: (step) => set({ currentStep: step }),

            nextStep: () => {
                const { currentStep } = get();
                if (currentStep < ONBOARDING_STEPS.length - 1) {
                    set({ currentStep: currentStep + 1 });
                }
            },

            prevStep: () => {
                const { currentStep } = get();
                if (currentStep > 0) {
                    set({ currentStep: currentStep - 1 });
                }
            },

            markMinigameTutorialSeen: () => set({ hasSeenMinigameTutorial: true }),
            markLabIntroSeen: () => set({ hasSeenLabIntro: true }),
            markTrophyIntroSeen: () => set({ hasSeenTrophyIntro: true }),

            resetOnboarding: () =>
                set({
                    hasCompletedOnboarding: false,
                    currentStep: 0,
                    hasSeenMinigameTutorial: false,
                    hasSeenLabIntro: false,
                    hasSeenTrophyIntro: false,
                }),
        }),
        {
            name: 'timestories-onboarding',
        }
    )
);
