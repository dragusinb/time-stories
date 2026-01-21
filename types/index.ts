export type MinigameType = 'quiz' | 'memory' | 'cipher' | 'sequence' | 'microscope' | 'mixing' | 'timeline' | 'claw' | 'defense' | 'scale' | 'mirror' | 'catapult' | 'circle' | 'displacement' | 'gears' | 'tangram' | 'silo' | 'lens' | 'symbol' | 'debate' | 'ritual' | 'constellation' | 'chemistry' | 'diagnosis' | 'triage' | 'sanitation' | 'ratcatcher' | 'centrifuge' | 'grinding';

export interface Minigame {
    id: string;
    type: MinigameType;
    question: string;
    instructions?: string;
    winningCondition?: string;

    // Quiz
    options?: string[];
    correctOption?: number;

    // Cipher
    encrypted?: string;
    decrypted?: string;
    theme?: 'sci-fi' | 'ancient' | 'apollo' | 'medieval'; // Defaults to sci-fi if undefined

    // Microscope
    targetName?: string;

    // Mixing
    ingredients?: string[]; // List of available ingredients e.g. ["Water", "Salt", "Mercury"]
    ingredientImages?: string[]; // Optional: List of image URLs corresponding to ingredients
    correctCombination?: string[]; // List of required ingredients e.g. ["Water", "Salt"]

    // Timeline
    minVal?: number;
    maxVal?: number;
    correctVal?: number;
    unit?: string; // e.g. "days", "hours"

    // Sequence
    items?: string[];
    itemImages?: string[]; // Optional: List of image URLs corresponding to items
    correctOrder?: string[];
}

export interface Act {
    id: string;
    storyId: string;
    actNumber: number;
    title: string;
    content: string;
    isLocked: boolean;
    price: number;
    minigame?: Minigame;
    backgroundImage?: string;
}

export interface Story {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    period: string; // e.g., "Middle Ages", "Stone Age"
    location: string; // e.g., "Europe", "Africa"
    totalActs: number;
    acts: Act[];
}

export interface UserState {
    coins: number;
    unlockedActs: string[]; // List of Act IDs
    completedMinigames: string[]; // List of Minigame IDs
    completedStories: string[]; // List of Story IDs
}
