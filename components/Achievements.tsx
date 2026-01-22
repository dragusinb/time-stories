'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    useAchievementsStore,
    ACHIEVEMENTS,
    Achievement,
    AchievementCategory,
} from '@/lib/achievements';
import { useStore } from '@/lib/store';
import { gameHaptics } from '@/lib/haptics';
import {
    Trophy,
    Lock,
    Check,
    Coins,
    Gift,
    X,
    Star,
    Gamepad2,
    BookOpen,
    Calendar,
    Sparkles,
} from 'lucide-react';

const CATEGORY_ICONS: Record<AchievementCategory, React.ReactNode> = {
    story: <BookOpen className="w-4 h-4" />,
    minigame: <Gamepad2 className="w-4 h-4" />,
    collection: <Star className="w-4 h-4" />,
    dedication: <Calendar className="w-4 h-4" />,
    special: <Sparkles className="w-4 h-4" />,
};

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
    story: 'Story',
    minigame: 'Minigame',
    collection: 'Collection',
    dedication: 'Dedication',
    special: 'Special',
};

interface AchievementsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AchievementCard: React.FC<{
    achievement: Achievement;
    onClaim: () => void;
}> = ({ achievement, onClaim }) => {
    const progress = useAchievementsStore((s) => s.getProgress(achievement.id));
    const isUnlocked = useAchievementsStore((s) => s.isUnlocked(achievement.id));

    const currentProgress = progress?.currentProgress || 0;
    const progressPercent = Math.min(100, (currentProgress / achievement.requirement) * 100);
    const canClaim = isUnlocked && !progress?.rewardClaimed;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                p-4 rounded-xl border-2 transition-all
                ${isUnlocked
                    ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-600/50'
                    : 'bg-slate-800/50 border-slate-700'
                }
            `}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                    className={`
                        w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                        ${isUnlocked ? 'bg-amber-500/20' : 'bg-slate-700'}
                    `}
                >
                    {achievement.secret && !isUnlocked ? '❓' : achievement.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className={`font-bold ${isUnlocked ? 'text-amber-400' : 'text-white'}`}>
                            {achievement.secret && !isUnlocked ? '???' : achievement.title}
                        </h3>
                        {isUnlocked && progress?.rewardClaimed && (
                            <Check className="w-4 h-4 text-green-500" />
                        )}
                    </div>

                    <p className="text-sm text-slate-400 mt-0.5">
                        {achievement.secret && !isUnlocked
                            ? 'Complete a hidden challenge'
                            : achievement.description}
                    </p>

                    {/* Progress bar */}
                    {!isUnlocked && (
                        <div className="mt-2">
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    className="h-full bg-amber-500"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                {currentProgress} / {achievement.requirement}
                            </p>
                        </div>
                    )}

                    {/* Reward */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-sm">
                            <Coins className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-400">{achievement.reward.coins}</span>
                            {achievement.reward.badge && (
                                <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                                    +Badge
                                </span>
                            )}
                        </div>

                        {canClaim && (
                            <button
                                onClick={onClaim}
                                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium rounded-lg flex items-center gap-1 transition-colors"
                            >
                                <Gift className="w-3 h-3" />
                                Claim
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
    const addCoins = useStore((s) => s.addCoins);
    const claimReward = useAchievementsStore((s) => s.claimReward);
    const totalUnlocked = useAchievementsStore((s) => s.totalUnlocked);

    const filteredAchievements =
        selectedCategory === 'all'
            ? ACHIEVEMENTS
            : ACHIEVEMENTS.filter((a) => a.category === selectedCategory);

    const handleClaim = async (achievementId: string) => {
        const reward = claimReward(achievementId);
        if (reward) {
            addCoins(reward.coins);
            await gameHaptics.trophyUnlock();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 relative shrink-0">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/80 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Achievements</h2>
                                <p className="text-white/80 text-sm">
                                    {totalUnlocked} / {ACHIEVEMENTS.length} unlocked
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-1 p-2 bg-slate-800/50 overflow-x-auto shrink-0">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                selectedCategory === 'all'
                                    ? 'bg-purple-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                        >
                            All
                        </button>
                        {(Object.keys(CATEGORY_LABELS) as AchievementCategory[]).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                                    selectedCategory === cat
                                        ? 'bg-purple-600 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                            >
                                {CATEGORY_ICONS[cat]}
                                {CATEGORY_LABELS[cat]}
                            </button>
                        ))}
                    </div>

                    {/* Achievements List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {filteredAchievements.map((achievement) => (
                            <AchievementCard
                                key={achievement.id}
                                achievement={achievement}
                                onClaim={() => handleClaim(achievement.id)}
                            />
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Badge to show achievement progress
export const AchievementsBadge: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const totalUnlocked = useAchievementsStore((s) => s.totalUnlocked);
    const progress = useAchievementsStore((s) => s.progress);

    // Check if any rewards are unclaimed
    const hasUnclaimedRewards = progress.some((p) => {
        const achievement = ACHIEVEMENTS.find((a) => a.id === p.achievementId);
        return (
            achievement &&
            p.currentProgress >= achievement.requirement &&
            !p.rewardClaimed
        );
    });

    return (
        <button
            onClick={onClick}
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
            <Trophy className="w-4 h-4" />
            <span className="text-sm">{totalUnlocked}</span>
            {hasUnclaimedRewards && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
        </button>
    );
};

export default AchievementsModal;
