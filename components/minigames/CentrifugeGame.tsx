'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Minigame } from '@/types';
import { RotateCcw, Check, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface CentrifugeGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

/**
 * CentrifugeGame - A kid-friendly sample separation game
 *
 * Educational concept: Centrifuges spin samples at high speeds to separate
 * materials by density. Apollo astronauts used centrifuges to analyze moon rocks!
 *
 * Gameplay: Tap the BOOST button to speed up. Keep the needle in the green zone.
 * The centrifuge naturally slows down, so keep tapping!
 */
export const CentrifugeGame: React.FC<CentrifugeGameProps> = ({ minigame, onComplete, theme = 'apollo' }) => {
    const [speed, setSpeed] = useState(0); // 0-100
    const [progress, setProgress] = useState(0); // 0-100
    const [isComplete, setIsComplete] = useState(false);
    const [rotation, setRotation] = useState(0);

    // Target zone: 60-80 speed
    const TARGET_MIN = 60;
    const TARGET_MAX = 80;
    const BOOST_AMOUNT = 15;
    const DECAY_RATE = 0.5;
    const PROGRESS_RATE = 1;

    const animationRef = useRef<number | null>(null);
    const speedRef = useRef(0);
    const progressRef = useRef(0);

    const inTargetZone = speed >= TARGET_MIN && speed <= TARGET_MAX;

    useEffect(() => {
        const animate = () => {
            if (isComplete) return;

            // Decay speed over time
            speedRef.current = Math.max(0, speedRef.current - DECAY_RATE);
            setSpeed(speedRef.current);

            // Update rotation for visual
            setRotation(prev => prev + speedRef.current * 0.5);

            // Progress when in target zone
            const currentInZone = speedRef.current >= TARGET_MIN && speedRef.current <= TARGET_MAX;
            if (currentInZone) {
                progressRef.current = Math.min(100, progressRef.current + PROGRESS_RATE);
                setProgress(progressRef.current);

                if (progressRef.current >= 100) {
                    setIsComplete(true);
                    setTimeout(() => onComplete(100), 1500);
                    return;
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isComplete, onComplete]);

    const handleBoost = () => {
        if (isComplete) return;
        speedRef.current = Math.min(100, speedRef.current + BOOST_AMOUNT);
        setSpeed(speedRef.current);
    };

    const isApollo = theme === 'apollo';

    // Speed zone status
    const getSpeedStatus = () => {
        if (speed < TARGET_MIN) return { text: 'Too Slow', color: 'text-amber-400' };
        if (speed > TARGET_MAX) return { text: 'Too Fast!', color: 'text-red-400' };
        return { text: 'Perfect!', color: 'text-green-400' };
    };

    const status = getSpeedStatus();

    return (
        <div className={`
            flex flex-col items-center gap-6 p-6 rounded-xl border-2
            ${isApollo
                ? 'bg-slate-950 border-green-900/50'
                : 'bg-slate-900 border-slate-700'
            }
        `}>
            {/* Header */}
            <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">{minigame.question}</h3>
                <p className={`text-sm ${isApollo ? 'text-green-600' : 'text-slate-400'}`}>
                    {minigame.instructions || 'Tap BOOST to spin. Keep the speed in the green zone!'}
                </p>
            </div>

            {/* Centrifuge Visual */}
            <div className="relative">
                {/* Outer ring */}
                <div className={`
                    w-48 h-48 rounded-full border-8 flex items-center justify-center
                    ${isApollo ? 'border-green-900 bg-black' : 'border-slate-700 bg-slate-900'}
                `}>
                    {/* Spinning disc */}
                    <motion.div
                        className={`
                            w-36 h-36 rounded-full border-4 flex items-center justify-center
                            ${inTargetZone
                                ? 'border-green-500 bg-green-900/30'
                                : isApollo
                                    ? 'border-green-700 bg-green-950/50'
                                    : 'border-slate-600 bg-slate-800'
                            }
                        `}
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        {/* Sample slots */}
                        {[0, 60, 120, 180, 240, 300].map((angle) => (
                            <div
                                key={angle}
                                className={`
                                    absolute w-4 h-4 rounded-full
                                    ${inTargetZone ? 'bg-green-400' : 'bg-slate-500'}
                                `}
                                style={{
                                    transform: `rotate(${angle}deg) translateY(-50px)`
                                }}
                            />
                        ))}

                        {/* Center */}
                        <div className={`
                            w-8 h-8 rounded-full
                            ${inTargetZone ? 'bg-green-500' : isApollo ? 'bg-green-800' : 'bg-slate-600'}
                        `} />
                    </motion.div>
                </div>

                {/* Glow effect when in zone */}
                {inTargetZone && (
                    <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl pointer-events-none" />
                )}
            </div>

            {/* Speed Gauge */}
            <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs mb-1">
                    <span className={isApollo ? 'text-green-600' : 'text-slate-400'}>Speed</span>
                    <span className={status.color}>{status.text}</span>
                </div>
                <div className={`h-6 rounded-full overflow-hidden relative ${isApollo ? 'bg-black border border-green-900' : 'bg-slate-800'}`}>
                    {/* Target zone indicator */}
                    <div
                        className="absolute h-full bg-green-500/20"
                        style={{
                            left: `${TARGET_MIN}%`,
                            width: `${TARGET_MAX - TARGET_MIN}%`
                        }}
                    />

                    {/* Speed bar */}
                    <motion.div
                        className={`h-full ${
                            inTargetZone
                                ? 'bg-green-500'
                                : speed > TARGET_MAX
                                    ? 'bg-red-500'
                                    : isApollo
                                        ? 'bg-green-700'
                                        : 'bg-amber-500'
                        }`}
                        style={{ width: `${speed}%` }}
                    />

                    {/* Zone markers */}
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-green-400"
                        style={{ left: `${TARGET_MIN}%` }}
                    />
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-green-400"
                        style={{ left: `${TARGET_MAX}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] mt-1 text-slate-500">
                    <span>0</span>
                    <span className="text-green-500">Target Zone</span>
                    <span>100</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs mb-1">
                    <span className={isApollo ? 'text-green-600' : 'text-slate-400'}>Separation Progress</span>
                    <span className={isApollo ? 'text-green-400' : 'text-white'}>{Math.round(progress)}%</span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${isApollo ? 'bg-black border border-green-900' : 'bg-slate-800'}`}>
                    <motion.div
                        className="h-full bg-gradient-to-r from-green-600 to-green-400"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Boost Button */}
            <button
                onClick={handleBoost}
                disabled={isComplete}
                className={`
                    w-full max-w-xs py-6 rounded-xl text-xl font-bold uppercase tracking-wider
                    transition-all active:scale-95 flex items-center justify-center gap-3
                    ${isComplete
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : isApollo
                            ? 'bg-green-700 hover:bg-green-600 text-white border-2 border-green-500'
                            : 'bg-amber-600 hover:bg-amber-500 text-white'
                    }
                `}
            >
                {isComplete ? (
                    <>
                        <Check className="w-6 h-6" />
                        Complete!
                    </>
                ) : (
                    <>
                        <Zap className="w-6 h-6" />
                        Boost!
                    </>
                )}
            </button>

            {/* Educational Tip */}
            <div className={`text-xs text-center max-w-xs ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>
                <strong>Did you know?</strong> Centrifuges spin up to 30,000 RPM! The spinning force
                separates heavy particles from light ones, helping scientists analyze moon rock samples.
            </div>
        </div>
    );
};

export default CentrifugeGame;
