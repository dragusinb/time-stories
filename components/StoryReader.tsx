'use client';

import { useState, useEffect } from 'react';
import { Story, Act, Minigame } from '@/types';
import { useStore } from '@/lib/store';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Lock, ChevronRight, ChevronLeft, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MemoryGame } from './minigames/MemoryGame';
import { CipherGame } from './minigames/CipherGame';
import { SequenceGame } from './minigames/SequenceGame';
import { MicroscopeGame } from './minigames/MicroscopeGame';
import { MixingGame } from './minigames/MixingGame';
import { TimelineGame } from './minigames/TimelineGame';
import { DefenseGame } from './minigames/DefenseGame';
import { ScaleGame } from './minigames/ScaleGame';
import { MirrorGame } from './minigames/MirrorGame';
import { CatapultGame } from './minigames/CatapultGame';
import { CircleGame } from './minigames/CircleGame';
import DisplacementGame from './minigames/DisplacementGame';
import GearsGame from './minigames/GearsGame';
import TangramGame from './minigames/TangramGame';
import SiloGame from './minigames/SiloGame';
import SanitationGame from './minigames/SanitationGame';
import LensCraftingGame from './minigames/LensCraftingGame';
import SymbolMatchingGame from './minigames/SymbolMatchingGame';
import DebateGame from './minigames/DebateGame';
import RitualGame from './minigames/RitualGame';
import ConstellationGame from './minigames/ConstellationGame';
import ChemistryGame from './minigames/ChemistryGame';
import DiagnosisGame from './minigames/DiagnosisGame';
import TriageGame from './minigames/TriageGame';
import { RatCatcherGame } from './minigames/RatCatcherGame';
import { QuizGame } from './minigames/QuizGame';
import { ParticleOverlay } from './ui/ParticleOverlay';

interface StoryReaderProps {
    story: Story;
}

export function StoryReader({ story }: StoryReaderProps) {
    const [currentActIndex, setCurrentActIndex] = useState(0);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const { coins, unlockedActs, unlockAct, spendCoins, completedMinigames, completeMinigame } = useStore();

    const currentAct = story.acts[currentActIndex];
    const isUnlocked = !currentAct.isLocked || unlockedActs.includes(currentAct.id);
    const hasMinigame = currentAct.minigame && !completedMinigames.includes(currentAct.minigame.id);

    // Sync with URL hash on mount and hash changes
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const actIndex = story.acts.findIndex(a => a.id === hash);
                if (actIndex !== -1) {
                    setCurrentActIndex(actIndex);
                }
            }
        };

        // Check immediately
        handleHashChange();

        // Check again and mark initialized
        const timer = setTimeout(() => {
            handleHashChange();
            setIsInitialized(true);
        }, 100);

        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            clearTimeout(timer);
        };
    }, [story.acts]);

    // Update URL hash when act changes
    useEffect(() => {
        if (!isInitialized) return;

        // Only update hash if it's different to avoid loops/jumping
        const currentHash = window.location.hash.replace('#', '');
        if (currentHash !== currentAct.id) {
            window.location.hash = currentAct.id;
        }
    }, [currentAct.id, isInitialized]);

    const handleUnlock = () => {
        if (spendCoins(currentAct.price)) {
            unlockAct(currentAct.id);
        } else {
            alert('Not enough coins! Visit the store.');
        }
    };

    const handleMinigameComplete = (result: boolean | number) => {
        const success = typeof result === 'number' ? result >= 50 : result;
        if (success && currentAct.minigame) {
            completeMinigame(currentAct.minigame.id);
        }
    };

    const nextAct = () => {
        if (currentActIndex < story.acts.length - 1) {
            const nextIndex = currentActIndex + 1;
            const nextActData = story.acts[nextIndex];
            const isNextLocked = nextActData.isLocked && !unlockedActs.includes(nextActData.id);

            if (isNextLocked) {
                if (coins >= nextActData.price) {
                    // Auto-unlock if we have the coins
                    spendCoins(nextActData.price);
                    unlockAct(nextActData.id);
                    setCurrentActIndex(nextIndex);
                    window.scrollTo(0, 0);
                    return;
                }
            }

            // Otherwise just go there (if locked and no coins, it will show the lock screen)
            setCurrentActIndex(nextIndex);
            window.scrollTo(0, 0);
        }
    };

    const prevAct = () => {
        if (currentActIndex > 0) {
            setCurrentActIndex(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const getMinigameTheme = (): 'apollo' | 'ancient' | 'medieval' => {
        if (story.id === 'story-1') return 'apollo';
        if (story.id === 'story-3') return 'ancient';
        return 'medieval';
    };

    if (hasMinigame) {
        return (
            <MinigameView
                minigame={currentAct.minigame!}
                onComplete={handleMinigameComplete}
                theme={getMinigameTheme()}
            />
        );
    }

    const getThemeStyles = () => {
        switch (story.id) {
            case 'story-1': // Apollo
                return "bg-black font-mono text-green-500 border-green-900";
            case 'story-3': // Archimedes
                return "bg-[#1a110d] font-serif text-[#e6ccb2] border-[#5e4026]";
            default: // Alchemist (Default)
                return "bg-slate-950 font-sans text-slate-300 border-slate-800";
        }
    };

    const containerClasses = getThemeStyles();
    const isApollo = story.id === 'story-1';
    const isArchimedes = story.id === 'story-3';

    return (
        <div className={`min-h-[100dvh] flex flex-col ${isApollo ? 'bg-black' : isArchimedes ? 'bg-[#0c0806]' : 'bg-slate-950'}`}>
            {/* Background Effects */}
            {isApollo && (
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,3px_100%]"></div>
                    <div className="absolute inset-0 animate-[scan_8s_linear_infinite] bg-gradient-to-b from-transparent via-green-500/5 to-transparent h-[20%]"></div>
                </div>
            )}

            <div className={`max-w-3xl mx-auto pb-24 pt-8 relative z-10 p-4 transition-colors duration-500`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentAct.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        {isUnlocked ? (
                            <div className={`
                                max-w-none p-6 md:p-10 border-4 shadow-2xl relative overflow-hidden
                                ${isApollo ? 'bg-black border-green-800 text-green-400 font-mono' :
                                    isArchimedes ? 'bg-[#1a110d] border-[#8b5a2b] text-[#e6ccb2] font-serif shadow-[0_0_50px_rgba(0,0,0,0.8)]' :
                                        'bg-slate-900 border-slate-700 prose prose-invert'}
                            `}>
                                {isArchimedes && (
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none"></div>
                                )}

                                {currentAct.backgroundImage && (
                                    <div className={`
                                        mb-8 border-4 shadow-lg relative group overflow-hidden
                                        ${isApollo ? 'border-green-900 grayscale opacity-80 mix-blend-screen' :
                                            isArchimedes ? 'border-[#5e4026] sepia-[.3] brightness-75' :
                                                'border-slate-950 rounded-none'}
                                    `}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={currentAct.backgroundImage}
                                            alt={currentAct.title}
                                            className="w-full h-auto max-h-[500px] object-cover bg-black"
                                        />
                                        {isApollo && <div className="absolute inset-0 bg-green-900/20 mix-blend-overlay"></div>}
                                        <ParticleOverlay />
                                    </div>
                                )}

                                <h2 className={`
                                    text-3xl mb-6 uppercase tracking-widest font-bold
                                    ${isApollo ? 'text-green-500 text-shadow-glow' :
                                        isArchimedes ? 'text-[#ffae00] drop-shadow-md border-b-2 border-[#5e4026] pb-4' :
                                            'text-amber-500 font-serif'}
                                `}>
                                    {currentAct.title}
                                </h2>

                                <div className={`
                                    leading-loose text-lg whitespace-pre-wrap
                                    ${isApollo ? 'text-green-300/90 font-mono' :
                                        isArchimedes ? 'text-[#d6c0a0] font-serif italic' :
                                            'text-slate-300 font-sans'}
                                `}>
                                    {currentAct.content}
                                </div>
                            </div>
                        ) : (
                            <Card className={`
                                p-12 text-center border-4
                                ${isApollo ? 'bg-black border-green-900 text-green-600 font-mono' :
                                    isArchimedes ? 'bg-[#1a110d] border-[#5e4026] text-[#8b5a2b] font-serif' :
                                        'bg-amber-500/5 border-amber-500/30'}
                            `}>
                                <Lock className={`w-16 h-16 mx-auto mb-6 ${isApollo ? 'text-green-700 animate-pulse' : 'text-amber-700'}`} />
                                <h3 className={`text-2xl font-bold mb-4 uppercase tracking-widest ${isApollo ? 'text-green-500' : 'text-amber-500'}`}>
                                    {isApollo ? 'ACCESS DENIED' : 'Act Locked'}
                                </h3>
                                <div className="flex flex-col items-center gap-4 mt-8">
                                    <div className="text-xl font-bold">Cost: {currentAct.price} Credits</div>
                                    {coins >= currentAct.price ? (
                                        <Button
                                            onClick={handleUnlock}
                                            size="lg"
                                            className={`w-full max-w-xs uppercase tracking-widest ${isApollo ? 'bg-green-900 text-green-100 hover:bg-green-800 border-green-700' : ''}`}
                                        >
                                            {isApollo ? 'AUTHORIZE' : 'Unlock Now'}
                                        </Button>
                                    ) : (
                                        <Link href={`/store?returnUrl=${encodeURIComponent(window.location.pathname + window.location.hash)}`} className="w-full max-w-xs">
                                            <Button size="lg" className="w-full">
                                                Visit Store
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </Card>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Footer Controls (Mission Ctrl, Reset, Sequence) */}
                <div className="mt-8 flex flex-col gap-6 opacity-80 hover:opacity-100 transition-opacity">
                    <div className={`flex items-center justify-between text-sm uppercase tracking-widest border-b-2 pb-2
                        ${isApollo ? 'text-green-700 border-green-900 font-mono' :
                            isArchimedes ? 'text-[#8b5a2b] border-[#5e4026] font-serif' :
                                'text-slate-500 border-slate-800 font-pixel'}
                    `}>
                        <span>SEQ {currentAct.actNumber} / {story.totalActs}</span>
                        <span>{story.title}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <Link href="/" className={`
                            px-4 py-2 text-sm border-2 transition-all uppercase tracking-widest
                            ${isApollo ? 'border-green-800 text-green-600 hover:text-green-400 hover:border-green-500 bg-green-950/20' :
                                isArchimedes ? 'border-[#5e4026] text-[#8b5a2b] hover:text-[#d6c0a0] hover:border-[#8b5a2b] bg-[#2a1b15]' :
                                    'pixel-btn'}
                        `}>
                            ← Mission Ctrl
                        </Link>
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            className={`
                                px-4 py-2 text-sm border-2 transition-all uppercase tracking-widest
                                ${isApollo ? 'border-red-900 text-red-700 hover:text-red-500 hover:border-red-600 bg-red-950/20' :
                                    isArchimedes ? 'border-[#5e4026] text-red-900/70 hover:text-red-800 hover:border-red-800 bg-[#2a1b15]' :
                                        'pixel-btn bg-red-900/50 hover:bg-red-800/50 text-red-200 border-red-800'}
                            `}
                        >
                            Reset Timeline
                        </button>
                    </div>
                </div>

                {/* Custom Reset Confirmation Modal */}
                <AnimatePresence>
                    {showResetConfirm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className={`p-8 max-w-md w-full text-center border-4 shadow-2xl ${isApollo ? 'bg-black border-red-600 text-red-500 font-mono' : 'bg-slate-900 border-red-800 text-slate-300'}`}
                            >
                                <h3 className="text-2xl mb-4 uppercase tracking-widest font-bold">
                                    {isApollo ? 'CRITICAL WARNING' : 'Timeline Reset'}
                                </h3>
                                <p className="mb-8 text-sm leading-relaxed opacity-80">
                                    {isApollo ? 'SYSTEM PURGE INITIATED. UNRECOVERABLE DATA LOSS IMMINENT.' : 'Are you sure? This will erase all progress.'}
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => setShowResetConfirm(false)}
                                        className={`px-6 py-3 w-full border-2 uppercase tracking-wider ${isApollo ? 'border-green-800 text-green-700 hover:border-green-500 hover:text-green-500' : 'pixel-btn'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            localStorage.clear();
                                            window.location.hash = '';
                                            window.location.reload();
                                        }}
                                        className={`px-6 py-3 w-full border-2 uppercase tracking-wider font-bold ${isApollo ? 'bg-red-900/20 border-red-600 text-red-500 hover:bg-red-900/40' : 'pixel-btn bg-red-900 text-red-100'}`}
                                    >
                                        Execute
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Navigation Bar (Fixed Bottom) */}
                <div className={`
                    fixed bottom-0 left-0 w-full border-t p-4 z-40 backdrop-blur-md
                    pb-[calc(1rem+env(safe-area-inset-bottom))]
                    ${isApollo ? 'bg-black/90 border-green-900' :
                        isArchimedes ? 'bg-[#1a110d]/95 border-[#5e4026]' :
                            'bg-slate-950/90 border-slate-800'}
                `}>
                    <div className="container mx-auto max-w-3xl flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={prevAct}
                            disabled={currentActIndex === 0}
                            className={`gap-2 uppercase tracking-widest ${isApollo ? 'text-green-600 hover:text-green-400 hover:bg-green-900/20' : isArchimedes ? 'text-[#8b5a2b] hover:text-[#e6ccb2]' : ''}`}
                        >
                            <ChevronLeft className="w-4 h-4" /> Prev
                        </Button>

                        <div className="hidden md:block h-1 flex-1 mx-8 bg-current opacity-20 rounded overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${isApollo ? 'bg-green-500' : 'bg-amber-500'}`}
                                style={{ width: `${((currentActIndex + 1) / story.totalActs * 100)}%` }}
                            ></div>
                        </div>

                        <Button
                            variant={isUnlocked ? "primary" : "secondary"}
                            onClick={nextAct}
                            disabled={currentActIndex === story.acts.length - 1}
                            className={`gap-2 uppercase tracking-widest 
                                ${isApollo
                                    ? 'bg-green-900 border-green-700 text-green-100 hover:bg-green-800'
                                    : isArchimedes
                                        ? 'bg-[#5e4026] text-[#e6ccb2] border-[#8b5a2b] hover:bg-[#704d2e]'
                                        : ''}
                            `}
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .text-shadow-glow {
                    text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
                }
            `}</style>
        </div>
    );
}

function MinigameView({ minigame, onComplete, theme = 'medieval' }: { minigame: Minigame; onComplete: (result: boolean | number) => void; theme?: 'apollo' | 'ancient' | 'medieval' }) {
    if (minigame.type === 'memory') {
        return (
            <MemoryGame
                question={minigame.question}
                instructions={minigame.instructions}
                winningCondition={minigame.winningCondition}
                options={minigame.options || []}
                onComplete={onComplete}
            />
        );
    }

    if (minigame.type === 'cipher') {
        return (
            <CipherGame
                question={minigame.question}
                instructions={minigame.instructions}
                winningCondition={minigame.winningCondition}
                encrypted={minigame.encrypted || ''}
                decrypted={minigame.decrypted || ''}
                onComplete={onComplete}
            />
        );
    }

    if (minigame.type === 'sequence') {
        return (
            <SequenceGame
                question={minigame.question}
                instructions={minigame.instructions}
                winningCondition={minigame.winningCondition}
                items={minigame.items || []}
                correctOrder={minigame.correctOrder || []}
                onComplete={onComplete}
            />
        );
    }

    if (minigame.type === 'microscope') {
        return (
            <MicroscopeGame
                question={minigame.question}
                instructions={minigame.instructions}
                winningCondition={minigame.winningCondition}
                targetName={minigame.targetName || 'Unknown'}
                onComplete={onComplete}
            />
        );
    }

    if (minigame.type === 'mixing') {
        return (
            <MixingGame
                question={minigame.question}
                instructions={minigame.instructions}
                winningCondition={minigame.winningCondition}
                ingredients={minigame.ingredients || []}
                correctCombination={minigame.correctCombination || []}
                onComplete={onComplete}
                theme={theme}
            />
        );
    }

    if (minigame.type === 'timeline') {
        return (
            <TimelineGame
                question={minigame.question}
                instructions={minigame.instructions}
                winningCondition={minigame.winningCondition}
                minVal={minigame.minVal}
                maxVal={minigame.maxVal}
                correctVal={minigame.correctVal}
                unit={minigame.unit}
                onComplete={onComplete}
            />
        );
    }

    if (minigame.type === 'defense') {
        return <DefenseGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'scale') {
        return <ScaleGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'mirror') {
        return <MirrorGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'catapult') {
        return <CatapultGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'circle') {
        return <CircleGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'displacement') {
        return <DisplacementGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'gears') {
        return <GearsGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'tangram') {
        return <TangramGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'lens') {
        return <LensCraftingGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'silo') {
        return <SiloGame minigame={minigame} onComplete={onComplete} />;
    }



    if (minigame.type === 'symbol') {
        return <SymbolMatchingGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'debate') {
        return <DebateGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'ritual') {
        return <RitualGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'constellation') {
        return <ConstellationGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'chemistry') {
        return <ChemistryGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'diagnosis') {
        return <DiagnosisGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'triage') {
        return <TriageGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'sanitation') {
        return <SanitationGame minigame={minigame} onComplete={onComplete} />;
    }

    if (minigame.type === 'ratcatcher') {
        return <RatCatcherGame minigame={minigame} onComplete={onComplete} />;
    }

    // Default to Quiz
    return (
        <QuizGame minigame={minigame} onComplete={onComplete} />
    );
}


