import { Capacitor } from '@capacitor/core';
import {
    LocalNotifications,
    ScheduleOptions,
    LocalNotificationSchema,
} from '@capacitor/local-notifications';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationSettings {
    dailyReminder: boolean;
    streakWarning: boolean;
    labMilestones: boolean;
    quietHoursStart: number; // Hour (0-23)
    quietHoursEnd: number;
}

interface NotificationsState {
    settings: NotificationSettings;
    permissionGranted: boolean;

    // Actions
    requestPermission: () => Promise<boolean>;
    updateSettings: (settings: Partial<NotificationSettings>) => void;
    scheduleDailyReminder: () => Promise<void>;
    scheduleStreakWarning: (currentStreak: number) => Promise<void>;
    cancelAllNotifications: () => Promise<void>;
    isQuietHours: () => boolean;
}

const isNative = Capacitor.isNativePlatform();

// Default settings
const DEFAULT_SETTINGS: NotificationSettings = {
    dailyReminder: true,
    streakWarning: true,
    labMilestones: true,
    quietHoursStart: 22, // 10 PM
    quietHoursEnd: 8, // 8 AM
};

// Notification IDs
const NOTIFICATION_IDS = {
    DAILY_REMINDER: 1001,
    STREAK_WARNING: 1002,
    LAB_MILESTONE: 1003,
    WELCOME_BACK: 1004,
};

export const useNotificationsStore = create<NotificationsState>()(
    persist(
        (set, get) => ({
            settings: DEFAULT_SETTINGS,
            permissionGranted: false,

            requestPermission: async () => {
                if (!isNative) return false;

                try {
                    const result = await LocalNotifications.requestPermissions();
                    const granted = result.display === 'granted';
                    set({ permissionGranted: granted });

                    if (granted) {
                        // Schedule initial notifications
                        await get().scheduleDailyReminder();
                    }

                    return granted;
                } catch (error) {
                    console.error('Failed to request notification permission:', error);
                    return false;
                }
            },

            updateSettings: (newSettings) => {
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                }));

                // Re-schedule notifications with new settings
                const state = get();
                if (state.permissionGranted) {
                    if (newSettings.dailyReminder !== undefined) {
                        if (newSettings.dailyReminder) {
                            state.scheduleDailyReminder();
                        } else {
                            LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_IDS.DAILY_REMINDER }] });
                        }
                    }
                }
            },

            scheduleDailyReminder: async () => {
                if (!isNative) return;
                const { settings, permissionGranted, isQuietHours } = get();

                if (!permissionGranted || !settings.dailyReminder) return;

                try {
                    // Cancel existing daily reminder
                    await LocalNotifications.cancel({
                        notifications: [{ id: NOTIFICATION_IDS.DAILY_REMINDER }],
                    });

                    // Schedule for tomorrow at noon (or after quiet hours)
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(12, 0, 0, 0);

                    // If noon is in quiet hours, schedule for after quiet hours
                    if (tomorrow.getHours() >= settings.quietHoursStart ||
                        tomorrow.getHours() < settings.quietHoursEnd) {
                        tomorrow.setHours(settings.quietHoursEnd, 0, 0, 0);
                    }

                    const notification: LocalNotificationSchema = {
                        id: NOTIFICATION_IDS.DAILY_REMINDER,
                        title: 'Your daily reward awaits!',
                        body: 'Claim your daily coins and keep your streak going!',
                        schedule: { at: tomorrow, repeats: true, every: 'day' },
                        sound: 'default',
                        smallIcon: 'ic_stat_icon',
                        iconColor: '#f59e0b',
                    };

                    await LocalNotifications.schedule({ notifications: [notification] });
                } catch (error) {
                    console.error('Failed to schedule daily reminder:', error);
                }
            },

            scheduleStreakWarning: async (currentStreak) => {
                if (!isNative) return;
                const { settings, permissionGranted } = get();

                if (!permissionGranted || !settings.streakWarning || currentStreak < 3) return;

                try {
                    // Cancel existing streak warning
                    await LocalNotifications.cancel({
                        notifications: [{ id: NOTIFICATION_IDS.STREAK_WARNING }],
                    });

                    // Schedule for 8 PM today if user hasn't claimed today
                    const today = new Date();
                    today.setHours(20, 0, 0, 0);

                    // Only schedule if it's still in the future
                    if (today.getTime() > Date.now()) {
                        const notification: LocalNotificationSchema = {
                            id: NOTIFICATION_IDS.STREAK_WARNING,
                            title: `Don't lose your ${currentStreak}-day streak!`,
                            body: 'Claim your daily reward before midnight to keep your streak alive.',
                            schedule: { at: today },
                            sound: 'default',
                            smallIcon: 'ic_stat_icon',
                            iconColor: '#ef4444',
                        };

                        await LocalNotifications.schedule({ notifications: [notification] });
                    }
                } catch (error) {
                    console.error('Failed to schedule streak warning:', error);
                }
            },

            cancelAllNotifications: async () => {
                if (!isNative) return;

                try {
                    const pending = await LocalNotifications.getPending();
                    if (pending.notifications.length > 0) {
                        await LocalNotifications.cancel({ notifications: pending.notifications });
                    }
                } catch (error) {
                    console.error('Failed to cancel notifications:', error);
                }
            },

            isQuietHours: () => {
                const { settings } = get();
                const hour = new Date().getHours();

                if (settings.quietHoursStart > settings.quietHoursEnd) {
                    // Quiet hours span midnight (e.g., 22:00 to 08:00)
                    return hour >= settings.quietHoursStart || hour < settings.quietHoursEnd;
                } else {
                    return hour >= settings.quietHoursStart && hour < settings.quietHoursEnd;
                }
            },
        }),
        {
            name: 'timestories-notifications',
        }
    )
);

// Send a local notification immediately (for testing or immediate feedback)
export const sendLocalNotification = async (
    title: string,
    body: string,
    id: number = Math.floor(Math.random() * 10000)
) => {
    if (!isNative) return;

    try {
        await LocalNotifications.schedule({
            notifications: [
                {
                    id,
                    title,
                    body,
                    schedule: { at: new Date(Date.now() + 1000) }, // 1 second from now
                    sound: 'default',
                },
            ],
        });
    } catch (error) {
        console.error('Failed to send notification:', error);
    }
};

// Initialize notifications on app start
export const initializeNotifications = async () => {
    if (!isNative) return;

    const store = useNotificationsStore.getState();

    // Check current permission status
    try {
        const status = await LocalNotifications.checkPermissions();
        if (status.display === 'granted') {
            useNotificationsStore.setState({ permissionGranted: true });

            // Re-schedule daily reminder
            await store.scheduleDailyReminder();
        }
    } catch (error) {
        console.error('Failed to check notification permissions:', error);
    }

    // Listen for notification actions
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        console.log('Notification action performed:', notification);
        // Handle notification tap - could navigate to specific screen
    });
};
