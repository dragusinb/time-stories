'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initializeAnalytics, trackScreen } from '@/lib/analytics';

/**
 * AnalyticsProvider - Initializes analytics and tracks screen views
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Initialize analytics on mount
    useEffect(() => {
        initializeAnalytics();
    }, []);

    // Track screen views on route change
    useEffect(() => {
        if (pathname) {
            // Convert pathname to screen name
            const screenName = pathname === '/'
                ? 'home'
                : pathname.replace(/^\//, '').replace(/\//g, '_');

            trackScreen(screenName);
        }
    }, [pathname]);

    return <>{children}</>;
}

export default AnalyticsProvider;
