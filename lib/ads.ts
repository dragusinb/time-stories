import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Capacitor } from '@capacitor/core';
import {
    AdMob,
    AdOptions,
    AdLoadInfo,
    RewardAdOptions,
    RewardAdPluginEvents,
    AdMobRewardItem,
} from '@capacitor-community/admob';

// Ad Unit IDs - Replace with your actual IDs in production
const AD_UNIT_IDS = {
    // Test IDs for development
    ios: {
        rewarded: 'ca-app-pub-3940256099942544/1712485313', // Test ID
    },
    android: {
        rewarded: 'ca-app-pub-3940256099942544/5224354917', // Test ID
    },
};

// Reward types
export type AdRewardType =
    | 'bonus_coins' // Watch ad for 5 bonus coins
    | 'double_score' // Double minigame score
    | 'production_boost' // 30-min lab production boost
    | 'revive'; // Revive failed minigame

interface AdReward {
    type: AdRewardType;
    amount: number;
    description: string;
}

const AD_REWARDS: Record<AdRewardType, AdReward> = {
    bonus_coins: {
        type: 'bonus_coins',
        amount: 5,
        description: '5 Bonus Coins',
    },
    double_score: {
        type: 'double_score',
        amount: 2,
        description: 'Double Score',
    },
    production_boost: {
        type: 'production_boost',
        amount: 30, // minutes
        description: '30-min 2x Production',
    },
    revive: {
        type: 'revive',
        amount: 1,
        description: 'Revive Attempt',
    },
};

interface AdsState {
    isInitialized: boolean;
    isAdLoaded: boolean;
    isAdShowing: boolean;
    dailyAdsWatched: number;
    lastAdDate: string | null;
    productionBoostUntil: number | null; // Timestamp

    // Limits
    maxDailyAds: number;

    // Actions
    initialize: () => Promise<void>;
    loadRewardedAd: () => Promise<boolean>;
    showRewardedAd: (rewardType: AdRewardType) => Promise<AdReward | null>;
    canWatchAd: () => boolean;
    getRemainingAds: () => number;
    hasProductionBoost: () => boolean;
    resetDailyAds: () => void;
}

const isNative = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform() as 'ios' | 'android' | 'web';

const getTodayDate = (): string => new Date().toISOString().split('T')[0];

export const useAdsStore = create<AdsState>()(
    persist(
        (set, get) => ({
            isInitialized: false,
            isAdLoaded: false,
            isAdShowing: false,
            dailyAdsWatched: 0,
            lastAdDate: null,
            productionBoostUntil: null,
            maxDailyAds: 3,

            initialize: async () => {
                if (!isNative || get().isInitialized) return;

                try {
                    await AdMob.initialize({
                        initializeForTesting: process.env.NODE_ENV === 'development',
                    });

                    // Set up event listeners
                    AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
                        set({ isAdLoaded: true });
                    });

                    AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
                        set({ isAdLoaded: false });
                    });

                    AdMob.addListener(RewardAdPluginEvents.Showed, () => {
                        set({ isAdShowing: true });
                    });

                    AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
                        set({ isAdShowing: false, isAdLoaded: false });
                        // Preload next ad
                        get().loadRewardedAd();
                    });

                    set({ isInitialized: true });

                    // Check if we need to reset daily counter
                    const today = getTodayDate();
                    if (get().lastAdDate !== today) {
                        set({ dailyAdsWatched: 0, lastAdDate: today });
                    }

                    // Preload first ad
                    await get().loadRewardedAd();
                } catch (error) {
                    console.error('AdMob initialization error:', error);
                }
            },

            loadRewardedAd: async () => {
                if (!isNative || !get().isInitialized) return false;

                try {
                    const adUnitId =
                        platform === 'ios'
                            ? AD_UNIT_IDS.ios.rewarded
                            : AD_UNIT_IDS.android.rewarded;

                    const options: RewardAdOptions = {
                        adId: adUnitId,
                        isTesting: process.env.NODE_ENV === 'development',
                    };

                    await AdMob.prepareRewardVideoAd(options);
                    set({ isAdLoaded: true });
                    return true;
                } catch (error) {
                    console.error('Failed to load rewarded ad:', error);
                    set({ isAdLoaded: false });
                    return false;
                }
            },

            showRewardedAd: async (rewardType) => {
                const state = get();

                // Check daily limit
                if (!state.canWatchAd()) {
                    return null;
                }

                // Web fallback - simulate ad
                if (!isNative) {
                    // Simulate watching an ad with a delay
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    const today = getTodayDate();
                    set({
                        dailyAdsWatched: state.dailyAdsWatched + 1,
                        lastAdDate: today,
                    });

                    const reward = AD_REWARDS[rewardType];

                    // Handle production boost specially
                    if (rewardType === 'production_boost') {
                        set({
                            productionBoostUntil: Date.now() + reward.amount * 60 * 1000,
                        });
                    }

                    return reward;
                }

                // Native ad flow
                if (!state.isAdLoaded) {
                    const loaded = await state.loadRewardedAd();
                    if (!loaded) return null;
                }

                return new Promise(async (resolve) => {
                    let rewardListenerHandle: { remove: () => Promise<void> } | null = null;
                    let failListenerHandle: { remove: () => Promise<void> } | null = null;

                    const cleanup = async () => {
                        if (rewardListenerHandle) await rewardListenerHandle.remove();
                        if (failListenerHandle) await failListenerHandle.remove();
                    };

                    // Set up reward listener for this specific show
                    rewardListenerHandle = await AdMob.addListener(
                        RewardAdPluginEvents.Rewarded,
                        async (reward: AdMobRewardItem) => {
                            const today = getTodayDate();
                            set({
                                dailyAdsWatched: state.dailyAdsWatched + 1,
                                lastAdDate: today,
                            });

                            const adReward = AD_REWARDS[rewardType];

                            // Handle production boost specially
                            if (rewardType === 'production_boost') {
                                set({
                                    productionBoostUntil: Date.now() + adReward.amount * 60 * 1000,
                                });
                            }

                            await cleanup();
                            resolve(adReward);
                        }
                    );

                    // Set up failure listener
                    failListenerHandle = await AdMob.addListener(
                        RewardAdPluginEvents.FailedToShow,
                        async () => {
                            await cleanup();
                            resolve(null);
                        }
                    );

                    // Show the ad
                    AdMob.showRewardVideoAd().catch(async () => {
                        await cleanup();
                        resolve(null);
                    });
                });
            },

            canWatchAd: () => {
                const state = get();
                const today = getTodayDate();

                // Reset counter if new day
                if (state.lastAdDate !== today) {
                    return true;
                }

                return state.dailyAdsWatched < state.maxDailyAds;
            },

            getRemainingAds: () => {
                const state = get();
                const today = getTodayDate();

                if (state.lastAdDate !== today) {
                    return state.maxDailyAds;
                }

                return Math.max(0, state.maxDailyAds - state.dailyAdsWatched);
            },

            hasProductionBoost: () => {
                const { productionBoostUntil } = get();
                if (!productionBoostUntil) return false;
                return Date.now() < productionBoostUntil;
            },

            resetDailyAds: () => {
                set({ dailyAdsWatched: 0, lastAdDate: getTodayDate() });
            },
        }),
        {
            name: 'timestories-ads',
        }
    )
);

// Helper to get reward info
export const getAdRewardInfo = (type: AdRewardType): AdReward => AD_REWARDS[type];

// Export reward types for components
export { AD_REWARDS };
