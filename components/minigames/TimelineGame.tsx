'use client';

import { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelineGameProps {
    question: string;
    instructions?: string;
    winningCondition?: string;
    minVal?: number;
    maxVal?: number;
    correctVal?: number;
    unit?: string;
    onComplete: (success: boolean) => void;
}

export function TimelineGame({
    question,
    instructions,
    winningCondition,
    minVal = 1,
    maxVal = 30,
    correctVal = 8,
    unit = 'Days',
    onComplete
}: TimelineGameProps) {
    const [value, setValue] = useState(minVal);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState<'success' | 'failure' | null>(null);

    const handleSubmit = () => {
        setIsSubmitted(true);

        if (value === correctVal) {
            setResult('success');
            setTimeout(() => onComplete(true), 1500);
        } else {
            setResult('failure');
            setTimeout(() => {
                setResult(null);
                setIsSubmitted(false);
            }, 2000);
        }
    };

    // Calculate percentage for slider background
    const percentage = ((value - minVal) / (maxVal - minVal)) * 100;

    return (
        <div className="max-w-4xl mx-auto py-8 font-pixel">
            <div className="pixel-card p-8 mb-8 text-center border-amber-500/30">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <Clock className="w-12 h-12 text-amber-500" />
                    <h3 className="text-2xl text-amber-500 uppercase tracking-widest">Quarantine Timer</h3>
                </div>
                <p className="text-slate-400 text-sm mb-2">{question}</p>
                {instructions && <p className="text-xs text-slate-500 mb-1">INSTR: {instructions}</p>}
                {winningCondition && <p className="text-xs text-slate-500">GOAL: {winningCondition}</p>}
            </div>

            <div className="pixel-card p-12 bg-slate-900/50 flex flex-col items-center justify-center min-h-[300px]">

                <div className="w-full max-w-lg relative mb-12">
                    {/* Value Display */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 border-4 border-slate-600 px-6 py-2 text-2xl text-amber-500 font-bold tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        {value} {unit}
                    </div>

                    {/* Slider Track */}
                    <div className="h-8 bg-slate-800 border-4 border-slate-700 relative rounded-none">
                        <div
                            className="absolute top-0 left-0 h-full bg-amber-500/20"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {/* Slider Input */}
                    <input
                        type="range"
                        min={minVal}
                        max={maxVal}
                        value={value}
                        onChange={(e) => setValue(parseInt(e.target.value))}
                        disabled={isSubmitted}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />

                    {/* Custom Thumb (Visual Only) */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-8 h-12 bg-amber-500 border-4 border-amber-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] pointer-events-none transition-all duration-75 z-10"
                        style={{ left: `calc(${percentage}% - 16px)` }}
                    >
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                            <div className="w-4 h-1 bg-amber-700/50" />
                            <div className="w-4 h-1 bg-amber-700/50" />
                            <div className="w-4 h-1 bg-amber-700/50" />
                        </div>
                    </div>

                    {/* Ticks */}
                    <div className="flex justify-between mt-4 text-xs text-slate-500 font-mono">
                        <span>{minVal} {unit}</span>
                        <span>{Math.floor((maxVal + minVal) / 2)} {unit}</span>
                        <span>{maxVal} {unit}</span>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitted}
                    className={`w-full max-w-md py-4 text-lg uppercase tracking-widest transition-all border-4 flex items-center justify-center gap-2 ${!isSubmitted
                            ? 'bg-amber-500 border-amber-600 text-slate-900 hover:bg-amber-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:translate-x-1 active:shadow-none'
                            : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    {isSubmitted ? 'Verifying...' : 'Set Quarantine Duration'}
                </button>

                {result === 'success' && (
                    <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                        <p className="text-green-400 font-bold uppercase tracking-widest text-center">
                            Correct Duration.<br />Safety Protocols Active.
                        </p>
                    </div>
                )}

                {result === 'failure' && (
                    <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
                        <AlertTriangle className="w-12 h-12 text-red-500 mb-2" />
                        <p className="text-red-400 font-bold uppercase tracking-widest text-center">
                            Incorrect Duration.<br />Risk of Infection High.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
