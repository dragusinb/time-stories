'use client';

import React, { useState } from 'react';
import { Minigame } from '@/types';
import { Check, Target, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface AlignmentGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

/**
 * AlignmentGame - Retroreflector Positioning
 *
 * Historical Context: Apollo 11 deployed a Laser Ranging Retroreflector (LRR).
 * It's an array of 100 corner-cube prisms that reflect laser light back to Earth.
 * The astronauts had to position it facing Earth and level it on the surface.
 * Scientists STILL bounce lasers off it today to measure the Moon's distance!
 *
 * Gameplay: Use arrow buttons to adjust tilt and rotation until the
 * crosshairs align with Earth. Simple but requires precision.
 */
const AlignmentGame: React.FC<AlignmentGameProps> = ({ minigame, onComplete, theme = 'apollo' }) => {
    // Position state: 0 is centered/perfect
    const [tiltX, setTiltX] = useState(-15); // Left/right tilt (-30 to +30)
    const [tiltY, setTiltY] = useState(20);  // Up/down tilt (-30 to +30)
    const [isComplete, setIsComplete] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const isApollo = theme === 'apollo';

    // Check if aligned (within tolerance)
    const TOLERANCE = 8; // Increased for better UX
    const isAligned = Math.abs(tiltX) <= TOLERANCE && Math.abs(tiltY) <= TOLERANCE;
    const isClose = Math.abs(tiltX) <= 15 && Math.abs(tiltY) <= 15; // Getting close

    const adjustTilt = (axis: 'x' | 'y', delta: number) => {
        if (isComplete) return;
        setAttempts(prev => prev + 1);

        if (axis === 'x') {
            setTiltX(prev => Math.max(-30, Math.min(30, prev + delta)));
        } else {
            setTiltY(prev => Math.max(-30, Math.min(30, prev + delta)));
        }
    };

    const handleLock = () => {
        if (!isAligned || isComplete) return;

        setIsComplete(true);
        // Score based on precision and attempts
        const precision = 100 - (Math.abs(tiltX) + Math.abs(tiltY)) * 2;
        const attemptPenalty = Math.min(20, attempts);
        const score = Math.max(60, precision - attemptPenalty);
        setTimeout(() => onComplete(Math.round(score)), 1500);
    };

    const handleReset = () => {
        if (isComplete) return;
        setTiltX(-15 + Math.random() * 30 - 15);
        setTiltY(-15 + Math.random() * 30 - 15);
    };

    // Calculate visual offset for the Earth target
    const earthX = 50 + tiltX;
    const earthY = 50 - tiltY; // Inverted because positive Y should move up

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
                    Adjust the reflector until Earth is centered in the crosshairs
                </p>
            </div>

            {/* Status */}
            <div className={`
                px-4 py-2 rounded-lg text-sm font-mono
                ${isAligned
                    ? 'bg-green-900/50 text-green-400 border border-green-600 animate-pulse'
                    : isClose
                        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                        : isApollo
                            ? 'bg-slate-900 text-green-600 border border-green-900'
                            : 'bg-slate-800 text-slate-400 border border-slate-600'
                }
            `}>
                {isAligned
                    ? '● ALIGNED - Press Lock!'
                    : isClose
                        ? `Getting close! X=${tiltX > 0 ? '+' : ''}${tiltX}° Y=${tiltY > 0 ? '+' : ''}${tiltY}°`
                        : `Tilt: X=${tiltX > 0 ? '+' : ''}${tiltX}° Y=${tiltY > 0 ? '+' : ''}${tiltY}°`}
            </div>

            {/* Viewfinder */}
            <div className={`
                relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden
                border-4 ${isApollo ? 'border-green-800 bg-black' : 'border-slate-600 bg-slate-900'}
            `}>
                {/* Stars background */}
                {Array.from({ length: 40 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${(i * 17 + 5) % 100}%`,
                            top: `${(i * 23 + 7) % 100}%`,
                            opacity: 0.3 + Math.random() * 0.4,
                        }}
                    />
                ))}

                {/* Earth (target) */}
                <motion.div
                    className="absolute w-12 h-12 md:w-14 md:h-14 rounded-full"
                    style={{
                        left: `${earthX}%`,
                        top: `${earthY}%`,
                        transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                        x: 0,
                        y: 0,
                        scale: isAligned ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <div className={`
                        w-full h-full rounded-full
                        bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700
                        ${isAligned ? 'shadow-[0_0_20px_rgba(59,130,246,0.8)]' : 'shadow-lg'}
                    `}>
                        {/* Continents hint */}
                        <div className="absolute top-2 left-3 w-3 h-2 bg-green-600/60 rounded-full" />
                        <div className="absolute top-4 right-2 w-4 h-3 bg-green-600/60 rounded" />
                    </div>
                </motion.div>

                {/* Crosshairs (fixed in center) */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Horizontal line */}
                    <div className={`absolute top-1/2 left-0 right-0 h-0.5 ${isAligned ? 'bg-green-400' : isApollo ? 'bg-green-600/50' : 'bg-slate-500/50'}`} />
                    {/* Vertical line */}
                    <div className={`absolute left-1/2 top-0 bottom-0 w-0.5 ${isAligned ? 'bg-green-400' : isApollo ? 'bg-green-600/50' : 'bg-slate-500/50'}`} />
                    {/* Center circle */}
                    <div className={`
                        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-16 h-16 rounded-full border-2
                        ${isAligned
                            ? 'border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                            : isApollo
                                ? 'border-green-600/50'
                                : 'border-slate-500/50'
                        }
                    `} />
                    {/* Outer guide circle */}
                    <div className={`
                        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-32 h-32 rounded-full border border-dashed
                        ${isApollo ? 'border-green-900/50' : 'border-slate-700/50'}
                    `} />
                </div>

                {/* Alignment indicator */}
                {isAligned && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <Target className="w-20 h-20 text-green-400 animate-pulse" />
                    </motion.div>
                )}
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-2">
                {/* Up */}
                <button
                    onClick={() => adjustTilt('y', 5)}
                    disabled={isComplete}
                    className={`
                        w-12 h-12 rounded-lg flex items-center justify-center
                        ${isApollo
                            ? 'bg-green-900/50 border border-green-700 text-green-400 hover:bg-green-800/50'
                            : 'bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700'
                        }
                        disabled:opacity-30
                    `}
                >
                    <ArrowUp className="w-6 h-6" />
                </button>

                {/* Left, Reset, Right */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => adjustTilt('x', 5)}
                        disabled={isComplete}
                        className={`
                            w-12 h-12 rounded-lg flex items-center justify-center
                            ${isApollo
                                ? 'bg-green-900/50 border border-green-700 text-green-400 hover:bg-green-800/50'
                                : 'bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700'
                            }
                            disabled:opacity-30
                        `}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={handleReset}
                        disabled={isComplete}
                        className={`
                            w-10 h-10 rounded-lg flex items-center justify-center
                            ${isApollo
                                ? 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'
                                : 'bg-slate-700 border border-slate-600 text-slate-400 hover:bg-slate-600'
                            }
                            disabled:opacity-30
                        `}
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => adjustTilt('x', -5)}
                        disabled={isComplete}
                        className={`
                            w-12 h-12 rounded-lg flex items-center justify-center
                            ${isApollo
                                ? 'bg-green-900/50 border border-green-700 text-green-400 hover:bg-green-800/50'
                                : 'bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700'
                            }
                            disabled:opacity-30
                        `}
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Down */}
                <button
                    onClick={() => adjustTilt('y', -5)}
                    disabled={isComplete}
                    className={`
                        w-12 h-12 rounded-lg flex items-center justify-center
                        ${isApollo
                            ? 'bg-green-900/50 border border-green-700 text-green-400 hover:bg-green-800/50'
                            : 'bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700'
                        }
                        disabled:opacity-30
                    `}
                >
                    <ArrowDown className="w-6 h-6" />
                </button>
            </div>

            {/* Lock Button - Always visible */}
            <motion.button
                onClick={handleLock}
                disabled={!isAligned || isComplete}
                className={`
                    w-full max-w-xs py-4 rounded-xl text-lg font-bold uppercase tracking-wider
                    flex items-center justify-center gap-2 transition-all border-2
                    ${isComplete
                        ? 'bg-green-600 text-white border-green-500'
                        : isAligned
                            ? 'bg-green-600 hover:bg-green-500 text-white border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse'
                            : isClose
                                ? 'bg-yellow-900/50 text-yellow-400 border-yellow-700 cursor-not-allowed'
                                : 'bg-slate-800 text-slate-300 border-slate-600 cursor-not-allowed'
                    }
                `}
                whileTap={isAligned && !isComplete ? { scale: 0.95 } : {}}
            >
                {isComplete ? (
                    <>
                        <Check className="w-5 h-5" />
                        Reflector Positioned!
                    </>
                ) : isAligned ? (
                    <>
                        <Target className="w-5 h-5" />
                        LOCK POSITION
                    </>
                ) : isClose ? (
                    <>
                        <Target className="w-5 h-5" />
                        Almost There...
                    </>
                ) : (
                    <>
                        <Target className="w-5 h-5" />
                        Center Earth First
                    </>
                )}
            </motion.button>

            {/* Educational Tip */}
            <div className={`text-xs text-center max-w-xs ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>
                <strong>Did you know?</strong> The Lunar Ranging Retroreflector is STILL being used today!
                Scientists bounce lasers off it to measure the Moon's distance to within 1 centimeter.
                The Moon is slowly moving away from Earth at 3.8 cm per year.
            </div>
        </div>
    );
};

export default AlignmentGame;
