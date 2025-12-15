import React, { useState } from 'react';
import { Minigame } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CircleGameProps {
    minigame: Minigame;
    onComplete: (success: boolean) => void;
}

export const CircleGame: React.FC<CircleGameProps> = ({ minigame, onComplete }) => {
    const [radius, setRadius] = useState(10);
    const [circumferenceInput, setCircumferenceInput] = useState("");
    const [areaInput, setAreaInput] = useState("");
    const [message, setMessage] = useState("Calculate the Circumference (2*pi*r) and Area (pi*r^2). Use pi = 3.14");

    const checkAnswer = () => {
        const pi = 3.14;
        const expectedC = 2 * pi * radius;
        const expectedA = pi * radius * radius;

        const userC = parseFloat(circumferenceInput);
        const userA = parseFloat(areaInput);

        if (Math.abs(userC - expectedC) < 0.1 && Math.abs(userA - expectedA) < 0.1) {
            setMessage("Correct! The geometry is perfect.");
            setTimeout(() => onComplete(true), 1500);
        } else {
            setMessage("Incorrect. Check your calculations.");
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-6 bg-slate-900 border-4 border-amber-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="text-center">
                <h3 className="text-xl font-serif text-amber-500 mb-2 tracking-widest uppercase">{minigame.question}</h3>
                <p className="text-slate-400 text-xs font-mono">{minigame.instructions}</p>
            </div>

            {/* Visual Aid: Sand Drawing */}
            <div className="relative w-64 h-64 bg-[#d4b483] border-4 border-[#8c6b3f] flex items-center justify-center overflow-hidden shadow-inner">
                <div className="absolute inset-0 opacity-20 bg-[url('/images/noise.png')]"></div>

                {/* The Circle */}
                <div
                    className="border-4 border-slate-800 rounded-full flex items-center justify-center transition-all duration-500 relative"
                    style={{ width: `${radius * 10}px`, height: `${radius * 10}px` }}
                >
                    {/* Radius Line */}
                    <div className="absolute w-1/2 h-0.5 bg-red-600 right-0 top-1/2" style={{ width: `${radius * 5}px` }}></div>
                    <span className="absolute text-xs font-bold text-red-800 -mt-6 ml-6 font-mono">r={radius}</span>

                    {/* Center Point */}
                    <div className="absolute w-2 h-2 bg-slate-800 rounded-full"></div>
                </div>

                <span className="absolute bottom-2 right-2 text-[10px] text-[#8c6b3f] font-serif italic">Archimedes' Sand Pit</span>
            </div>

            <div className="flex space-x-4">
                {[5, 10, 15].map(r => (
                    <button
                        key={r}
                        onClick={() => setRadius(r)}
                        className={`px-3 py-1 text-xs font-mono border-2 transition-all ${radius === r
                                ? 'bg-amber-500 border-amber-600 text-white'
                                : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        r={r}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-mono uppercase">Circumference (C)</label>
                    <Input
                        type="number"
                        placeholder="2 * 3.14 * r"
                        value={circumferenceInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCircumferenceInput(e.target.value)}
                        className="bg-slate-800 border-2 border-slate-600 text-white font-mono focus:border-amber-500 rounded-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-mono uppercase">Area (A)</label>
                    <Input
                        type="number"
                        placeholder="3.14 * r^2"
                        value={areaInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAreaInput(e.target.value)}
                        className="bg-slate-800 border-2 border-slate-600 text-white font-mono focus:border-amber-500 rounded-none"
                    />
                </div>
            </div>

            <div className="h-8 text-amber-400 font-bold font-mono text-sm uppercase tracking-wider">{message}</div>

            <Button
                onClick={checkAnswer}
                className="pixel-btn-primary w-full py-4 text-lg uppercase tracking-widest"
            >
                Verify Calculations
            </Button>
        </div>
    );
};
