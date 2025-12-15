'use client';

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/lib/store';
import { Coins, Sparkles } from 'lucide-react';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const packs = [
    {
        id: 'starter',
        name: 'Starter Pack',
        coins: 100,
        bonus: 0,
        price: 4.99,
        color: 'from-slate-700 to-slate-600',
    },
    {
        id: 'apprentice',
        name: 'Apprentice Pack',
        coins: 500,
        bonus: 50,
        price: 29.99,
        color: 'from-amber-700 to-amber-600',
        popular: true,
    },
    {
        id: 'master',
        name: 'Master Pack',
        coins: 1000,
        bonus: 150,
        price: 49.99,
        color: 'from-purple-700 to-purple-600',
    },
    {
        id: 'grand',
        name: 'Grand Alchemist',
        coins: 2000,
        bonus: 1000,
        price: 99.99,
        color: 'from-emerald-700 to-emerald-600',
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
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const returnUrl = searchParams.get('returnUrl');

    const handlePurchase = (packId: string, amount: number) => {
        setPurchasing(packId);
        // Simulate API call
        setTimeout(() => {
            addCoins(amount);
            setPurchasing(null);

            if (returnUrl) {
                router.push(returnUrl);
            } else {
                alert('Purchase successful!');
            }
        }, 1000);
    };

    return (
        <main className="min-h-screen bg-slate-950 pb-20">
            <Navbar />

            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-100 mb-4">
                        Coin <span className="text-amber-500">Store</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Purchase coins to unlock new acts and continue your journey through time.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packs.map((pack) => (
                        <Card
                            key={pack.id}
                            className={`relative overflow-hidden border-slate-800 hover:border-amber-500/50 transition-all ${pack.popular ? 'scale-105 border-amber-500 shadow-amber-500/20 z-10' : ''}`}
                        >
                            {pack.popular && (
                                <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className={`h-32 -mx-6 -mt-6 mb-6 bg-gradient-to-br ${pack.color} flex items-center justify-center relative`}>
                                <Coins className="w-16 h-16 text-white/20 absolute" />
                                <div className="text-center z-10">
                                    <div className="text-3xl font-bold text-white">{pack.coins}</div>
                                    <div className="text-white/80 text-sm">Coins</div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>

                            {pack.bonus > 0 && (
                                <div className="flex items-center gap-1 text-emerald-400 text-sm mb-4 font-bold">
                                    <Sparkles className="w-4 h-4" />
                                    +{pack.bonus} Bonus Coins
                                </div>
                            )}

                            <div className="mt-auto">
                                <div className="text-2xl font-bold text-white mb-4">
                                    ${pack.price}
                                </div>
                                <Button
                                    className="w-full"
                                    variant={pack.popular ? 'primary' : 'secondary'}
                                    onClick={() => handlePurchase(pack.id, pack.coins + pack.bonus)}
                                    disabled={purchasing !== null}
                                >
                                    {purchasing === pack.id ? 'Processing...' : 'Buy Now'}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
