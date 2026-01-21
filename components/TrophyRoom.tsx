'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Trophy, Lock, Star, Clock, Gamepad2, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface TrophyData {
    id: string;
    storyId: string;
    name: string;
    storyTitle: string;
    description: string;
    era: string;
    location: string;
    totalActs: number;
    icon: string;
    color: string;
    gradient: string;
    borderColor: string;
}

const TROPHIES: TrophyData[] = [
    {
        id: 'trophy-1',
        storyId: 'story-1',
        name: 'The Eagle Has Landed',
        storyTitle: 'Apollo 11',
        description: 'You guided humanity to the Moon and back. One small step for man, one giant leap for mankind.',
        era: '1969',
        location: 'The Moon',
        totalActs: 40,
        icon: '🚀',
        color: 'text-emerald-400',
        gradient: 'from-emerald-900/50 to-emerald-950/80',
        borderColor: 'border-emerald-500/30'
    },
    {
        id: 'trophy-2',
        storyId: 'story-2',
        name: "The Alchemist's Legacy",
        storyTitle: 'The Alchemist',
        description: 'You survived the Black Death and discovered the secrets of germ theory centuries before its time.',
        era: '1348',
        location: 'Florence',
        totalActs: 40,
        icon: '⚗️',
        color: 'text-amber-400',
        gradient: 'from-amber-900/50 to-amber-950/80',
        borderColor: 'border-amber-500/30'
    },
    {
        id: 'trophy-3',
        storyId: 'story-3',
        name: 'The Circles of Truth',
        storyTitle: 'Archimedes',
        description: 'You defended Syracuse alongside the greatest mind of antiquity. "Noli turbare circulos meos."',
        era: '212 BC',
        location: 'Syracuse',
        totalActs: 50,
        icon: '📐',
        color: 'text-blue-400',
        gradient: 'from-blue-900/50 to-blue-950/80',
        borderColor: 'border-blue-500/30'
    }
];

export default function TrophyRoom() {
    const completedStories = useStore((state) => state.completedStories);
    const completedMinigames = useStore((state) => state.completedMinigames);
    const unlockedActs = useStore((state) => state.unlockedActs);

    const [selectedTrophy, setSelectedTrophy] = useState<TrophyData | null>(null);

    const totalTrophies = TROPHIES.length;
    const earnedTrophies = completedStories.length;
    const completionPercent = Math.round((earnedTrophies / totalTrophies) * 100);

    // Calculate stats for a story
    const getStoryStats = (storyId: string, totalActs: number) => {
        const storyMinigames = completedMinigames.filter(m => m.startsWith(storyId));
        const storyUnlocked = unlockedActs.filter(a => a.startsWith(storyId));
        return {
            minigamesCompleted: storyMinigames.length,
            actsUnlocked: storyUnlocked.length + 5, // +5 for free acts
            progress: Math.min(100, Math.round(((storyUnlocked.length + 5) / totalActs) * 100))
        };
    };

    return (
        <div className="relative w-full min-h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8 overflow-auto">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '32px 32px'
                }}></div>
            </div>

            {/* Header */}
            <div className="relative z-10 text-center mb-8 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 mb-4"
                >
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-amber-500" />
                    </div>
                    <h1 className="text-2xl md:text-4xl font-serif font-bold text-white">
                        Trophy <span className="text-amber-500">Room</span>
                    </h1>
                </motion.div>

                <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto mb-6">
                    Complete stories to earn trophies and prove your mastery of time travel.
                </p>

                {/* Overall Progress */}
                <div className="inline-flex flex-col items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-xl px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">{earnedTrophies}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">Earned</div>
                        </div>
                        <div className="w-px h-10 bg-slate-700"></div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-500">{totalTrophies}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">Total</div>
                        </div>
                    </div>
                    <div className="w-full mt-2">
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${completionPercent}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                            />
                        </div>
                        <div className="text-xs text-amber-500 mt-1 font-mono">{completionPercent}% Complete</div>
                    </div>
                </div>
            </div>

            {/* Trophy Grid */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
                {TROPHIES.map((trophy, index) => {
                    const isUnlocked = completedStories.includes(trophy.storyId);
                    const stats = getStoryStats(trophy.storyId, trophy.totalActs);

                    return (
                        <motion.div
                            key={trophy.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                        >
                            <TrophyCard
                                trophy={trophy}
                                isUnlocked={isUnlocked}
                                stats={stats}
                                onClick={() => setSelectedTrophy(trophy)}
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* Empty State Message */}
            {earnedTrophies === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8 p-6 border border-dashed border-slate-700 rounded-xl max-w-md mx-auto"
                >
                    <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">
                        No trophies yet. Complete a story to earn your first trophy!
                    </p>
                    <Link
                        href="/"
                        className="inline-block mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Start a Story
                    </Link>
                </motion.div>
            )}

            {/* Trophy Detail Modal */}
            <AnimatePresence>
                {selectedTrophy && (
                    <TrophyModal
                        trophy={selectedTrophy}
                        isUnlocked={completedStories.includes(selectedTrophy.storyId)}
                        stats={getStoryStats(selectedTrophy.storyId, selectedTrophy.totalActs)}
                        onClose={() => setSelectedTrophy(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

interface TrophyCardProps {
    trophy: TrophyData;
    isUnlocked: boolean;
    stats: { minigamesCompleted: number; actsUnlocked: number; progress: number };
    onClick: () => void;
}

function TrophyCard({ trophy, isUnlocked, stats, onClick }: TrophyCardProps) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden
                ${isUnlocked
                    ? `bg-gradient-to-br ${trophy.gradient} ${trophy.borderColor} hover:border-opacity-60`
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }
            `}
        >
            {/* Unlock Shimmer Effect */}
            {isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
            )}

            <div className="relative z-10">
                {/* Trophy Icon & Status */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`
                        w-16 h-16 rounded-xl flex items-center justify-center text-3xl
                        ${isUnlocked
                            ? 'bg-black/30'
                            : 'bg-slate-800 grayscale opacity-50'
                        }
                    `}>
                        {isUnlocked ? trophy.icon : <Lock className="w-6 h-6 text-slate-600" />}
                    </div>

                    {isUnlocked && (
                        <div className="flex items-center gap-1 bg-green-500/20 border border-green-500/30 px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400 font-medium">Earned</span>
                        </div>
                    )}
                </div>

                {/* Trophy Info */}
                <h3 className={`font-bold text-lg mb-1 ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                    {trophy.name}
                </h3>
                <p className={`text-sm mb-3 ${isUnlocked ? trophy.color : 'text-slate-600'}`}>
                    {trophy.storyTitle}
                </p>

                {/* Era & Location */}
                <div className="flex items-center gap-3 text-xs mb-4">
                    <span className={`flex items-center gap-1 ${isUnlocked ? 'text-slate-300' : 'text-slate-600'}`}>
                        <Clock className="w-3 h-3" />
                        {trophy.era}
                    </span>
                    <span className={`${isUnlocked ? 'text-slate-400' : 'text-slate-700'}`}>•</span>
                    <span className={isUnlocked ? 'text-slate-300' : 'text-slate-600'}>
                        {trophy.location}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className={isUnlocked ? 'text-slate-400' : 'text-slate-600'}>Progress</span>
                        <span className={isUnlocked ? trophy.color : 'text-slate-600'}>{stats.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${isUnlocked ? 'bg-gradient-to-r from-white/60 to-white/80' : 'bg-slate-700'}`}
                        />
                    </div>
                </div>

                {/* Stats Row */}
                {isUnlocked && (
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-1.5">
                            <Gamepad2 className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs text-slate-300">{stats.minigamesCompleted} minigames</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs text-slate-300">{trophy.totalActs} acts</span>
                        </div>
                    </div>
                )}
            </div>
        </motion.button>
    );
}

interface TrophyModalProps {
    trophy: TrophyData;
    isUnlocked: boolean;
    stats: { minigamesCompleted: number; actsUnlocked: number; progress: number };
    onClose: () => void;
}

function TrophyModal({ trophy, isUnlocked, stats, onClose }: TrophyModalProps) {
    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full z-50"
            >
                <div className={`
                    h-full md:h-auto rounded-2xl border overflow-hidden
                    ${isUnlocked
                        ? `bg-gradient-to-br ${trophy.gradient} ${trophy.borderColor}`
                        : 'bg-slate-900 border-slate-700'
                    }
                `}>
                    {/* Header */}
                    <div className="p-6 text-center border-b border-white/10">
                        <div className={`
                            w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-5xl mb-4
                            ${isUnlocked ? 'bg-black/30' : 'bg-slate-800'}
                        `}>
                            {isUnlocked ? trophy.icon : <Lock className="w-10 h-10 text-slate-600" />}
                        </div>

                        <h2 className={`text-2xl font-bold mb-1 ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                            {trophy.name}
                        </h2>
                        <p className={`text-sm ${isUnlocked ? trophy.color : 'text-slate-600'}`}>
                            {trophy.storyTitle} • {trophy.era}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className={`text-sm leading-relaxed mb-6 ${isUnlocked ? 'text-slate-200' : 'text-slate-500'}`}>
                            {isUnlocked
                                ? trophy.description
                                : `Complete "${trophy.storyTitle}" to unlock this trophy and learn its secrets.`
                            }
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className={`text-center p-3 rounded-xl ${isUnlocked ? 'bg-black/20' : 'bg-slate-800/50'}`}>
                                <div className={`text-xl font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                                    {stats.progress}%
                                </div>
                                <div className="text-xs text-slate-500">Progress</div>
                            </div>
                            <div className={`text-center p-3 rounded-xl ${isUnlocked ? 'bg-black/20' : 'bg-slate-800/50'}`}>
                                <div className={`text-xl font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                                    {trophy.totalActs}
                                </div>
                                <div className="text-xs text-slate-500">Acts</div>
                            </div>
                            <div className={`text-center p-3 rounded-xl ${isUnlocked ? 'bg-black/20' : 'bg-slate-800/50'}`}>
                                <div className={`text-xl font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                                    {stats.minigamesCompleted}
                                </div>
                                <div className="text-xs text-slate-500">Minigames</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-colors"
                            >
                                Close
                            </button>
                            <Link
                                href={`/story/${trophy.storyId}/read`}
                                className={`
                                    flex-1 px-4 py-3 text-center text-sm font-medium rounded-xl transition-colors
                                    ${isUnlocked
                                        ? 'bg-white/20 hover:bg-white/30 text-white'
                                        : 'bg-amber-600 hover:bg-amber-500 text-white'
                                    }
                                `}
                            >
                                {isUnlocked ? 'Replay Story' : 'Start Story'}
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
