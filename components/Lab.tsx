'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore, ARTIFACTS, UPGRADES, ANOMALIES, formatEnergy } from '@/lib/labStore';
import { useStore } from '@/lib/store';
import {
    Zap, Clock, Shield, TrendingUp, ChevronRight,
    Lock, Sparkles, RotateCcw, Award
} from 'lucide-react';

/**
 * Lab Component - Idle Game Metagame Hub
 *
 * The Lab is where players manage their artifacts, upgrades, and
 * work towards restoring the timeline.
 */
export const Lab: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'artifacts' | 'timeline' | 'prestige'>('artifacts');
    const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);

    const {
        temporalEnergy,
        totalEnergyProduced,
        temporalShards,
        timelineStability,
        repairedAnomalies,
        artifactLevels,
        upgradeLevels,
        prestigeCount,
        permanentMultiplier,
        tick,
        calculateOfflineProgress,
        buyUpgrade,
        repairAnomaly,
        prestige,
        getTotalProduction,
        getArtifactProduction,
        getUpgradeCost,
    } = useLabStore();

    const { completedStories } = useStore();

    // Tick the production
    useEffect(() => {
        const interval = setInterval(() => tick(), 100);
        return () => clearInterval(interval);
    }, [tick]);

    // Calculate offline progress on mount
    useEffect(() => {
        const offline = calculateOfflineProgress();
        if (offline > 10) {
            // Show offline progress notification
            console.log(`Welcome back! You earned ${formatEnergy(offline)} Temporal Energy while away.`);
        }
    }, []);

    const totalProduction = getTotalProduction();

    // Check which artifacts are available (story completed)
    const getArtifactStatus = (artifact: typeof ARTIFACTS[0]) => {
        const storyCompleted = completedStories.includes(artifact.storyId);
        const level = artifactLevels[artifact.id] || 0;
        return { storyCompleted, level, unlocked: level > 0 };
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20">
            {/* Header with Energy Display */}
            <div className="sticky top-0 z-50 bg-gradient-to-b from-slate-950 via-slate-950 to-transparent pb-4">
                <div className="px-4 pt-4">
                    {/* Main Energy Counter */}
                    <div className="text-center mb-4">
                        <div className="text-xs text-purple-400 uppercase tracking-wider mb-1">
                            Temporal Energy
                        </div>
                        <motion.div
                            key={Math.floor(temporalEnergy)}
                            initial={{ scale: 1.02 }}
                            animate={{ scale: 1 }}
                            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
                        >
                            {formatEnergy(temporalEnergy)}
                        </motion.div>
                        <div className="text-sm text-slate-500 flex items-center justify-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{formatEnergy(totalProduction)}/s
                        </div>
                    </div>

                    {/* Timeline Stability Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-purple-400 flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Timeline Stability
                            </span>
                            <span className="text-cyan-400">{timelineStability.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-purple-600 to-cyan-500"
                                style={{ width: `${timelineStability}%` }}
                                animate={{ width: `${timelineStability}%` }}
                            />
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2">
                        {(['artifacts', 'timeline', 'prestige'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all
                                    ${activeTab === tab
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="px-4">
                <AnimatePresence mode="wait">
                    {activeTab === 'artifacts' && (
                        <motion.div
                            key="artifacts"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <ArtifactsTab
                                selectedArtifact={selectedArtifact}
                                setSelectedArtifact={setSelectedArtifact}
                                getArtifactStatus={getArtifactStatus}
                                getArtifactProduction={getArtifactProduction}
                                upgradeLevels={upgradeLevels}
                                temporalEnergy={temporalEnergy}
                                buyUpgrade={buyUpgrade}
                                getUpgradeCost={getUpgradeCost}
                                unlockArtifact={useLabStore.getState().unlockArtifact}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'timeline' && (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <TimelineTab
                                temporalEnergy={temporalEnergy}
                                repairedAnomalies={repairedAnomalies}
                                repairAnomaly={repairAnomaly}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'prestige' && (
                        <motion.div
                            key="prestige"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <PrestigeTab
                                timelineStability={timelineStability}
                                totalEnergyProduced={totalEnergyProduced}
                                temporalShards={temporalShards}
                                prestigeCount={prestigeCount}
                                permanentMultiplier={permanentMultiplier}
                                prestige={prestige}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Artifacts Tab Component
interface ArtifactsTabProps {
    selectedArtifact: string | null;
    setSelectedArtifact: (id: string | null) => void;
    getArtifactStatus: (artifact: typeof ARTIFACTS[0]) => { storyCompleted: boolean; level: number; unlocked: boolean };
    getArtifactProduction: (artifactId: string) => number;
    upgradeLevels: Record<string, number>;
    temporalEnergy: number;
    buyUpgrade: (upgradeId: string) => boolean;
    getUpgradeCost: (upgradeId: string) => number;
    unlockArtifact: (artifactId: string) => void;
}

const ArtifactsTab: React.FC<ArtifactsTabProps> = ({
    selectedArtifact,
    setSelectedArtifact,
    getArtifactStatus,
    getArtifactProduction,
    upgradeLevels,
    temporalEnergy,
    buyUpgrade,
    getUpgradeCost,
    unlockArtifact,
}) => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-purple-400">Your Artifacts</h2>

            {/* Artifact Cards */}
            <div className="space-y-3">
                {ARTIFACTS.map((artifact) => {
                    const status = getArtifactStatus(artifact);
                    const production = getArtifactProduction(artifact.id);
                    const isSelected = selectedArtifact === artifact.id;

                    return (
                        <motion.div
                            key={artifact.id}
                            className={`
                                p-4 rounded-xl border-2 transition-all
                                ${status.unlocked
                                    ? 'bg-slate-900 border-purple-700 cursor-pointer'
                                    : status.storyCompleted
                                        ? 'bg-slate-900/50 border-amber-700/50 cursor-pointer'
                                        : 'bg-slate-900/30 border-slate-700 opacity-50'
                                }
                                ${isSelected ? 'ring-2 ring-purple-500' : ''}
                            `}
                            onClick={() => {
                                if (!status.storyCompleted) return;
                                if (!status.unlocked) {
                                    // Activate the artifact!
                                    unlockArtifact(artifact.id);
                                } else {
                                    // Toggle selection for upgrades
                                    setSelectedArtifact(isSelected ? null : artifact.id);
                                }
                            }}
                            whileTap={status.storyCompleted ? { scale: 0.98 } : {}}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`
                                    text-3xl w-14 h-14 rounded-lg flex items-center justify-center
                                    ${status.unlocked
                                        ? 'bg-purple-900/50'
                                        : 'bg-slate-800'
                                    }
                                `}>
                                    {status.unlocked ? artifact.icon : <Lock className="w-6 h-6 text-slate-600" />}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-white">{artifact.name}</div>
                                    <div className="text-xs text-slate-400">{artifact.era}</div>
                                    {status.unlocked ? (
                                        <div className="text-sm text-cyan-400 flex items-center gap-1">
                                            <Zap className="w-3 h-3" />
                                            +{formatEnergy(production)}/s
                                        </div>
                                    ) : status.storyCompleted ? (
                                        <div className="text-sm text-amber-400">Tap to activate!</div>
                                    ) : (
                                        <div className="text-sm text-slate-500">Complete story to unlock</div>
                                    )}
                                </div>
                                {status.unlocked && (
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500">Level</div>
                                        <div className="text-lg font-bold text-purple-400">{status.level}</div>
                                    </div>
                                )}
                                {status.storyCompleted && (
                                    <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                                )}
                            </div>

                            {/* Expanded Upgrades */}
                            <AnimatePresence>
                                {isSelected && status.unlocked && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
                                            <div className="text-sm text-slate-400 mb-2">Upgrades</div>
                                            {UPGRADES.filter(u => u.artifactId === artifact.id).map((upgrade) => {
                                                const level = upgradeLevels[upgrade.id] || 0;
                                                const cost = getUpgradeCost(upgrade.id);
                                                const canAfford = temporalEnergy >= cost;
                                                const maxed = level >= upgrade.maxLevel;

                                                return (
                                                    <button
                                                        key={upgrade.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            buyUpgrade(upgrade.id);
                                                        }}
                                                        disabled={!canAfford || maxed}
                                                        className={`
                                                            w-full p-3 rounded-lg text-left transition-all
                                                            ${maxed
                                                                ? 'bg-green-900/30 border border-green-700'
                                                                : canAfford
                                                                    ? 'bg-purple-900/30 border border-purple-700 hover:bg-purple-900/50'
                                                                    : 'bg-slate-800/50 border border-slate-700 opacity-50'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="font-medium text-white text-sm">{upgrade.name}</div>
                                                                <div className="text-xs text-slate-400">{upgrade.description}</div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-xs text-slate-500">Lv {level}/{upgrade.maxLevel}</div>
                                                                {!maxed && (
                                                                    <div className={`text-sm font-mono ${canAfford ? 'text-cyan-400' : 'text-slate-500'}`}>
                                                                        {formatEnergy(cost)}
                                                                    </div>
                                                                )}
                                                                {maxed && (
                                                                    <div className="text-sm text-green-400">MAX</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Timeline Tab Component
interface TimelineTabProps {
    temporalEnergy: number;
    repairedAnomalies: string[];
    repairAnomaly: (anomalyId: string) => boolean;
}

const TimelineTab: React.FC<TimelineTabProps> = ({
    temporalEnergy,
    repairedAnomalies,
    repairAnomaly,
}) => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-purple-400">Timeline Repairs</h2>
            <p className="text-sm text-slate-400">
                Spend Temporal Energy to repair anomalies and restore the timeline.
            </p>

            <div className="space-y-3">
                {ANOMALIES.map((anomaly) => {
                    const repaired = repairedAnomalies.includes(anomaly.id);
                    const canAfford = temporalEnergy >= anomaly.cost;

                    return (
                        <motion.button
                            key={anomaly.id}
                            onClick={() => repairAnomaly(anomaly.id)}
                            disabled={repaired || !canAfford}
                            className={`
                                w-full p-4 rounded-xl border-2 text-left transition-all
                                ${repaired
                                    ? 'bg-green-900/20 border-green-700/50'
                                    : canAfford
                                        ? 'bg-slate-900 border-purple-700 hover:bg-slate-800'
                                        : 'bg-slate-900/50 border-slate-700 opacity-60'
                                }
                            `}
                            whileTap={!repaired && canAfford ? { scale: 0.98 } : {}}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`
                                    w-12 h-12 rounded-lg flex items-center justify-center text-xl
                                    ${repaired
                                        ? 'bg-green-900/50 text-green-400'
                                        : 'bg-purple-900/50 text-purple-400'
                                    }
                                `}>
                                    {repaired ? '✓' : <Clock className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-white">{anomaly.name}</div>
                                    <div className="text-xs text-slate-400">{anomaly.description}</div>
                                    {!repaired && (
                                        <div className="text-sm text-cyan-400 mt-1">
                                            +{anomaly.stabilityGain}% stability
                                        </div>
                                    )}
                                </div>
                                {!repaired && (
                                    <div className="text-right">
                                        <div className={`text-lg font-mono ${canAfford ? 'text-cyan-400' : 'text-slate-500'}`}>
                                            {formatEnergy(anomaly.cost)}
                                        </div>
                                    </div>
                                )}
                                {repaired && (
                                    <div className="text-green-400 text-sm font-medium">Repaired</div>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

// Prestige Tab Component
interface PrestigeTabProps {
    timelineStability: number;
    totalEnergyProduced: number;
    temporalShards: number;
    prestigeCount: number;
    permanentMultiplier: number;
    prestige: () => void;
}

const PrestigeTab: React.FC<PrestigeTabProps> = ({
    timelineStability,
    totalEnergyProduced,
    temporalShards,
    prestigeCount,
    permanentMultiplier,
    prestige,
}) => {
    const potentialShards = Math.floor(Math.sqrt(totalEnergyProduced / 1000));
    const canPrestige = timelineStability >= 100 && potentialShards > 0;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-purple-400">Temporal Transcendence</h2>

            {/* Current Shards */}
            <div className="bg-slate-900 rounded-xl p-4 border-2 border-amber-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-amber-900/50 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xs text-amber-400 uppercase">Temporal Shards</div>
                        <div className="text-3xl font-bold text-amber-300">{temporalShards}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500">Production Bonus</div>
                        <div className="text-xl font-bold text-green-400">×{permanentMultiplier.toFixed(1)}</div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                    <div className="text-xs text-slate-500">Times Prestiged</div>
                    <div className="text-xl font-bold text-purple-400">{prestigeCount}</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                    <div className="text-xs text-slate-500">Total Energy Ever</div>
                    <div className="text-xl font-bold text-cyan-400">{formatEnergy(totalEnergyProduced)}</div>
                </div>
            </div>

            {/* Prestige Button */}
            <div className="bg-slate-900 rounded-xl p-4 border-2 border-purple-700">
                <div className="text-center mb-4">
                    <div className="text-sm text-slate-400 mb-2">
                        {timelineStability < 100
                            ? `Restore the timeline to 100% stability to prestige (${timelineStability.toFixed(1)}%)`
                            : potentialShards > 0
                                ? `You will earn ${potentialShards} Temporal Shards`
                                : 'Produce more energy to earn shards'
                        }
                    </div>
                </div>
                <button
                    onClick={prestige}
                    disabled={!canPrestige}
                    className={`
                        w-full py-4 rounded-xl text-lg font-bold uppercase tracking-wider
                        flex items-center justify-center gap-2 transition-all
                        ${canPrestige
                            ? 'bg-gradient-to-r from-purple-600 to-amber-600 text-white hover:from-purple-500 hover:to-amber-500'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }
                    `}
                >
                    <RotateCcw className="w-5 h-5" />
                    Transcend Timeline
                </button>
                {canPrestige && (
                    <div className="text-xs text-center text-amber-400 mt-2">
                        Warning: This will reset your progress but keep artifacts unlocked
                    </div>
                )}
            </div>

            {/* How it works */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <div className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    How Prestige Works
                </div>
                <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Restore the timeline to 100% stability</li>
                    <li>• Earn Temporal Shards based on total energy produced</li>
                    <li>• Each shard gives +10% permanent production bonus</li>
                    <li>• Your artifacts stay unlocked but reset to level 1</li>
                    <li>• Upgrades and timeline progress reset</li>
                </ul>
            </div>
        </div>
    );
};

export default Lab;
