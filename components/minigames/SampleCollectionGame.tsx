'use client';

import React, { useState } from 'react';
import { Minigame } from '@/types';
import { Check, Package, AlertTriangle } from 'lucide-react';
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
    type: 'rock' | 'soil' | 'core';
}

/**
 * SampleCollectionGame - Lunar Sample Collection
 *
 * Historical Context: Apollo 11 astronauts collected 21.5 kg of lunar samples.
 * They used scoops, tongs, and core tubes. Samples were sealed in special
 * containers to prevent contamination and preserve the lunar vacuum.
 *
 * Gameplay: Tap samples to collect them, then seal the container.
 * Collect all samples carefully - avoid cross-contamination!
 */
const SampleCollectionGame: React.FC<SampleCollectionGameProps> = ({ minigame, onComplete, theme = 'apollo' }) => {
    const [samples] = useState<Sample[]>([
        { id: 's1', name: 'Basalt Rock', x: 20, y: 30, collected: false, type: 'rock' },
        { id: 's2', name: 'Regolith Scoop', x: 50, y: 45, collected: false, type: 'soil' },
        { id: 's3', name: 'Breccia Fragment', x: 75, y: 25, collected: false, type: 'rock' },
        { id: 's4', name: 'Fine Dust Sample', x: 35, y: 70, collected: false, type: 'soil' },
        { id: 's5', name: 'Core Tube Sample', x: 65, y: 65, collected: false, type: 'core' },
    ]);

    const [collectedSamples, setCollectedSamples] = useState<string[]>([]);
    const [isSealed, setIsSealed] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [showCollectAnim, setShowCollectAnim] = useState<string | null>(null);

    const isApollo = theme === 'apollo';
    const allCollected = collectedSamples.length === samples.length;

    const handleCollectSample = (sample: Sample) => {
        if (collectedSamples.includes(sample.id) || isSealed) return;

        setShowCollectAnim(sample.id);
        setTimeout(() => {
            setCollectedSamples(prev => [...prev, sample.id]);
            setShowCollectAnim(null);
        }, 300);
    };

    const handleSeal = () => {
        if (!allCollected || isSealed) return;

        setIsSealed(true);
        setIsComplete(true);
        // Score based on collection (always 100 if all collected)
        setTimeout(() => onComplete(100), 1500);
    };

    const getSampleIcon = (type: string) => {
        switch (type) {
            case 'rock': return '🪨';
            case 'soil': return 'ite';
            case 'core': return '🔬';
            default: return '📦';
        }
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
                    Tap samples to collect them, then seal the container
                </p>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 w-full max-w-xs">
                <Package className={`w-5 h-5 ${isApollo ? 'text-green-500' : 'text-amber-500'}`} />
                <div className="flex-1">
                    <div className={`h-2 rounded-full overflow-hidden ${isApollo ? 'bg-black' : 'bg-slate-800'}`}>
                        <motion.div
                            className={`h-full ${isApollo ? 'bg-green-500' : 'bg-amber-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(collectedSamples.length / samples.length) * 100}%` }}
                        />
                    </div>
                </div>
                <span className={`text-sm font-mono ${isApollo ? 'text-green-400' : 'text-white'}`}>
                    {collectedSamples.length}/{samples.length}
                </span>
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

                {/* Horizon line */}
                <div className={`absolute top-1/4 left-0 right-0 h-px ${isApollo ? 'bg-green-900/30' : 'bg-slate-600/30'}`} />

                {/* Earth in sky (small) */}
                <div className="absolute top-4 right-6 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-60" />

                {/* Samples */}
                {samples.map((sample) => {
                    const isCollected = collectedSamples.includes(sample.id);
                    const isAnimating = showCollectAnim === sample.id;

                    return (
                        <motion.button
                            key={sample.id}
                            onClick={() => handleCollectSample(sample)}
                            disabled={isCollected || isSealed}
                            className={`
                                absolute transform -translate-x-1/2 -translate-y-1/2
                                transition-all duration-200
                                ${isCollected
                                    ? 'opacity-30 scale-75'
                                    : 'hover:scale-110 cursor-pointer'
                                }
                            `}
                            style={{ left: `${sample.x}%`, top: `${sample.y}%` }}
                            animate={isAnimating ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] } : {}}
                        >
                            <div className={`
                                w-12 h-12 md:w-14 md:h-14 rounded-lg flex flex-col items-center justify-center
                                ${isCollected
                                    ? 'bg-slate-700/50'
                                    : isApollo
                                        ? 'bg-green-900/80 border-2 border-green-600 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                        : 'bg-amber-900/80 border-2 border-amber-600'
                                }
                            `}>
                                <span className="text-xl">{getSampleIcon(sample.type)}</span>
                            </div>
                            {!isCollected && (
                                <div className={`
                                    absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap
                                    text-[10px] font-mono px-1 rounded
                                    ${isApollo ? 'text-green-400 bg-black/50' : 'text-amber-300 bg-slate-900/50'}
                                `}>
                                    {sample.name}
                                </div>
                            )}
                        </motion.button>
                    );
                })}

                {/* Collection feedback */}
                <AnimatePresence>
                    {showCollectAnim && (
                        <motion.div
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: -20 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-400 font-bold"
                        >
                            +1 Sample
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
                    {samples.map((sample) => {
                        const isCollected = collectedSamples.includes(sample.id);
                        return (
                            <div
                                key={sample.id}
                                className={`
                                    w-10 h-10 rounded flex items-center justify-center text-lg
                                    ${isCollected
                                        ? isApollo
                                            ? 'bg-green-900/50 border border-green-700'
                                            : 'bg-amber-900/50 border border-amber-700'
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
                onClick={handleSeal}
                disabled={!allCollected || isSealed}
                className={`
                    w-full max-w-md py-4 rounded-xl text-lg font-bold uppercase tracking-wider
                    flex items-center justify-center gap-2 transition-all
                    ${isComplete
                        ? 'bg-green-600 text-white'
                        : allCollected
                            ? isApollo
                                ? 'bg-green-700 hover:bg-green-600 text-white border-2 border-green-500'
                                : 'bg-amber-600 hover:bg-amber-500 text-white'
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }
                `}
                whileTap={allCollected && !isSealed ? { scale: 0.95 } : {}}
            >
                {isComplete ? (
                    <>
                        <Check className="w-5 h-5" />
                        Container Sealed!
                    </>
                ) : allCollected ? (
                    <>
                        <Package className="w-5 h-5" />
                        Seal Container
                    </>
                ) : (
                    <>
                        <AlertTriangle className="w-5 h-5" />
                        Collect All Samples First
                    </>
                )}
            </motion.button>

            {/* Educational Tip */}
            <div className={`text-xs text-center max-w-xs ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>
                <strong>Did you know?</strong> Apollo 11 brought back 21.5 kg (47.5 lbs) of lunar samples.
                These rocks are still being studied today and have taught us the Moon formed from a giant
                impact with early Earth!
            </div>
        </div>
    );
};

export default SampleCollectionGame;
