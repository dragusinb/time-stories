import { Capacitor } from '@capacitor/core';

/**
 * Analytics System
 *
 * Unified analytics interface that can be connected to various backends:
 * - Console (development)
 * - Firebase Analytics (production)
 * - Mixpanel, Amplitude, etc.
 *
 * Events follow a consistent naming convention:
 * - User journey: story_started, act_completed, story_completed
 * - Minigames: minigame_started, minigame_completed, minigame_failed
 * - Monetization: store_viewed, purchase_started, purchase_completed
 * - Engagement: app_opened, daily_reward_claimed, achievement_unlocked
 * - Lab: artifact_unlocked, upgrade_purchased, anomaly_repaired, prestige
 */

// Event types for type safety
export type AnalyticsEvent =
    // User Journey
    | 'app_opened'
    | 'onboarding_started'
    | 'onboarding_completed'
    | 'onboarding_skipped'
    // Stories
    | 'story_started'
    | 'story_completed'
    | 'act_viewed'
    | 'act_unlocked'
    | 'act_completed'
    // Minigames
    | 'minigame_started'
    | 'minigame_completed'
    | 'minigame_failed'
    | 'minigame_retried'
    // Monetization
    | 'store_viewed'
    | 'purchase_started'
    | 'purchase_completed'
    | 'purchase_failed'
    | 'purchase_restored'
    | 'ad_watched'
    | 'ad_reward_earned'
    // Engagement
    | 'daily_reward_claimed'
    | 'achievement_unlocked'
    | 'achievement_claimed'
    | 'trophy_earned'
    // Lab
    | 'lab_opened'
    | 'artifact_unlocked'
    | 'artifact_upgraded'
    | 'upgrade_purchased'
    | 'anomaly_repaired'
    | 'daily_bonus_claimed'
    | 'prestige_completed'
    // Navigation
    | 'screen_viewed'
    | 'button_clicked';

// Event parameters
export interface EventParams {
    // Story events
    story_id?: string;
    story_name?: string;
    act_number?: number;
    // Minigame events
    minigame_type?: string;
    minigame_score?: number;
    minigame_time_ms?: number;
    minigame_attempts?: number;
    // Purchase events
    product_id?: string;
    package_id?: string;
    price?: number;
    currency?: string;
    coins_amount?: number;
    // Engagement events
    streak_count?: number;
    reward_coins?: number;
    achievement_id?: string;
    achievement_name?: string;
    // Lab events
    artifact_id?: string;
    artifact_name?: string;
    upgrade_id?: string;
    anomaly_id?: string;
    energy_amount?: number;
    shards_earned?: number;
    prestige_count?: number;
    timeline_stability?: number;
    // Ad events
    ad_type?: string;
    ad_reward_type?: string;
    // Navigation
    screen_name?: string;
    button_name?: string;
    source?: string;
    // Generic
    success?: boolean;
    error_message?: string;
    [key: string]: string | number | boolean | undefined;
}

// Session data
interface SessionData {
    sessionId: string;
    sessionNumber: number;
    sessionStartTime: number;
    platform: string;
    isNative: boolean;
}

// Analytics state
let isInitialized = false;
let sessionData: SessionData | null = null;
let userId: string | null = null;

// Generate unique session ID
const generateSessionId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create anonymous user ID
const getAnonymousUserId = (): string => {
    if (typeof window === 'undefined') return 'server';

    let id = localStorage.getItem('analytics_user_id');
    if (!id) {
        id = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('analytics_user_id', id);
    }
    return id;
};

// Get session number (increments each app open)
const getSessionNumber = (): number => {
    if (typeof window === 'undefined') return 0;

    const count = parseInt(localStorage.getItem('analytics_session_count') || '0', 10) + 1;
    localStorage.setItem('analytics_session_count', count.toString());
    return count;
};

/**
 * Initialize analytics
 * Call this once when the app starts
 */
export const initializeAnalytics = async (): Promise<void> => {
    if (isInitialized) return;

    const platform = Capacitor.getPlatform();
    const isNative = Capacitor.isNativePlatform();

    userId = getAnonymousUserId();
    sessionData = {
        sessionId: generateSessionId(),
        sessionNumber: getSessionNumber(),
        sessionStartTime: Date.now(),
        platform,
        isNative,
    };

    isInitialized = true;

    // Track app opened
    track('app_opened', {
        session_number: sessionData.sessionNumber,
    });

    // Log initialization in development
    if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics] Initialized', {
            userId,
            sessionData,
        });
    }

    // TODO: Initialize Firebase Analytics here when ready
    // if (isNative) {
    //     await FirebaseAnalytics.setUserId({ userId });
    //     await FirebaseAnalytics.setUserProperty({ name: 'platform', value: platform });
    // }
};

/**
 * Track an analytics event
 */
export const track = (event: AnalyticsEvent, params: EventParams = {}): void => {
    if (!isInitialized && typeof window !== 'undefined') {
        // Auto-initialize if not done yet
        initializeAnalytics();
    }

    const enrichedParams: EventParams = {
        ...params,
        timestamp: Date.now(),
        session_id: sessionData?.sessionId,
        user_id: userId || undefined,
        platform: sessionData?.platform,
    };

    // Development logging
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${event}`, enrichedParams);
    }

    // TODO: Send to Firebase Analytics when ready
    // if (Capacitor.isNativePlatform()) {
    //     FirebaseAnalytics.logEvent({ name: event, params: enrichedParams });
    // }

    // Store events locally for debugging/export
    storeEventLocally(event, enrichedParams);
};

/**
 * Track screen view
 */
export const trackScreen = (screenName: string, params: EventParams = {}): void => {
    track('screen_viewed', {
        screen_name: screenName,
        ...params,
    });
};

/**
 * Set user ID (when user logs in)
 */
export const setUserId = (newUserId: string): void => {
    userId = newUserId;
    if (typeof window !== 'undefined') {
        localStorage.setItem('analytics_user_id', newUserId);
    }

    // TODO: Update Firebase Analytics user ID
    // FirebaseAnalytics.setUserId({ userId: newUserId });
};

/**
 * Set user property
 */
export const setUserProperty = (name: string, value: string): void => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] Set user property: ${name} = ${value}`);
    }

    // TODO: Send to Firebase Analytics
    // FirebaseAnalytics.setUserProperty({ name, value });
};

// Local event storage for debugging
const MAX_STORED_EVENTS = 100;

const storeEventLocally = (event: AnalyticsEvent, params: EventParams): void => {
    if (typeof window === 'undefined') return;

    try {
        const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        stored.push({ event, params, timestamp: Date.now() });

        // Keep only last N events
        while (stored.length > MAX_STORED_EVENTS) {
            stored.shift();
        }

        localStorage.setItem('analytics_events', JSON.stringify(stored));
    } catch {
        // Ignore storage errors
    }
};

/**
 * Get stored events (for debugging)
 */
export const getStoredEvents = (): Array<{ event: string; params: EventParams; timestamp: number }> => {
    if (typeof window === 'undefined') return [];

    try {
        return JSON.parse(localStorage.getItem('analytics_events') || '[]');
    } catch {
        return [];
    }
};

/**
 * Clear stored events
 */
export const clearStoredEvents = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('analytics_events');
    }
};

// Convenience functions for common events

export const trackStoryStarted = (storyId: string, storyName: string): void => {
    track('story_started', { story_id: storyId, story_name: storyName });
};

export const trackStoryCompleted = (storyId: string, storyName: string): void => {
    track('story_completed', { story_id: storyId, story_name: storyName });
};

export const trackActUnlocked = (storyId: string, actNumber: number, coinsSpent: number): void => {
    track('act_unlocked', { story_id: storyId, act_number: actNumber, coins_amount: coinsSpent });
};

export const trackMinigameCompleted = (
    minigameType: string,
    score: number,
    timeMs: number,
    storyId?: string,
    actNumber?: number
): void => {
    track('minigame_completed', {
        minigame_type: minigameType,
        minigame_score: score,
        minigame_time_ms: timeMs,
        story_id: storyId,
        act_number: actNumber,
    });
};

export const trackMinigameFailed = (
    minigameType: string,
    score: number,
    storyId?: string,
    actNumber?: number
): void => {
    track('minigame_failed', {
        minigame_type: minigameType,
        minigame_score: score,
        story_id: storyId,
        act_number: actNumber,
    });
};

export const trackPurchaseCompleted = (
    packageId: string,
    price: number,
    coinsAmount: number
): void => {
    track('purchase_completed', {
        package_id: packageId,
        price,
        coins_amount: coinsAmount,
    });
};

export const trackAdWatched = (adType: string, rewardType: string): void => {
    track('ad_watched', { ad_type: adType, ad_reward_type: rewardType });
};

export const trackDailyRewardClaimed = (streakCount: number, coinsEarned: number): void => {
    track('daily_reward_claimed', {
        streak_count: streakCount,
        reward_coins: coinsEarned,
    });
};

export const trackAchievementUnlocked = (achievementId: string, achievementName: string): void => {
    track('achievement_unlocked', {
        achievement_id: achievementId,
        achievement_name: achievementName,
    });
};

export const trackPrestige = (prestigeCount: number, shardsEarned: number): void => {
    track('prestige_completed', {
        prestige_count: prestigeCount,
        shards_earned: shardsEarned,
    });
};
