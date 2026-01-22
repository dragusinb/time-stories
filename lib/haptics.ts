import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Haptic feedback utilities for mobile devices
 * Falls back gracefully on web/unsupported platforms
 */

const isNative = Capacitor.isNativePlatform();

/**
 * Light haptic tap - for button presses, selections
 */
export const hapticTap = async () => {
    if (!isNative) return;
    try {
        await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
        console.warn('Haptics not available', e);
    }
};

/**
 * Medium haptic impact - for confirmations, toggles
 */
export const hapticMedium = async () => {
    if (!isNative) return;
    try {
        await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {
        console.warn('Haptics not available', e);
    }
};

/**
 * Heavy haptic impact - for major actions, unlocks
 */
export const hapticHeavy = async () => {
    if (!isNative) return;
    try {
        await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (e) {
        console.warn('Haptics not available', e);
    }
};

/**
 * Success notification haptic - for achievements, completions
 */
export const hapticSuccess = async () => {
    if (!isNative) return;
    try {
        await Haptics.notification({ type: NotificationType.Success });
    } catch (e) {
        console.warn('Haptics not available', e);
    }
};

/**
 * Warning notification haptic - for alerts, cautions
 */
export const hapticWarning = async () => {
    if (!isNative) return;
    try {
        await Haptics.notification({ type: NotificationType.Warning });
    } catch (e) {
        console.warn('Haptics not available', e);
    }
};

/**
 * Error notification haptic - for failures, errors
 */
export const hapticError = async () => {
    if (!isNative) return;
    try {
        await Haptics.notification({ type: NotificationType.Error });
    } catch (e) {
        console.warn('Haptics not available', e);
    }
};

/**
 * Selection changed haptic - for scrolling through options
 */
export const hapticSelection = async () => {
    if (!isNative) return;
    try {
        await Haptics.selectionChanged();
    } catch (e) {
        console.warn('Haptics not available', e);
    }
};

/**
 * Custom vibration pattern
 */
export const hapticVibrate = async (duration: number = 300) => {
    if (!isNative) return;
    try {
        await Haptics.vibrate({ duration });
    } catch (e) {
        console.warn('Haptics not available', e);
    }
};

// Preset haptic patterns for common game events
export const gameHaptics = {
    /** Button press */
    buttonPress: hapticTap,

    /** Minigame start */
    minigameStart: hapticMedium,

    /** Minigame success */
    minigameSuccess: hapticSuccess,

    /** Minigame failure */
    minigameFailure: hapticError,

    /** Coin earned */
    coinEarned: hapticTap,

    /** Bulk coins earned */
    coinsEarned: hapticMedium,

    /** Trophy unlocked */
    trophyUnlock: hapticHeavy,

    /** Artifact unlocked */
    artifactUnlock: hapticHeavy,

    /** Level up / prestige */
    levelUp: async () => {
        await hapticHeavy();
        setTimeout(() => hapticSuccess(), 150);
    },

    /** Act completed */
    actComplete: hapticSuccess,

    /** Story completed */
    storyComplete: async () => {
        await hapticHeavy();
        setTimeout(() => hapticSuccess(), 100);
        setTimeout(() => hapticSuccess(), 200);
    },

    /** Purchase complete */
    purchaseComplete: hapticSuccess,

    /** Navigation tap */
    navTap: hapticTap,

    /** Toggle switch */
    toggle: hapticMedium,

    /** Slider selection */
    sliderTick: hapticSelection,
};

export default gameHaptics;
