'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdsStore, AdRewardType, getAdRewardInfo } from '@/lib/ads';
import { useStore } from '@/lib/store';
import { useLabStore } from '@/lib/labStore';
import { gameHaptics } from '@/lib/haptics';
import { PlayCircle, Coins, Zap, Star, Heart, Loader2, Check, X } from 'lucide-react';
import { sfx } from '@/lib/audio';

interface WatchAdButtonProps {
    rewardType: AdRewardType;
    onRewardEarned?: (amount: number) => void;
    className?: string;
    variant?: 'default' | 'compact' | 'banner';
    disabled?: boolean;
}

const REWARD_ICONS: Record<AdRewardType, React.ReactNode> = {
    bonus_coins: <Coins className="w-5 h-5" />,
    double_score: <Star className="w-5 h-5" />,
    production_boost: <Zap className="w-5 h-5" />,
    revive: <Heart className="w-5 h-5" />,
};

const REWARD_COLORS: Record<AdRewardType, string> = {
    bonus_coins: 'from-amber-600 to-yellow-500',
    double_score: 'from-purple-600 to-pink-500',
    production_boost: 'from-cyan-600 to-blue-500',
    revive: 'from-red-600 to-rose-500',
};

export const WatchAdButton: React.FC<WatchAdButtonProps> = ({
    rewardType,
    onRewardEarned,
    className = '',
    variant = 'default',
    disabled = false,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { canWatchAd, getRemainingAds, showRewardedAd, isAdLoaded } = useAdsStore();
    const addCoins = useStore((s) => s.addCoins);

    const canWatch = canWatchAd() && !disabled;
    const remainingAds = getRemainingAds();
    const rewardInfo = getAdRewardInfo(rewardType);

    const handleWatchAd = async () => {
        if (!canWatch || isLoading) return;

        setIsLoading(true);

        try {
            const reward = await showRewardedAd(rewardType);

            if (reward) {
                // Handle the reward based on type
                if (rewardType === 'bonus_coins') {
                    addCoins(reward.amount);
                }

                await gameHaptics.coinsEarned();
                sfx.reward();

                // Notify parent component
                onRewardEarned?.(reward.amount);

                // Show success feedback
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            }
        } catch (error) {
            console.error('Failed to show ad:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Compact variant (icon only with tooltip)
    if (variant === 'compact') {
        return (
            <motion.button
                onClick={handleWatchAd}
                disabled={!canWatch || isLoading}
                className={`
                    relative p-2 rounded-lg transition-all
                    ${canWatch
                        ? `bg-gradient-to-r ${REWARD_COLORS[rewardType]} text-white hover:scale-105`
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }
                    ${className}
                `}
                whileTap={canWatch ? { scale: 0.95 } : {}}
            >
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </motion.div>
                    ) : showSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Check className="w-5 h-5" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="icon"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-1"
                        >
                            <PlayCircle className="w-4 h-4" />
                            {REWARD_ICONS[rewardType]}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        );
    }

    // Banner variant (horizontal, good for Lab/Store)
    if (variant === 'banner') {
        return (
            <motion.button
                onClick={handleWatchAd}
                disabled={!canWatch || isLoading}
                className={`
                    w-full p-4 rounded-xl border-2 transition-all text-left
                    ${canWatch
                        ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-amber-600/50 hover:border-amber-500'
                        : 'bg-slate-900/50 border-slate-700 opacity-60 cursor-not-allowed'
                    }
                    ${className}
                `}
                whileTap={canWatch ? { scale: 0.98 } : {}}
            >
                <div className="flex items-center gap-4">
                    <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center
                        bg-gradient-to-br ${REWARD_COLORS[rewardType]}
                    `}>
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : showSuccess ? (
                            <Check className="w-6 h-6 text-white" />
                        ) : (
                            <PlayCircle className="w-6 h-6 text-white" />
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">Watch Ad</span>
                            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                                FREE
                            </span>
                        </div>
                        <div className="text-sm text-slate-400 flex items-center gap-1">
                            {REWARD_ICONS[rewardType]}
                            <span>{rewardInfo.description}</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-xs text-slate-500">{remainingAds}/3 today</div>
                        {!canWatch && remainingAds === 0 && (
                            <div className="text-xs text-amber-400">Reset tomorrow</div>
                        )}
                    </div>
                </div>
            </motion.button>
        );
    }

    // Default variant (full button)
    return (
        <motion.button
            onClick={handleWatchAd}
            disabled={!canWatch || isLoading}
            className={`
                relative overflow-hidden rounded-xl transition-all
                ${canWatch
                    ? `bg-gradient-to-r ${REWARD_COLORS[rewardType]} text-white shadow-lg hover:shadow-xl`
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }
                ${className}
            `}
            whileHover={canWatch ? { scale: 1.02 } : {}}
            whileTap={canWatch ? { scale: 0.98 } : {}}
        >
            <div className="px-6 py-4 flex items-center justify-center gap-3">
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading Ad...</span>
                    </>
                ) : showSuccess ? (
                    <>
                        <Check className="w-5 h-5" />
                        <span>Reward Earned!</span>
                    </>
                ) : (
                    <>
                        <PlayCircle className="w-5 h-5" />
                        <span>Watch Ad</span>
                        <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-sm">
                            {REWARD_ICONS[rewardType]}
                            {rewardInfo.description}
                        </span>
                    </>
                )}
            </div>

            {/* Remaining ads indicator */}
            {canWatch && (
                <div className="absolute top-1 right-1 text-[10px] bg-black/30 px-1.5 py-0.5 rounded">
                    {remainingAds} left
                </div>
            )}
        </motion.button>
    );
};

/**
 * WatchAdModal - Full-screen modal for ad rewards
 *
 * Use this when you want to present the ad option prominently,
 * like after a minigame failure for the revive option.
 */
interface WatchAdModalProps {
    isOpen: boolean;
    onClose: () => void;
    rewardType: AdRewardType;
    onRewardEarned?: (amount: number) => void;
    title?: string;
    description?: string;
}

export const WatchAdModal: React.FC<WatchAdModalProps> = ({
    isOpen,
    onClose,
    rewardType,
    onRewardEarned,
    title,
    description,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { canWatchAd, showRewardedAd } = useAdsStore();
    const addCoins = useStore((s) => s.addCoins);

    const canWatch = canWatchAd();
    const rewardInfo = getAdRewardInfo(rewardType);

    const handleWatchAd = async () => {
        if (!canWatch || isLoading) return;

        setIsLoading(true);

        try {
            const reward = await showRewardedAd(rewardType);

            if (reward) {
                if (rewardType === 'bonus_coins') {
                    addCoins(reward.amount);
                }

                await gameHaptics.coinsEarned();
                sfx.reward();
                onRewardEarned?.(reward.amount);

                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    onClose();
                }, 1500);
            }
        } catch (error) {
            console.error('Failed to show ad:', error);
        } finally {
            setIsLoading(false);
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
                    className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-sm overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${REWARD_COLORS[rewardType]} p-6 text-center relative`}>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/80 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            {REWARD_ICONS[rewardType]}
                        </div>

                        <h2 className="text-xl font-bold text-white">
                            {title || 'Watch Ad for Reward'}
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center">
                        <p className="text-slate-400 mb-6">
                            {description || `Watch a short video to earn ${rewardInfo.description}`}
                        </p>

                        <AnimatePresence mode="wait">
                            {showSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    <Check className="w-5 h-5" />
                                    Reward Earned!
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="button"
                                    onClick={handleWatchAd}
                                    disabled={!canWatch || isLoading}
                                    className={`
                                        w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                                        ${canWatch
                                            ? `bg-gradient-to-r ${REWARD_COLORS[rewardType]} text-white hover:opacity-90`
                                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                        }
                                    `}
                                    whileTap={canWatch ? { scale: 0.98 } : {}}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <PlayCircle className="w-5 h-5" />
                                            Watch Ad
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {!canWatch && (
                            <p className="text-amber-400 text-sm mt-3">
                                Daily ad limit reached. Come back tomorrow!
                            </p>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WatchAdButton;
