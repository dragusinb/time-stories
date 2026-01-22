'use client';

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/lib/store';
import { useBillingStore } from '@/lib/billing';
import { Coins, Sparkles, RefreshCw, AlertCircle, PlayCircle, Users, TrendingUp, BookOpen } from 'lucide-react';
import { WatchAdButton } from '@/components/WatchAdButton';
import { useAdsStore } from '@/lib/ads';
import { track, trackPurchaseCompleted, trackAdWatched } from '@/lib/analytics';
import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';

// Fallback packs for web/testing (mapped to RevenueCat product IDs)
const fallbackPacks = [
    {
        id: 'starter',
        productId: 'com.timestories.coins.100',
        name: 'Starter Pack',
        coins: 100,
        bonus: 0,
        price: 4.99,
        color: 'from-slate-700 to-slate-600',
    },
    {
        id: 'apprentice',
        productId: 'com.timestories.coins.500',
        name: 'Apprentice Pack',
        coins: 500,
        bonus: 50,
        price: 29.99,
        color: 'from-amber-700 to-amber-600',
        popular: true,
    },
    {
        id: 'master',
        productId: 'com.timestories.coins.1000',
        name: 'Master Pack',
        coins: 1000,
        bonus: 150,
        price: 49.99,
        color: 'from-purple-700 to-purple-600',
    },
    {
        id: 'grand',
        productId: 'com.timestories.coins.2000',
        name: 'Grand Alchemist',
        coins: 2000,
        bonus: 1000,
        price: 99.99,
        color: 'from-emerald-700 to-emerald-600',
        bestValue: true,
    },
];

export default function StorePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Store...</div>}>
            <StoreContent />
        </Suspense>
    );
}

function StoreContent() {
    const addCoins = useStore((state) => state.addCoins);
    const {
        isInitialized,
        availablePackages,
        purchasePackage,
        restorePurchases,
        error: billingError
    } = useBillingStore();

    const [purchasing, setPurchasing] = useState<string | null>(null);
    const [restoring, setRestoring] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const returnUrl = searchParams.get('returnUrl');

    const isNative = Capacitor.isNativePlatform();

    // Clear messages after delay
    useEffect(() => {
        if (error || successMessage) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccessMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, successMessage]);

    // Handle purchase - uses RevenueCat on native, simulates on web
    const handlePurchase = async (packId: string, coins: number, rcPackage?: any) => {
        setPurchasing(packId);
        setError(null);

        // Track purchase started
        track('purchase_started', { package_id: packId, coins_amount: coins });

        try {
            if (isNative && rcPackage) {
                // Real purchase via RevenueCat
                const success = await purchasePackage(rcPackage);

                if (success) {
                    // Add coins after successful purchase
                    addCoins(coins);
                    setSuccessMessage(`Successfully purchased ${coins} coins!`);
                    trackPurchaseCompleted(packId, rcPackage?.product?.price || 0, coins);

                    if (returnUrl) {
                        setTimeout(() => router.push(returnUrl), 1500);
                    }
                } else {
                    // Purchase was cancelled or failed
                    if (billingError) {
                        setError(billingError);
                    }
                }
            } else {
                // Web fallback - simulate purchase for testing
                await new Promise(resolve => setTimeout(resolve, 1000));
                addCoins(coins);
                setSuccessMessage(`[Test Mode] Added ${coins} coins!`);
                trackPurchaseCompleted(packId, 0, coins);

                if (returnUrl) {
                    setTimeout(() => router.push(returnUrl), 1500);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Purchase failed. Please try again.');
        } finally {
            setPurchasing(null);
        }
    };

    // Handle restore purchases (required by Apple)
    const handleRestore = async () => {
        if (!isNative) {
            setError('Restore is only available on mobile devices.');
            return;
        }

        setRestoring(true);
        setError(null);

        try {
            await restorePurchases();
            setSuccessMessage('Purchases restored successfully!');
        } catch (err: any) {
            setError(err.message || 'Failed to restore purchases.');
        } finally {
            setRestoring(false);
        }
    };

    // Map RevenueCat packages to our display format, or use fallbacks
    const displayPacks = fallbackPacks.map(fallback => {
        // Try to find matching RevenueCat package by identifier
        const rcPackage = availablePackages.find(
            pkg => pkg.identifier === fallback.id ||
                   pkg.product?.identifier === fallback.productId
        );

        return {
            ...fallback,
            // Use RevenueCat price if available
            price: rcPackage?.product?.priceString
                ? parseFloat(rcPackage.product.priceString.replace(/[^0-9.]/g, ''))
                : fallback.price,
            priceString: rcPackage?.product?.priceString || `$${fallback.price.toFixed(2)}`,
            rcPackage
        };
    });

    return (
        <main className="min-h-screen bg-slate-950 pb-20">
            <Navbar />

            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-100 mb-4">
                        Coin <span className="text-amber-500">Store</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Purchase coins to unlock new acts and continue your journey through time.
                    </p>

                    {/* Social Proof */}
                    <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Users className="w-4 h-4 text-amber-500" />
                            <span>Join <strong className="text-white">10,000+</strong> time travelers</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <BookOpen className="w-4 h-4 text-purple-500" />
                            <span><strong className="text-white">3</strong> epic stories to explore</span>
                        </div>
                    </div>

                    {/* Environment indicator */}
                    {!isNative && (
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Test Mode - Purchases are simulated
                        </div>
                    )}
                </div>

                {/* What Coins Unlock */}
                <div className="max-w-2xl mx-auto mb-12 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                    <div className="text-center mb-3">
                        <span className="text-sm text-slate-400">What can you unlock?</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-amber-400">15</div>
                            <div className="text-xs text-slate-500">coins per act</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-400">40+</div>
                            <div className="text-xs text-slate-500">acts per story</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-emerald-400">120+</div>
                            <div className="text-xs text-slate-500">total acts</div>
                        </div>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="max-w-md mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-center">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="max-w-md mx-auto mb-8 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-center">
                        {successMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayPacks.map((pack) => {
                        const totalCoins = pack.coins + pack.bonus;
                        const coinsPerDollar = (totalCoins / pack.price).toFixed(0);
                        const actsUnlockable = Math.floor(totalCoins / 15);

                        return (
                            <Card
                                key={pack.id}
                                className={`relative overflow-hidden border-slate-800 hover:border-amber-500/50 transition-all ${pack.popular ? 'scale-105 border-amber-500 shadow-amber-500/20 z-10' : ''} ${(pack as any).bestValue ? 'border-emerald-500' : ''}`}
                            >
                                {pack.popular && (
                                    <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                                        MOST POPULAR
                                    </div>
                                )}
                                {(pack as any).bestValue && !pack.popular && (
                                    <div className="absolute top-0 right-0 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                                        BEST VALUE
                                    </div>
                                )}

                                <div className={`h-32 -mx-6 -mt-6 mb-6 bg-gradient-to-br ${pack.color} flex items-center justify-center relative`}>
                                    <Coins className="w-16 h-16 text-white/20 absolute" />
                                    <div className="text-center z-10">
                                        <div className="text-3xl font-bold text-white">{totalCoins}</div>
                                        <div className="text-white/80 text-sm">Coins</div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>

                                {pack.bonus > 0 && (
                                    <div className="flex items-center gap-1 text-emerald-400 text-sm mb-2 font-bold">
                                        <Sparkles className="w-4 h-4" />
                                        +{pack.bonus} Bonus Coins
                                    </div>
                                )}

                                {/* Value indicator */}
                                <div className="text-xs text-slate-500 mb-4">
                                    <span className="text-slate-400">{coinsPerDollar}</span> coins/$  ·  Unlocks <span className="text-slate-400">{actsUnlockable}</span> acts
                                </div>

                                <div className="mt-auto">
                                    <div className="text-2xl font-bold text-white mb-4">
                                        {pack.priceString}
                                    </div>
                                    <Button
                                        className="w-full"
                                        variant={pack.popular ? 'primary' : 'secondary'}
                                        onClick={() => handlePurchase(pack.id, totalCoins, pack.rcPackage)}
                                        disabled={purchasing !== null}
                                    >
                                        {purchasing === pack.id ? 'Processing...' : 'Buy Now'}
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Free Coins - Watch Ad Section */}
                <div className="mt-12 max-w-md mx-auto">
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-bold text-white mb-2">Free Coins</h2>
                        <p className="text-slate-400 text-sm">Watch a short video to earn bonus coins!</p>
                    </div>

                    <WatchAdButton
                        rewardType="bonus_coins"
                        variant="banner"
                        onRewardEarned={(amount) => {
                            setSuccessMessage(`You earned ${amount} bonus coins!`);
                            trackAdWatched('rewarded', 'bonus_coins');
                        }}
                    />
                </div>

                {/* Restore Purchases Button (Required by Apple) */}
                <div className="mt-12 text-center">
                    <button
                        onClick={handleRestore}
                        disabled={restoring || !isNative}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-4 h-4 ${restoring ? 'animate-spin' : ''}`} />
                        {restoring ? 'Restoring...' : 'Restore Purchases'}
                    </button>
                    {!isNative && (
                        <p className="text-slate-600 text-xs mt-2">
                            (Available on mobile app only)
                        </p>
                    )}
                </div>

                {/* Terms */}
                <div className="mt-8 text-center text-slate-600 text-xs max-w-lg mx-auto">
                    <p>
                        Purchases are processed securely through the App Store or Google Play.
                        Coins are consumable and cannot be refunded after use.
                    </p>
                </div>
            </div>
        </main>
    );
}
