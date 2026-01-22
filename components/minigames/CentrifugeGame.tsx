'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Minigame } from '@/types';
import { Check, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CentrifugeGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

/**
 * CentrifugeGame - Rhythm Spin Challenge
 *
 * Gameplay: The centrifuge has a beat! A ring pulses outward rhythmically.
 * Tap when the ring aligns with the target circle for a "Perfect" or "Good" hit.
 * Chain good hits to build up speed and separate the sample!
 *
 * Skill: Rhythm and timing. Feel the beat!
 */
export const CentrifugeGame: React.FC<CentrifugeGameProps> = ({ minigame, onComplete, theme = 'apollo' }) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [ringScale, setRingScale] = useState(0.3);
    const [combo, setCombo] = useState(0);
    const [lastHit, setLastHit] = useState<'perfect' | 'good' | 'miss' | null>(null);
    const [speed, setSpeed] = useState(30); // RPM visual

    // Timing windows (more forgiving)
    const PERFECT_MIN = 0.75;
    const PERFECT_MAX = 0.95;
    const GOOD_MIN = 0.6;
    const GOOD_MAX = 1.1;
    const BEAT_DURATION = 1800; // ms per beat (slower, easier to track)

    const animationRef = useRef<number | null>(null);
    const beatStartRef = useRef(Date.now());
    const progressRef = useRef(0);

    const isApollo = theme === 'apollo';

    // Ring expansion animation (the "beat")
    useEffect(() => {
        if (isComplete) return;

        const animate = () => {
            const now = Date.now();
            const elapsed = (now - beatStartRef.current) % BEAT_DURATION;
            const beatProgress = elapsed / BEAT_DURATION;

            // Ring expands from 0.3 to 1.2, then resets
            setRingScale(0.3 + beatProgress * 0.9);

            // Spin the centrifuge based on current speed
            setRotation(prev => prev + speed * 0.1);

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isComplete, speed]);

    const handleTap = useCallback(() => {
        if (isComplete) return;

        const now = Date.now();
        const elapsed = (now - beatStartRef.current) % BEAT_DURATION;
        const beatProgress = elapsed / BEAT_DURATION;

        // Check timing
        let hitType: 'perfect' | 'good' | 'miss';
        let progressGain = 0;
        let speedGain = 0;

        if (beatProgress >= PERFECT_MIN && beatProgress <= PERFECT_MAX) {
            hitType = 'perfect';
            progressGain = 8 + combo * 2;
            speedGain = 15;
            setCombo(prev => prev + 1);
        } else if (beatProgress >= GOOD_MIN && beatProgress <= GOOD_MAX) {
            hitType = 'good';
            progressGain = 5 + combo;
            speedGain = 8;
            setCombo(prev => prev + 1);
        } else {
            hitType = 'miss';
            progressGain = -2;
            speedGain = -20;
            setCombo(0);
        }

        setLastHit(hitType);
        setTimeout(() => setLastHit(null), 300);

        // Update progress
        progressRef.current = Math.max(0, Math.min(100, progressRef.current + progressGain));
        setProgress(progressRef.current);

        // Update speed (visual only)
        setSpeed(prev => Math.max(20, Math.min(120, prev + speedGain)));

        // Check completion
        if (progressRef.current >= 100) {
            setIsComplete(true);
            const score = 70 + Math.min(30, combo * 3);
            setTimeout(() => onComplete(score), 1500);
        }
    }, [isComplete, combo, onComplete]);

    // Calculate ring color based on timing
    const getRingColor = () => {
        if (ringScale >= PERFECT_MIN && ringScale <= PERFECT_MAX) {
            return 'border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.8)]';
        }
        if (ringScale >= GOOD_MIN && ringScale <= GOOD_MAX) {
            return 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]';
        }
        return isApollo ? 'border-green-800' : 'border-slate-600';
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
                    Tap when the ring hits the target circle!
                </p>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between w-full max-w-xs text-sm">
                <div className={`flex items-center gap-1 ${isApollo ? 'text-green-500' : 'text-amber-500'}`}>
                    <Zap className="w-4 h-4" />
                    <span className="font-mono">{Math.round(speed)} RPM</span>
                </div>
                {combo > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-2 py-1 bg-amber-500 text-black rounded font-bold text-xs"
                    >
                        {combo}x COMBO
                    </motion.div>
                )}
            </div>

            {/* Centrifuge Visual */}
            <div
                className="relative w-64 h-64 md:w-72 md:h-72 cursor-pointer select-none"
                onClick={handleTap}
            >
                {/* Target ring (the goal) */}
                <div className={`
                    absolute inset-4 rounded-full border-4 border-dashed
                    ${isApollo ? 'border-green-500/50' : 'border-amber-500/50'}
                `} />

                {/* Expanding beat ring */}
                <motion.div
                    className={`
                        absolute rounded-full border-4 transition-colors duration-100
                        ${getRingColor()}
                    `}
                    style={{
                        width: `${ringScale * 100}%`,
                        height: `${ringScale * 100}%`,
                        left: `${(1 - ringScale) * 50}%`,
                        top: `${(1 - ringScale) * 50}%`,
                    }}
                />

                {/* Centrifuge disc */}
                <div className={`
                    absolute inset-12 md:inset-14 rounded-full border-4
                    ${isApollo ? 'border-green-700 bg-green-950/50' : 'border-slate-600 bg-slate-800'}
                `}>
                    {/* Spinning inner disc */}
                    <motion.div
                        className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-700 to-slate-900"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        {/* Sample slots */}
                        {[0, 60, 120, 180, 240, 300].map((angle) => (
                            <div
                                key={angle}
                                className={`
                                    absolute w-3 h-3 md:w-4 md:h-4 rounded-full
                                    ${progress > (angle / 360) * 100
                                        ? 'bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                                        : isApollo ? 'bg-green-900' : 'bg-slate-600'
                                    }
                                `}
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: `rotate(${angle}deg) translateY(-200%) translateX(-50%)`
                                }}
                            />
                        ))}

                        {/* Center hub */}
                        <div className={`
                            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                            w-6 h-6 md:w-8 md:h-8 rounded-full
                            ${isApollo ? 'bg-green-600' : 'bg-amber-600'}
                        `} />
                    </motion.div>
                </div>

                {/* Hit feedback */}
                <AnimatePresence>
                    {lastHit && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: 0 }}
                            animate={{ opacity: 1, scale: 1, y: -20 }}
                            exit={{ opacity: 0, y: -40 }}
                            className={`
                                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                px-4 py-2 rounded-lg text-lg font-bold
                                ${lastHit === 'perfect'
                                    ? 'bg-green-500 text-white'
                                    : lastHit === 'good'
                                        ? 'bg-amber-500 text-black'
                                        : 'bg-red-500 text-white'
                                }
                            `}
                        >
                            {lastHit === 'perfect' ? 'PERFECT!' : lastHit === 'good' ? 'GOOD!' : 'MISS'}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tap instruction */}
                {!isComplete && progress < 20 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-center text-slate-400"
                    >
                        TAP HERE
                    </motion.div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs mb-1">
                    <span className={isApollo ? 'text-green-600' : 'text-slate-400'}>Sample Separation</span>
                    <span className={isApollo ? 'text-green-400' : 'text-white'}>{Math.round(progress)}%</span>
                </div>
                <div className={`h-4 rounded-full overflow-hidden ${isApollo ? 'bg-black border border-green-900' : 'bg-slate-800'}`}>
                    <motion.div
                        className={`h-full ${
                            progress >= 80
                                ? 'bg-gradient-to-r from-green-600 to-green-400'
                                : isApollo
                                    ? 'bg-gradient-to-r from-green-800 to-green-600'
                                    : 'bg-gradient-to-r from-amber-600 to-amber-400'
                        }`}
                        style={{ width: `${progress}%` }}
                        animate={lastHit === 'perfect' ? { scale: [1, 1.02, 1] } : {}}
                    />
                </div>
            </div>

            {/* Timing Guide */}
            <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className={isApollo ? 'text-green-600' : 'text-slate-400'}>Perfect</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className={isApollo ? 'text-green-600' : 'text-slate-400'}>Good</span>
                </div>
            </div>

            {/* Complete overlay */}
            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-green-900/50 rounded-xl flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="text-center"
                        >
                            <Check className="w-16 h-16 text-green-400 mx-auto mb-2" />
                            <div className="text-green-400 font-bold text-xl">Sample Isolated!</div>
                            <div className="text-green-600">Max combo: {combo}x</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Educational Tip */}
            <div className={`text-xs text-center max-w-xs ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>
                <strong>Did you know?</strong> Centrifuges spin samples at thousands of RPM!
                The spinning force separates heavy particles from light ones - that's how scientists
                analyzed moon rock samples.
            </div>
        </div>
    );
};

export default CentrifugeGame;
