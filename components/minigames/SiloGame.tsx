'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Minigame } from '@/types';
import { Check, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SiloGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

/**
 * SiloGame - Pressure Stabilization Challenge
 *
 * Gameplay: A needle swings back and forth like a metronome.
 * Tap LOCK when the needle is in the green zone to capture a reading.
 * Lock 3 successful readings to stabilize the system!
 *
 * Skill: Timing and patience. The needle speed increases with each lock.
 */
const SiloGame: React.FC<SiloGameProps> = ({ minigame, onComplete, theme = 'apollo' }) => {
    const [needleAngle, setNeedleAngle] = useState(0); // -60 to +60 degrees
    const [lockedReadings, setLockedReadings] = useState<number[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [lastAttempt, setLastAttempt] = useState<'success' | 'miss' | null>(null);
    const [speed, setSpeed] = useState(1);

    const READINGS_NEEDED = 3;
    const TARGET_ZONE = 15; // ±15 degrees from center (so -15 to +15 is the green zone)
    const MAX_ANGLE = 60;

    const animationRef = useRef<number | null>(null);
    const directionRef = useRef(1);
    const angleRef = useRef(0);

    const isApollo = theme === 'apollo';

    // Needle swing animation
    useEffect(() => {
        if (isComplete) return;

        const baseSpeed = 1.5 + (lockedReadings.length * 0.5); // Gets faster with each lock

        const animate = () => {
            angleRef.current += directionRef.current * baseSpeed;

            // Bounce at edges
            if (angleRef.current >= MAX_ANGLE) {
                angleRef.current = MAX_ANGLE;
                directionRef.current = -1;
            } else if (angleRef.current <= -MAX_ANGLE) {
                angleRef.current = -MAX_ANGLE;
                directionRef.current = 1;
            }

            setNeedleAngle(angleRef.current);
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isComplete, lockedReadings.length]);

    const handleLock = useCallback(() => {
        if (isComplete) return;

        const isInZone = Math.abs(angleRef.current) <= TARGET_ZONE;

        if (isInZone) {
            // Success! Lock this reading
            const newReadings = [...lockedReadings, angleRef.current];
            setLockedReadings(newReadings);
            setLastAttempt('success');

            if (newReadings.length >= READINGS_NEEDED) {
                setIsComplete(true);
                // Score based on accuracy (how close to center each reading was)
                const avgAccuracy = newReadings.reduce((sum, r) => sum + (TARGET_ZONE - Math.abs(r)), 0) / READINGS_NEEDED;
                const score = Math.round(70 + (avgAccuracy / TARGET_ZONE) * 30);
                setTimeout(() => onComplete(score), 1500);
            }
        } else {
            // Miss - just show feedback, no penalty
            setLastAttempt('miss');
        }

        // Clear feedback after a moment
        setTimeout(() => setLastAttempt(null), 400);
    }, [isComplete, lockedReadings, onComplete]);

    // Calculate needle position on the arc
    const getNeedleStyle = () => {
        return {
            transform: `rotate(${needleAngle}deg)`,
            transformOrigin: 'bottom center',
        };
    };

    const inZone = Math.abs(needleAngle) <= TARGET_ZONE;

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
                    Tap LOCK when the needle is in the green zone!
                </p>
            </div>

            {/* Progress Indicators */}
            <div className="flex items-center gap-3">
                {Array.from({ length: READINGS_NEEDED }).map((_, i) => (
                    <motion.div
                        key={i}
                        className={`
                            w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center
                            ${i < lockedReadings.length
                                ? 'bg-green-500 border-green-400'
                                : isApollo
                                    ? 'bg-slate-900 border-green-800'
                                    : 'bg-slate-800 border-slate-600'
                            }
                        `}
                        animate={i < lockedReadings.length ? { scale: [1, 1.2, 1] } : {}}
                    >
                        {i < lockedReadings.length ? (
                            <Check className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        ) : (
                            <span className={`text-lg font-bold ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>
                                {i + 1}
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Gauge */}
            <div className="relative w-64 h-40 md:w-80 md:h-48">
                {/* Gauge Background */}
                <div className={`
                    absolute inset-0 rounded-t-full border-4 overflow-hidden
                    ${isApollo ? 'bg-black border-green-900' : 'bg-slate-900 border-slate-700'}
                `}>
                    {/* Arc markings */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
                        {/* Background arc */}
                        <path
                            d="M 20,100 A 80,80 0 0,1 180,100"
                            fill="none"
                            stroke={isApollo ? '#1e3a2f' : '#334155'}
                            strokeWidth="20"
                        />
                        {/* Green zone arc */}
                        <path
                            d="M 75,100 A 80,80 0 0,1 125,100"
                            fill="none"
                            stroke={inZone ? '#22c55e' : '#166534'}
                            strokeWidth="22"
                            className={inZone ? 'animate-pulse' : ''}
                        />
                        {/* Tick marks */}
                        {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map((angle) => {
                            const radian = (angle - 90) * (Math.PI / 180);
                            const innerR = 60;
                            const outerR = Math.abs(angle) <= 15 ? 75 : 70;
                            const x1 = 100 + innerR * Math.cos(radian);
                            const y1 = 100 + innerR * Math.sin(radian);
                            const x2 = 100 + outerR * Math.cos(radian);
                            const y2 = 100 + outerR * Math.sin(radian);

                            return (
                                <line
                                    key={angle}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke={Math.abs(angle) <= 15 ? '#22c55e' : '#64748b'}
                                    strokeWidth={angle === 0 ? 3 : 2}
                                />
                            );
                        })}
                    </svg>

                    {/* Needle */}
                    <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 origin-bottom"
                        style={getNeedleStyle()}
                    >
                        <motion.div
                            className={`
                                w-1.5 md:w-2 rounded-t-full
                                ${inZone
                                    ? 'bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.8)]'
                                    : lastAttempt === 'miss'
                                        ? 'bg-red-500'
                                        : isApollo
                                            ? 'bg-green-500'
                                            : 'bg-amber-500'
                                }
                            `}
                            style={{ height: '5.5rem' }}
                            animate={lastAttempt === 'miss' ? { x: [-2, 2, -2, 2, 0] } : {}}
                            transition={{ duration: 0.2 }}
                        />
                    </div>

                    {/* Center pivot */}
                    <div className={`
                        absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
                        w-5 h-5 md:w-6 md:h-6 rounded-full border-2
                        ${isApollo ? 'bg-green-800 border-green-600' : 'bg-slate-700 border-slate-500'}
                    `} />
                </div>

                {/* Zone Label */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <span className={`text-xs font-bold uppercase tracking-wide ${
                        inZone ? 'text-green-400' : 'text-slate-500'
                    }`}>
                        {inZone ? '● OPTIMAL' : 'UNSTABLE'}
                    </span>
                </div>
            </div>

            {/* Feedback Flash */}
            <AnimatePresence>
                {lastAttempt && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`
                            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            px-6 py-3 rounded-xl text-xl font-bold
                            ${lastAttempt === 'success'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500/80 text-white'
                            }
                        `}
                    >
                        {lastAttempt === 'success' ? 'LOCKED!' : 'MISS!'}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lock Button */}
            <motion.button
                onClick={handleLock}
                disabled={isComplete}
                className={`
                    w-full max-w-xs py-5 md:py-6 rounded-xl text-xl font-bold uppercase tracking-wider
                    transition-all flex items-center justify-center gap-3
                    ${isComplete
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : inZone
                            ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                            : isApollo
                                ? 'bg-green-800 hover:bg-green-700 text-green-200 border-2 border-green-700'
                                : 'bg-amber-600 hover:bg-amber-500 text-white'
                    }
                `}
                whileTap={!isComplete ? { scale: 0.95 } : {}}
            >
                {isComplete ? (
                    <>
                        <Check className="w-6 h-6" />
                        Stabilized!
                    </>
                ) : (
                    <>
                        <Target className="w-6 h-6" />
                        Lock Reading
                    </>
                )}
            </motion.button>

            {/* Speed indicator */}
            {!isComplete && (
                <div className={`flex items-center gap-2 text-xs ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>
                    <Zap className="w-3 h-3" />
                    <span>Speed increases with each lock!</span>
                </div>
            )}

            {/* Educational Tip */}
            <div className={`text-xs text-center max-w-xs ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>
                <strong>Did you know?</strong> Apollo astronauts had to manually stabilize systems
                when computers failed. Quick reflexes saved Apollo 13!
            </div>
        </div>
    );
};

export default SiloGame;
