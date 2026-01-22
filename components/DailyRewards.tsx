'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDailyRewardsStore, DAILY_REWARDS } from '@/lib/dailyRewards';
import { useStore } from '@/lib/store';
import { gameHaptics } from '@/lib/haptics';
import {
    Gift,
    Coins,
    Flame,
    Calendar,
    Check,
    Lock,
    Star,
    X,
    Shield,
} from 'lucide-react';

interface DailyRewardsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DailyRewardsModal: React.FC<DailyRewardsModalProps> = ({ isOpen, onClose }) => {
    const {
        currentStreak,
        longestStreak,
        canClaimToday,
        getTodayReward,
        getWeekRewards,
        getStreakMultiplier,
        claimDailyReward,
        streakProtectionUsed,
    } = useDailyRewardsStore();

    const addCoins = useStore((s) => s.addCoins);
    const [showClaimed, setShowClaimed] = useState(false);
    const [claimedAmount, setClaimedAmount] = useState(0);

    const canClaim = canClaimToday();
    const todayReward = getTodayReward();
    const weekRewards = getWeekRewards();
    const multiplier = getStreakMultiplier();

    const handleClaim = async () => {
        const result = claimDailyReward();
        if (result) {
            addCoins(result.coins);
            setClaimedAmount(result.coins);
            setShowClaimed(true);
            await gameHaptics.coinsEarned();

            // Auto close after animation
            setTimeout(() => {
                setShowClaimed(false);
                onClose();
            }, 2000);
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
                    className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/80 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Gift className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Daily Rewards</h2>
                                <p className="text-white/80 text-sm">Claim your daily bonus!</p>
                            </div>
                        </div>
                    </div>

                    {/* Streak Info */}
                    <div className="p-4 bg-slate-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <span className="text-white font-medium">{currentStreak} Day Streak</span>
                            {multiplier > 1 && (
                                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                                    {multiplier}x Bonus
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Star className="w-4 h-4" />
                            Best: {longestStreak}
                        </div>
                    </div>

                    {/* Streak Protection */}
                    {!streakProtectionUsed && (
                        <div className="px-4 py-2 bg-blue-500/10 border-y border-blue-500/20 flex items-center gap-2 text-sm">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-300">Streak Protection available (1 free miss/week)</span>
                        </div>
                    )}

                    {/* Week Calendar */}
                    <div className="p-4">
                        <div className="grid grid-cols-7 gap-2">
                            {weekRewards.map((reward, index) => {
                                const isToday = index === (currentStreak % 7) && canClaim;
                                const isClaimed = reward.claimed;
                                const isFuture = index > (currentStreak % 7) || (index === (currentStreak % 7) && isClaimed);

                                return (
                                    <div
                                        key={reward.day}
                                        className={`
                                            relative flex flex-col items-center p-2 rounded-lg border-2 transition-all
                                            ${isToday
                                                ? 'border-amber-500 bg-amber-500/20 scale-105'
                                                : isClaimed
                                                    ? 'border-green-500/50 bg-green-500/10'
                                                    : 'border-slate-700 bg-slate-800/50'
                                            }
                                        `}
                                    >
                                        <span className="text-[10px] text-slate-400 mb-1">Day {reward.day}</span>
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center mb-1
                                            ${isClaimed
                                                ? 'bg-green-500'
                                                : isToday
                                                    ? 'bg-amber-500'
                                                    : 'bg-slate-700'
                                            }
                                        `}>
                                            {isClaimed ? (
                                                <Check className="w-4 h-4 text-white" />
                                            ) : isToday ? (
                                                <Gift className="w-4 h-4 text-white" />
                                            ) : (
                                                <Lock className="w-3 h-3 text-slate-500" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            <Coins className="w-3 h-3 text-amber-400" />
                                            <span className={`text-xs ${isToday ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                                                {reward.coins}
                                            </span>
                                        </div>
                                        {reward.bonus && (
                                            <span className="absolute -top-1 -right-1 text-[8px] bg-purple-500 text-white px-1 rounded">
                                                BONUS
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Claim Button */}
                    <div className="p-4 pt-0">
                        <AnimatePresence mode="wait">
                            {showClaimed ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-green-500 text-white py-4 rounded-xl text-center font-bold text-lg flex items-center justify-center gap-2"
                                >
                                    <Check className="w-5 h-5" />
                                    +{claimedAmount} Coins Claimed!
                                </motion.div>
                            ) : canClaim ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleClaim}
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Gift className="w-5 h-5" />
                                    Claim {Math.floor(todayReward.coins * multiplier)} Coins
                                </motion.button>
                            ) : (
                                <div className="bg-slate-800 text-slate-400 py-4 rounded-xl text-center font-medium flex items-center justify-center gap-2">
                                    <Check className="w-5 h-5 text-green-500" />
                                    Today's Reward Claimed
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer hint */}
                    <div className="px-4 pb-4 text-center text-xs text-slate-500">
                        Come back tomorrow to continue your streak!
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Small badge/button to show in navbar or home
export const DailyRewardsBadge: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const canClaim = useDailyRewardsStore((s) => s.canClaimToday());
    const currentStreak = useDailyRewardsStore((s) => s.currentStreak);

    return (
        <button
            onClick={onClick}
            className={`
                relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                ${canClaim
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }
            `}
        >
            <Gift className="w-4 h-4" />
            {canClaim && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            )}
            {currentStreak > 0 && (
                <span className="flex items-center gap-1 text-sm">
                    <Flame className="w-3 h-3 text-orange-400" />
                    {currentStreak}
                </span>
            )}
        </button>
    );
};

export default DailyRewardsModal;
