'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Minigame } from '@/types';
import { Check, Package, AlertTriangle, Clock, X, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SampleCollectionGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

interface Sample {
    id: string;
    name: string;
    x: number;
    y: number;
    collected: boolean;
    type: 'rock' | 'soil' | 'core' | 'decoy';
    isTarget: boolean; // True = collect this, False = avoid (contamination)
    scientific: string; // Scientific description for hints
}

/**
 * SampleCollectionGame - Lunar Sample Collection (Redesigned)
 *
 * NEW CHALLENGE MECHANICS:
 * 1. TIME PRESSURE - 30 seconds to complete
 * 2. IDENTIFICATION - Only collect TARGET samples (green border)
 * 3. DECOYS - Red samples are contaminated/worthless - collecting them loses points
 * 4. SCIENTIFIC THINKING - Read descriptions to identify valuable samples
 *
 * Scoring:
 * - Correct sample: +20 points
 * - Wrong sample (decoy): -15 points
 * - Time bonus: +1 point per second remaining
 * - Perfect collection (no mistakes): +20 bonus
 */
const SampleCollectionGame: React.FC<SampleCollectionGameProps> = ({ minigame, onComplete, theme = 'apollo' }) => {
    // Generate randomized samples - some are targets, some are decoys
    const [samples] = useState<Sample[]>(() => {
        const allSamples: Sample[] = [
            // TARGET SAMPLES (collect these) - have scientific value
            { id: 's1', name: 'Basalt Rock', x: 15, y: 35, collected: false, type: 'rock', isTarget: true, scientific: 'Volcanic origin - valuable!' },
            { id: 's2', name: 'Regolith Sample', x: 45, y: 25, collected: false, type: 'soil', isTarget: true, scientific: 'Pristine lunar soil' },
            { id: 's3', name: 'Breccia Fragment', x: 75, y: 40, collected: false, type: 'rock', isTarget: true, scientific: 'Impact melt - rare!' },
            { id: 's4', name: 'Core Tube', x: 60, y: 70, collected: false, type: 'core', isTarget: true, scientific: 'Subsurface layers' },
            // DECOY SAMPLES (avoid these) - contaminated or worthless
            { id: 'd1', name: 'Surface Dust', x: 30, y: 60, collected: false, type: 'decoy', isTarget: false, scientific: 'Too disturbed - skip' },
            { id: 'd2', name: 'Loose Gravel', x: 85, y: 65, collected: false, type: 'decoy', isTarget: false, scientific: 'No scientific value' },
            { id: 'd3', name: 'Crumbite', x: 25, y: 20, collected: false, type: 'decoy', isTarget: false, scientific: 'Contaminated sample' },
        ];

        // Shuffle positions slightly for variety
        return allSamples.map(s => ({
            ...s,
            x: s.x + (Math.random() - 0.5) * 10,
            y: s.y + (Math.random() - 0.5) * 10,
        }));
    });

    const [collectedSamples, setCollectedSamples] = useState<string[]>([]);
    const [mistakes, setMistakes] = useState<string[]>([]); // Decoys collected
    const [isSealed, setIsSealed] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [showFeedback, setShowFeedback] = useState<{ id: string; success: boolean } | null>(null);
    const [hoveredSample, setHoveredSample] = useState<string | null>(null);

    // Timer
    const [timeLeft, setTimeLeft] = useState(30);
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    const targetSamples = samples.filter(s => s.isTarget);
    const allTargetsCollected = targetSamples.every(s => collectedSamples.includes(s.id));
    const isApollo = theme === 'apollo';

    // Timer effect
    useEffect(() => {
        if (!isTimerRunning || isComplete) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsTimerRunning(false);
                    // Time's up - calculate score with what we have
                    handleSeal(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isTimerRunning, isComplete]);

    const calculateScore = useCallback(() => {
        const correctCount = collectedSamples.filter(id =>
            samples.find(s => s.id === id)?.isTarget
        ).length;
        const mistakeCount = mistakes.length;

        let score = 0;
        score += correctCount * 20; // +20 per correct
        score -= mistakeCount * 15; // -15 per mistake
        score += timeLeft; // +1 per second remaining

        // Perfect bonus (all targets, no mistakes)
        if (correctCount === targetSamples.length && mistakeCount === 0) {
            score += 20;
        }

        return Math.max(0, Math.min(100, score));
    }, [collectedSamples, mistakes, timeLeft, samples, targetSamples]);

    const handleCollectSample = (sample: Sample) => {
        if (collectedSamples.includes(sample.id) || mistakes.includes(sample.id) || isSealed) return;

        if (sample.isTarget) {
            // Correct! Collect it
            setShowFeedback({ id: sample.id, success: true });
            setTimeout(() => {
                setCollectedSamples(prev => [...prev, sample.id]);
                setShowFeedback(null);
            }, 300);
        } else {
            // Wrong! It's a decoy
            setShowFeedback({ id: sample.id, success: false });
            setTimeout(() => {
                setMistakes(prev => [...prev, sample.id]);
                setShowFeedback(null);
            }, 300);
        }
    };

    const handleSeal = (forced = false) => {
        if (isSealed) return;
        if (!forced && !allTargetsCollected) return;

        setIsSealed(true);
        setIsComplete(true);
        setIsTimerRunning(false);

        const finalScore = calculateScore();
        setTimeout(() => onComplete(finalScore), 1500);
    };

    const getSampleIcon = (type: string) => {
        switch (type) {
            case 'rock': return '🪨';
            case 'soil': return '🟤';
            case 'core': return '🔬';
            case 'decoy': return '❓';
            default: return '📦';
        }
    };

    const getTimerColor = () => {
        if (timeLeft > 20) return 'text-green-400';
        if (timeLeft > 10) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className={`
            flex flex-col items-center gap-4 p-4 md:p-6 rounded-xl border-2
            ${isApollo
                ? 'bg-slate-950 border-green-900/50'
                : 'bg-slate-900 border-slate-700'
            }
        `}>
            {/* Header */}
            <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">{minigame.question}</h3>
                <p className={`text-xs md:text-sm ${isApollo ? 'text-green-600' : 'text-slate-400'}`}>
                    Collect <strong>valuable</strong> samples only! Hover to identify. Avoid contaminated ones.
                </p>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between w-full max-w-md">
                {/* Timer */}
                <div className={`flex items-center gap-2 ${getTimerColor()}`}>
                    <Clock className="w-5 h-5" />
                    <span className="font-mono text-lg font-bold">{timeLeft}s</span>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-green-400 font-mono">
                        {collectedSamples.filter(id => samples.find(s => s.id === id)?.isTarget).length}/{targetSamples.length}
                    </span>
                    {mistakes.length > 0 && (
                        <>
                            <span className="text-slate-600">|</span>
                            <X className="w-4 h-4 text-red-500" />
                            <span className="text-red-400 font-mono">{mistakes.length}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Lunar Surface */}
            <div className={`
                relative w-full aspect-video max-w-md rounded-xl overflow-hidden
                ${isApollo ? 'bg-gradient-to-b from-black to-slate-900' : 'bg-slate-800'}
            `}>
                {/* Surface texture */}
                <div className="absolute inset-0 opacity-30">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-slate-600"
                            style={{
                                width: `${5 + Math.random() * 15}px`,
                                height: `${5 + Math.random() * 15}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                opacity: 0.3 + Math.random() * 0.3,
                            }}
                        />
                    ))}
                </div>

                {/* Earth in sky */}
                <div className="absolute top-4 right-6 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-60" />

                {/* Hovered Sample Info */}
                <AnimatePresence>
                    {hoveredSample && !isSealed && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-2 left-2 right-2 bg-black/80 rounded-lg p-2 z-20"
                        >
                            {(() => {
                                const sample = samples.find(s => s.id === hoveredSample);
                                if (!sample) return null;
                                return (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{getSampleIcon(sample.type)}</span>
                                        <div>
                                            <div className="text-white font-bold text-sm">{sample.name}</div>
                                            <div className={`text-xs ${sample.isTarget ? 'text-green-400' : 'text-red-400'}`}>
                                                {sample.scientific}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Samples */}
                {samples.map((sample) => {
                    const isCollected = collectedSamples.includes(sample.id);
                    const isMistake = mistakes.includes(sample.id);
                    const isAnimating = showFeedback?.id === sample.id;
                    const isGone = isCollected || isMistake;

                    return (
                        <motion.button
                            key={sample.id}
                            onClick={() => handleCollectSample(sample)}
                            onMouseEnter={() => setHoveredSample(sample.id)}
                            onMouseLeave={() => setHoveredSample(null)}
                            onTouchStart={() => setHoveredSample(sample.id)}
                            disabled={isGone || isSealed}
                            className={`
                                absolute transform -translate-x-1/2 -translate-y-1/2
                                transition-all duration-200
                                ${isGone
                                    ? 'opacity-0 scale-0 pointer-events-none'
                                    : 'hover:scale-110 cursor-pointer'
                                }
                            `}
                            style={{ left: `${sample.x}%`, top: `${sample.y}%` }}
                            animate={isAnimating ? {
                                scale: [1, 1.3, 0],
                                opacity: [1, 1, 0],
                                rotate: showFeedback?.success ? [0, 10, -10, 0] : [0, -20, 20, -20, 0]
                            } : {}}
                        >
                            <div className={`
                                w-12 h-12 md:w-14 md:h-14 rounded-lg flex flex-col items-center justify-center
                                border-2 transition-all
                                ${sample.isTarget
                                    ? 'bg-green-900/80 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                                    : 'bg-red-900/60 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                                }
                            `}>
                                <span className="text-xl">{getSampleIcon(sample.type)}</span>
                                <span className={`text-[8px] font-bold ${sample.isTarget ? 'text-green-400' : 'text-red-400'}`}>
                                    {sample.isTarget ? 'TARGET' : 'SKIP'}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}

                {/* Feedback animations */}
                <AnimatePresence>
                    {showFeedback && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className={`
                                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                text-2xl font-bold z-30
                                ${showFeedback.success ? 'text-green-400' : 'text-red-400'}
                            `}
                        >
                            {showFeedback.success ? '+20' : '-15'}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sample Container Display */}
            <div className={`
                w-full max-w-md p-3 rounded-lg border-2
                ${isApollo ? 'bg-black border-green-800' : 'bg-slate-800 border-slate-600'}
            `}>
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs uppercase tracking-wider ${isApollo ? 'text-green-600' : 'text-slate-400'}`}>
                        Sample Return Container
                    </span>
                    {isSealed && (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> SEALED
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {targetSamples.map((sample) => {
                        const isCollected = collectedSamples.includes(sample.id);
                        return (
                            <div
                                key={sample.id}
                                className={`
                                    w-10 h-10 rounded flex items-center justify-center text-lg
                                    ${isCollected
                                        ? 'bg-green-900/50 border border-green-700'
                                        : 'bg-slate-700/30 border border-slate-600 border-dashed'
                                    }
                                `}
                            >
                                {isCollected ? getSampleIcon(sample.type) : ''}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Seal Button */}
            <motion.button
                onClick={() => handleSeal(false)}
                disabled={!allTargetsCollected || isSealed}
                className={`
                    w-full max-w-md py-4 rounded-xl text-lg font-bold uppercase tracking-wider
                    flex items-center justify-center gap-2 transition-all
                    ${isComplete
                        ? 'bg-green-600 text-white'
                        : allTargetsCollected
                            ? 'bg-green-700 hover:bg-green-600 text-white border-2 border-green-500'
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }
                `}
                whileTap={allTargetsCollected && !isSealed ? { scale: 0.95 } : {}}
            >
                {isComplete ? (
                    <>
                        <Check className="w-5 h-5" />
                        Score: {calculateScore()}
                    </>
                ) : allTargetsCollected ? (
                    <>
                        <Package className="w-5 h-5" />
                        Seal Container
                    </>
                ) : (
                    <>
                        <AlertTriangle className="w-5 h-5" />
                        Collect All Target Samples
                    </>
                )}
            </motion.button>

            {/* Hint */}
            <div className={`text-xs text-center max-w-xs ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>
                <strong>Tip:</strong> Green border = valuable target. Red = contaminated/skip.
                Hover/tap to read scientific notes!
            </div>
        </div>
    );
};

export default SampleCollectionGame;
