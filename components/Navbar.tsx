'use client';

import Link from 'next/link';
import { Coins, Menu } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from './ui/Button';
import { useState } from 'react';
import { DailyRewardsBadge } from './DailyRewards';
import { AchievementsBadge } from './Achievements';
import DailyRewardsModal from './DailyRewards';
import AchievementsModal from './Achievements';

export function Navbar() {
    const coins = useStore((state) => state.coins);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDailyRewards, setShowDailyRewards] = useState(false);
    const [showAchievements, setShowAchievements] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                            TimeStories
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/" className="text-slate-300 hover:text-amber-400 transition-colors">
                            Stories
                        </Link>
                        <Link href="/store" className="text-slate-300 hover:text-amber-400 transition-colors">
                            Store
                        </Link>

                        <div className="flex items-center gap-2">
                            <DailyRewardsBadge onClick={() => setShowDailyRewards(true)} />
                            <AchievementsBadge onClick={() => setShowAchievements(true)} />
                        </div>

                        <div className="flex items-center gap-2 bg-slate-900 px-4 py-1.5 rounded-full border border-slate-800">
                            <Coins className="w-4 h-4 text-amber-500" />
                            <span className="font-bold text-amber-500">{coins}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <DailyRewardsBadge onClick={() => setShowDailyRewards(true)} />
                        <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                            <Coins className="w-4 h-4 text-amber-500" />
                            <span className="font-bold text-amber-500 text-sm">{coins}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 flex flex-col gap-4">
                        <Link href="/" className="text-slate-300 hover:text-amber-400">Stories</Link>
                        <Link href="/store" className="text-slate-300 hover:text-amber-400">Store</Link>
                        <button
                            onClick={() => { setShowAchievements(true); setIsMenuOpen(false); }}
                            className="text-slate-300 hover:text-amber-400 text-left"
                        >
                            Achievements
                        </button>
                    </div>
                )}
            </nav>

            {/* Modals */}
            <DailyRewardsModal
                isOpen={showDailyRewards}
                onClose={() => setShowDailyRewards(false)}
            />
            <AchievementsModal
                isOpen={showAchievements}
                onClose={() => setShowAchievements(false)}
            />
        </>
    );
}
