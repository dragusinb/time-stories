'use client';

import { useEffect } from 'react';
import { useAdsStore } from '@/lib/ads';

/**
 * AdsProvider - Initializes AdMob on app load
 *
 * This component handles the initialization of the AdMob SDK
 * and preloads the first rewarded ad.
 */
export function AdsProvider({ children }: { children: React.ReactNode }) {
    const initialize = useAdsStore((s) => s.initialize);

    useEffect(() => {
        // Initialize AdMob SDK
        initialize();
    }, [initialize]);

    return <>{children}</>;
}

export default AdsProvider;
