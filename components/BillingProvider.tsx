'use client';

import { useEffect } from 'react';
import { useBillingStore } from '@/lib/billing';
import { Capacitor } from '@capacitor/core';

export function BillingProvider({ children }: { children: React.ReactNode }) {
    const initialize = useBillingStore(state => state.initialize);

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            initialize();
        }
    }, [initialize]);

    return <>{children}</>;
}
