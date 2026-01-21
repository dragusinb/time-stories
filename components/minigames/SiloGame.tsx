'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';
import { Plus, Minus, Check, AlertTriangle } from 'lucide-react';

interface SiloGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

/**
 * SiloGame - A kid-friendly pressure/fuel management game
 *
 * Educational concept: Astronauts need precise amounts of oxygen, fuel, and other
 * resources. Too little = danger. Too much = wasted weight or overflow.
 *
 * Gameplay: Tap + to add, tap - to remove. Get the level into the green target zone.
 */
const SiloGame: React.FC<SiloGameProps> = ({ minigame, onComplete, theme = 'apollo' }) => {
    const [level, setLevel] = useState(30); // Start below target
    const [isComplete, setIsComplete] = useState(false);
    const [attempts, setAttempts] = useState(0);

    // Target zone: 70-80%
    const TARGET_MIN = 70;
    const TARGET_MAX = 80;
    const TARGET_CENTER = 75;

    const isApollo = theme === 'apollo';

    // Check if in target zone
    const inTargetZone = level >= TARGET_MIN && level <= TARGET_MAX;
    const tooLow = level < TARGET_MIN;
    const tooHigh = level > TARGET_MAX;

    // Handle increment/decrement
    const adjustLevel = (delta: number) => {
        if (isComplete) return;
        setLevel(prev => Math.max(0, Math.min(100, prev + delta)));
    };

    // Handle submit
    const handleSubmit = () => {
        if (isComplete) return;
        setAttempts(prev => prev + 1);

        if (inTargetZone) {
            setIsComplete(true);
            // Score based on how close to center (75%)
            const accuracy = 100 - Math.abs(level - TARGET_CENTER) * 2;
            setTimeout(() => onComplete(Math.max(50, accuracy)), 1500);
        }
    };

    // Get status message
    const getStatusMessage = () => {
        if (isComplete) return "Perfect! Levels optimal.";
        if (tooLow) return `Too low! Add more. (Target: ${TARGET_MIN}-${TARGET_MAX}%)`;
        if (tooHigh) return `Too high! Remove some. (Target: ${TARGET_MIN}-${TARGET_MAX}%)`;
        return "In the green zone! Lock it in!";
    };

    // Get status color
    const getStatusColor = () => {
        if (isComplete) return 'text-green-400';
        if (inTargetZone) return 'text-green-400';
        return 'text-amber-400';
    };

    return (
        <div className={`
            flex flex-col items-center gap-6 p-6 rounded-xl border-2
            ${isApollo
                ? 'bg-slate-950 border-green-900/50 text-green-500'
                : 'bg-slate-900 border-slate-700 text-amber-500'
            }
        `}>
            {/* Header */}
            <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">{minigame.question}</h3>
                <p className={`text-sm ${isApollo ? 'text-green-600' : 'text-slate-400'}`}>
                    {minigame.instructions}
                </p>
            </div>

            {/* Main Display */}
            <div className="flex items-center gap-8">
                {/* Tank Visual */}
                <div className="relative">
                    {/* Tank Container */}
                    <div className={`
                        relative w-28 h-56 rounded-lg border-4 overflow-hidden
                        ${isApollo ? 'bg-black border-green-800' : 'bg-slate-800 border-slate-600'}
                    `}>
                        {/* Target Zone Indicator */}
                        <div
                            className="absolute w-full bg-green-500/20 border-y-2 border-green-500/50 z-10"
                            style={{
                                bottom: `${TARGET_MIN}%`,
                                height: `${TARGET_MAX - TARGET_MIN}%`
                            }}
                        >
                            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-green-400 font-mono">
                                TARGET
                            </span>
                        </div>

                        {/* Fill Level */}
                        <div
                            className={`
                                absolute bottom-0 w-full transition-all duration-300 ease-out
                                ${inTargetZone
                                    ? 'bg-gradient-to-t from-green-600 to-green-500'
                                    : isApollo
                                        ? 'bg-gradient-to-t from-green-700 to-green-600'
                                        : 'bg-gradient-to-t from-amber-600 to-amber-500'
                                }
                            `}
                            style={{ height: `${level}%` }}
                        >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        </div>

                        {/* Level markers */}
                        {[25, 50, 75].map(mark => (
                            <div
                                key={mark}
                                className="absolute right-0 w-2 h-px bg-slate-500"
                                style={{ bottom: `${mark}%` }}
                            >
                                <span className="absolute right-3 -top-1.5 text-[9px] text-slate-500 font-mono">
                                    {mark}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Tank Base */}
                    <div className={`
                        w-32 h-4 -mt-1 mx-auto rounded-b-lg
                        ${isApollo ? 'bg-green-900' : 'bg-slate-700'}
                    `}></div>
                </div>

                {/* Controls Panel */}
                <div className="flex flex-col items-center gap-4">
                    {/* Current Level Display */}
                    <div className={`
                        px-6 py-3 rounded-lg border-2 text-center min-w-[100px]
                        ${inTargetZone
                            ? 'bg-green-900/30 border-green-500 text-green-400'
                            : isApollo
                                ? 'bg-black border-green-800 text-green-500'
                                : 'bg-slate-800 border-slate-600 text-amber-500'
                        }
                    `}>
                        <div className="text-3xl font-bold font-mono">{level}%</div>
                        <div className="text-xs uppercase tracking-wider opacity-70">Level</div>
                    </div>

                    {/* Adjustment Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => adjustLevel(-5)}
                            disabled={isComplete || level <= 0}
                            className={`
                                w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold
                                transition-all active:scale-95 disabled:opacity-30
                                ${isApollo
                                    ? 'bg-red-900/50 border-2 border-red-700 text-red-400 hover:bg-red-900/70'
                                    : 'bg-red-900/50 border-2 border-red-700 text-red-400 hover:bg-red-900/70'
                                }
                            `}
                        >
                            <Minus className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => adjustLevel(5)}
                            disabled={isComplete || level >= 100}
                            className={`
                                w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold
                                transition-all active:scale-95 disabled:opacity-30
                                ${isApollo
                                    ? 'bg-green-900/50 border-2 border-green-700 text-green-400 hover:bg-green-900/70'
                                    : 'bg-green-900/50 border-2 border-green-700 text-green-400 hover:bg-green-900/70'
                                }
                            `}
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Fine Adjustment */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => adjustLevel(-1)}
                            disabled={isComplete || level <= 0}
                            className={`
                                px-3 py-1 rounded text-xs font-mono
                                ${isApollo ? 'bg-slate-800 text-green-600 hover:bg-slate-700' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}
                                disabled:opacity-30
                            `}
                        >
                            -1
                        </button>
                        <button
                            onClick={() => adjustLevel(1)}
                            disabled={isComplete || level >= 100}
                            className={`
                                px-3 py-1 rounded text-xs font-mono
                                ${isApollo ? 'bg-slate-800 text-green-600 hover:bg-slate-700' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}
                                disabled:opacity-30
                            `}
                        >
                            +1
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Message */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isComplete
                    ? 'bg-green-900/30'
                    : inTargetZone
                        ? 'bg-green-900/20'
                        : 'bg-amber-900/20'
            }`}>
                {isComplete ? (
                    <Check className="w-4 h-4 text-green-400" />
                ) : inTargetZone ? (
                    <Check className="w-4 h-4 text-green-400" />
                ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                    {getStatusMessage()}
                </span>
            </div>

            {/* Submit Button */}
            <Button
                onClick={handleSubmit}
                disabled={isComplete || !inTargetZone}
                className={`
                    w-full py-4 text-lg font-bold uppercase tracking-wider
                    ${isComplete
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : inTargetZone
                            ? isApollo
                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                : 'bg-amber-600 hover:bg-amber-500 text-white'
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }
                `}
            >
                {isComplete ? 'Locked In!' : inTargetZone ? 'Lock Level' : 'Adjust to Target'}
            </Button>

            {/* Educational Tip */}
            <div className={`text-xs text-center max-w-xs ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>
                <strong>Did you know?</strong> Apollo astronauts had to carefully manage oxygen levels.
                Too little meant they couldn&apos;t breathe, too much was a fire hazard!
            </div>
        </div>
    );
};

export default SiloGame;
