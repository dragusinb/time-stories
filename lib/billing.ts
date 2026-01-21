import { create } from 'zustand';
import { Purchases, PurchasesPackage, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

interface BillingState {
    isInitialized: boolean;
    availablePackages: PurchasesPackage[];
    isPro: boolean;
    error: string | null;
    initialize: () => Promise<void>;
    purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
    restorePurchases: () => Promise<void>;
}

// RevenueCat API Key
const REVENUECAT_API_KEY = 'test_CeKmffdpccGlXCpmaoPJzLaGfPg';
const PRO_ENTITLEMENT_ID = 'pro'; // Change this to match your RevenueCat Entitlement ID

export const useBillingStore = create<BillingState>((set, get) => ({
    isInitialized: false,
    availablePackages: [],
    isPro: false,
    error: null,

    initialize: async () => {
        if (get().isInitialized) return;

        // Only run on native platforms
        if (!Capacitor.isNativePlatform()) {
            console.log("Not native platform, skipping RevenueCat init");
            return;
        }

        try {
            if (process.env.NODE_ENV === 'development') {
                await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
            }

            // Configure RevenueCat
            await Purchases.configure({ apiKey: REVENUECAT_API_KEY });

            // Get Offerings
            try {
                const offerings = await Purchases.getOfferings();
                if (offerings.current && offerings.current.availablePackages.length > 0) {
                    set({ availablePackages: offerings.current.availablePackages });
                }
            } catch (e) {
                console.warn("Failed to fetch offerings", e);
            }

            // Check initial entitlement status
            const { customerInfo } = await Purchases.getCustomerInfo();
            const isPro = typeof customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== "undefined";

            // Listen for updates (outside of try/catch to ensure it persists? No, need to be careful with double listeners)
            // Purchases.addCustomerInfoUpdateListener is permanent, be careful. 
            // In a store like this, it's fine as it's a singleton.
            Purchases.addCustomerInfoUpdateListener((info) => {
                const isStillPro = typeof info.entitlements.active[PRO_ENTITLEMENT_ID] !== "undefined";
                set({ isPro: isStillPro });
            });

            set({ isInitialized: true, isPro });

        } catch (error: any) {
            console.error("Billing init error:", error);
            set({ error: error.message });
        }
    },

    purchasePackage: async (pkg: PurchasesPackage) => {
        try {
            const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
            const isPro = typeof customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== "undefined";
            set({ isPro });
            return true;
        } catch (error: any) {
            if (!error.userCancelled) {
                set({ error: error.message });
            }
        }
        return false;
    },

    restorePurchases: async () => {
        try {
            const { customerInfo } = await Purchases.restorePurchases();
            const isPro = typeof customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== "undefined";
            set({ isPro });
        } catch (error: any) {
            set({ error: error.message });
        }
    }
}));

