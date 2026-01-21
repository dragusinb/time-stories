import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Lab Store - Idle Game Metagame System
 *
 * Goal: "Restore the Timeline" - reach 100% Timeline Stability
 * Resource: "Temporal Energy" - produced passively by artifacts
 *
 * System:
 * - Artifacts: Unlocked by completing stories, produce Temporal Energy
 * - Upgrades: Boost artifact production rates
 * - Timeline Stability: Spend energy to repair timeline anomalies
 * - Prestige: Reset for Temporal Shards (permanent multipliers)
 */

// Artifact definitions
export interface Artifact {
    id: string;
    name: string;
    description: string;
    storyId: string; // Which story unlocks this
    icon: string; // Emoji for simple display
    baseProduction: number; // Temporal Energy per second at level 1
    era: string;
}

export const ARTIFACTS: Artifact[] = [
    {
        id: 'apollo-rock',
        name: 'Moon Rock Sample',
        description: 'A piece of the moon brought back by Apollo 11. Emits faint temporal resonance.',
        storyId: 'story-1',
        icon: '🌑',
        baseProduction: 1,
        era: '1969'
    },
    {
        id: 'alchemist-stone',
        name: "Philosopher's Stone Fragment",
        description: 'A shard of the legendary stone. Transmutes time itself.',
        storyId: 'story-2',
        icon: '💎',
        baseProduction: 2,
        era: '1348'
    },
    {
        id: 'archimedes-lens',
        name: 'Archimedes Mirror',
        description: 'A piece of the death ray. Focuses temporal light.',
        storyId: 'story-3',
        icon: '🔮',
        baseProduction: 3,
        era: '212 BC'
    },
];

// Upgrade definitions
export interface Upgrade {
    id: string;
    name: string;
    description: string;
    artifactId: string; // Which artifact this upgrades
    costBase: number;
    costMultiplier: number; // Cost increases by this factor per level
    productionBonus: number; // Multiplier to production per level
    maxLevel: number;
}

export const UPGRADES: Upgrade[] = [
    // Apollo upgrades
    {
        id: 'apollo-containment',
        name: 'Containment Field',
        description: 'Better containment increases energy extraction',
        artifactId: 'apollo-rock',
        costBase: 50,
        costMultiplier: 1.5,
        productionBonus: 0.5, // +50% per level
        maxLevel: 10,
    },
    {
        id: 'apollo-resonance',
        name: 'Resonance Amplifier',
        description: 'Amplifies the temporal signal from moon dust',
        artifactId: 'apollo-rock',
        costBase: 200,
        costMultiplier: 2,
        productionBonus: 1.0, // +100% per level
        maxLevel: 5,
    },
    // Alchemist upgrades
    {
        id: 'alchemist-crucible',
        name: 'Alchemical Crucible',
        description: 'Ancient heating technique extracts more energy',
        artifactId: 'alchemist-stone',
        costBase: 100,
        costMultiplier: 1.5,
        productionBonus: 0.5,
        maxLevel: 10,
    },
    {
        id: 'alchemist-transmute',
        name: 'Transmutation Circle',
        description: 'Converts matter into pure temporal energy',
        artifactId: 'alchemist-stone',
        costBase: 400,
        costMultiplier: 2,
        productionBonus: 1.0,
        maxLevel: 5,
    },
    // Archimedes upgrades
    {
        id: 'archimedes-focus',
        name: 'Solar Focus Array',
        description: 'Multiple mirrors concentrate the beam',
        artifactId: 'archimedes-lens',
        costBase: 150,
        costMultiplier: 1.5,
        productionBonus: 0.5,
        maxLevel: 10,
    },
    {
        id: 'archimedes-death-ray',
        name: 'Death Ray Intensifier',
        description: 'The full power of Syracuse, now in your lab',
        artifactId: 'archimedes-lens',
        costBase: 600,
        costMultiplier: 2,
        productionBonus: 1.0,
        maxLevel: 5,
    },
];

// Timeline repair costs (anomalies to fix)
export interface TimelineAnomaly {
    id: string;
    name: string;
    description: string;
    cost: number;
    stabilityGain: number; // Percentage points
}

export const ANOMALIES: TimelineAnomaly[] = [
    { id: 'anomaly-1', name: 'Minor Paradox', description: 'A small ripple in time', cost: 100, stabilityGain: 5 },
    { id: 'anomaly-2', name: 'Temporal Echo', description: 'Events repeating themselves', cost: 300, stabilityGain: 8 },
    { id: 'anomaly-3', name: 'Causality Loop', description: 'Cause and effect are tangled', cost: 800, stabilityGain: 12 },
    { id: 'anomaly-4', name: 'Timeline Fracture', description: 'Reality is splitting', cost: 2000, stabilityGain: 15 },
    { id: 'anomaly-5', name: 'Dimensional Rift', description: 'Other timelines bleeding in', cost: 5000, stabilityGain: 20 },
    { id: 'anomaly-6', name: 'Temporal Collapse', description: 'Time itself is failing', cost: 15000, stabilityGain: 25 },
    { id: 'anomaly-7', name: 'The Final Anomaly', description: 'The source of all instability', cost: 50000, stabilityGain: 15 },
];

// Store state
interface LabState {
    // Resources
    temporalEnergy: number;
    totalEnergyProduced: number;
    temporalShards: number; // Prestige currency

    // Progress
    timelineStability: number; // 0-100%
    repairedAnomalies: string[];

    // Artifacts & Upgrades
    artifactLevels: Record<string, number>; // artifactId -> level (0 = locked, 1+ = unlocked & level)
    upgradeLevels: Record<string, number>; // upgradeId -> level

    // Prestige
    prestigeCount: number;
    permanentMultiplier: number; // From shards

    // Timing
    lastUpdate: number;

    // Actions
    tick: () => void;
    calculateOfflineProgress: () => number;
    unlockArtifact: (artifactId: string) => void;
    buyUpgrade: (upgradeId: string) => boolean;
    repairAnomaly: (anomalyId: string) => boolean;
    prestige: () => void;
    spendShards: (amount: number) => boolean;
    getTotalProduction: () => number;
    getArtifactProduction: (artifactId: string) => number;
    getUpgradeCost: (upgradeId: string) => number;
}

export const useLabStore = create<LabState>()(
    persist(
        (set, get) => ({
            // Initial state
            temporalEnergy: 0,
            totalEnergyProduced: 0,
            temporalShards: 0,
            timelineStability: 0,
            repairedAnomalies: [],
            artifactLevels: {},
            upgradeLevels: {},
            prestigeCount: 0,
            permanentMultiplier: 1,
            lastUpdate: Date.now(),

            // Calculate production for a single artifact
            getArtifactProduction: (artifactId: string) => {
                const state = get();
                const artifact = ARTIFACTS.find(a => a.id === artifactId);
                if (!artifact) return 0;

                const level = state.artifactLevels[artifactId] || 0;
                if (level === 0) return 0; // Not unlocked

                let production = artifact.baseProduction * level;

                // Apply upgrade bonuses
                const artifactUpgrades = UPGRADES.filter(u => u.artifactId === artifactId);
                for (const upgrade of artifactUpgrades) {
                    const upgradeLevel = state.upgradeLevels[upgrade.id] || 0;
                    production *= (1 + upgrade.productionBonus * upgradeLevel);
                }

                // Apply prestige multiplier
                production *= state.permanentMultiplier;

                return production;
            },

            // Total production per second
            getTotalProduction: () => {
                const state = get();
                let total = 0;
                for (const artifact of ARTIFACTS) {
                    total += state.getArtifactProduction(artifact.id);
                }
                return total;
            },

            // Get upgrade cost at current level
            getUpgradeCost: (upgradeId: string) => {
                const state = get();
                const upgrade = UPGRADES.find(u => u.id === upgradeId);
                if (!upgrade) return Infinity;

                const currentLevel = state.upgradeLevels[upgradeId] || 0;
                return Math.floor(upgrade.costBase * Math.pow(upgrade.costMultiplier, currentLevel));
            },

            // Tick - called every frame or periodically
            tick: () => {
                set((state) => {
                    const now = Date.now();
                    const deltaSeconds = (now - state.lastUpdate) / 1000;
                    const production = state.getTotalProduction();
                    const gained = production * deltaSeconds;

                    return {
                        temporalEnergy: state.temporalEnergy + gained,
                        totalEnergyProduced: state.totalEnergyProduced + gained,
                        lastUpdate: now,
                    };
                });
            },

            // Calculate offline progress
            calculateOfflineProgress: () => {
                const state = get();
                const now = Date.now();
                const offlineSeconds = (now - state.lastUpdate) / 1000;
                const maxOfflineSeconds = 8 * 60 * 60; // Cap at 8 hours
                const effectiveSeconds = Math.min(offlineSeconds, maxOfflineSeconds);
                const production = state.getTotalProduction();
                return production * effectiveSeconds;
            },

            // Unlock artifact (called when story is completed)
            unlockArtifact: (artifactId: string) => {
                set((state) => {
                    if (state.artifactLevels[artifactId] && state.artifactLevels[artifactId] > 0) {
                        // Already unlocked, level it up
                        return {
                            artifactLevels: {
                                ...state.artifactLevels,
                                [artifactId]: (state.artifactLevels[artifactId] || 0) + 1,
                            },
                        };
                    }
                    // First unlock
                    return {
                        artifactLevels: {
                            ...state.artifactLevels,
                            [artifactId]: 1,
                        },
                    };
                });
            },

            // Buy upgrade
            buyUpgrade: (upgradeId: string) => {
                const state = get();
                const upgrade = UPGRADES.find(u => u.id === upgradeId);
                if (!upgrade) return false;

                const currentLevel = state.upgradeLevels[upgradeId] || 0;
                if (currentLevel >= upgrade.maxLevel) return false;

                // Check if artifact is unlocked
                const artifactLevel = state.artifactLevels[upgrade.artifactId] || 0;
                if (artifactLevel === 0) return false;

                const cost = state.getUpgradeCost(upgradeId);
                if (state.temporalEnergy < cost) return false;

                set({
                    temporalEnergy: state.temporalEnergy - cost,
                    upgradeLevels: {
                        ...state.upgradeLevels,
                        [upgradeId]: currentLevel + 1,
                    },
                });
                return true;
            },

            // Repair anomaly
            repairAnomaly: (anomalyId: string) => {
                const state = get();
                if (state.repairedAnomalies.includes(anomalyId)) return false;

                const anomaly = ANOMALIES.find(a => a.id === anomalyId);
                if (!anomaly) return false;

                if (state.temporalEnergy < anomaly.cost) return false;

                const newStability = Math.min(100, state.timelineStability + anomaly.stabilityGain);

                set({
                    temporalEnergy: state.temporalEnergy - anomaly.cost,
                    timelineStability: newStability,
                    repairedAnomalies: [...state.repairedAnomalies, anomalyId],
                });
                return true;
            },

            // Prestige - reset for temporal shards
            prestige: () => {
                const state = get();
                if (state.timelineStability < 100) return; // Must complete timeline first

                // Calculate shards earned based on total energy produced
                const shardsEarned = Math.floor(Math.sqrt(state.totalEnergyProduced / 1000));
                if (shardsEarned < 1) return;

                // Calculate new multiplier (diminishing returns)
                const newMultiplier = 1 + (state.temporalShards + shardsEarned) * 0.1;

                set({
                    temporalEnergy: 0,
                    totalEnergyProduced: 0,
                    timelineStability: 0,
                    repairedAnomalies: [],
                    upgradeLevels: {},
                    // Keep artifacts unlocked but reset to level 1
                    artifactLevels: Object.fromEntries(
                        Object.entries(state.artifactLevels)
                            .filter(([, level]) => level > 0)
                            .map(([id]) => [id, 1])
                    ),
                    temporalShards: state.temporalShards + shardsEarned,
                    prestigeCount: state.prestigeCount + 1,
                    permanentMultiplier: newMultiplier,
                    lastUpdate: Date.now(),
                });
            },

            // Spend shards (for future permanent upgrades)
            spendShards: (amount: number) => {
                const state = get();
                if (state.temporalShards < amount) return false;
                set({ temporalShards: state.temporalShards - amount });
                return true;
            },
        }),
        {
            name: 'time-stories-lab-storage',
        }
    )
);

// Helper to format large numbers
export const formatEnergy = (n: number): string => {
    if (n < 1000) return Math.floor(n).toString();
    if (n < 1000000) return (n / 1000).toFixed(1) + 'K';
    if (n < 1000000000) return (n / 1000000).toFixed(1) + 'M';
    return (n / 1000000000).toFixed(1) + 'B';
};
