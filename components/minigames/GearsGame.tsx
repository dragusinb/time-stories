import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';
import { Settings, RefreshCw, CheckCircle2 } from 'lucide-react';

interface GearsGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

const GearsGame: React.FC<GearsGameProps> = ({ minigame, onComplete }) => {
    // Gears: Small (High Speed), Medium (Med Speed), Large (Low Speed, High Torque - not simulated but implied)
    // Goal: Connect Driver (Left) to Mirror Mount (Right)
    // The visual gap supports 3 gears.

    // Slots state: array of 3 gear IDs or null
    const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
    const [isRunning, setIsRunning] = useState(false);
    const [message, setMessage] = useState("Align the optics using the gear train.");
    const [mirrorAngle, setMirrorAngle] = useState(0);

    const gears = [
        { id: 'small', size: 40, teeth: 8, color: 'bg-amber-600', border: 'border-amber-800' },
        { id: 'medium', size: 60, teeth: 12, color: 'bg-yellow-700', border: 'border-yellow-900' },
        { id: 'large', size: 80, teeth: 16, color: 'bg-orange-800', border: 'border-orange-950' }
    ];

    const handleSlotClick = (index: number) => {
        if (isRunning) return;
        setSlots(prev => {
            const next = [...prev];
            const current = next[index];
            if (!current) next[index] = 'small';
            else if (current === 'small') next[index] = 'medium';
            else if (current === 'medium') next[index] = 'large';
            else next[index] = null;
            return next;
        });
    };

    const handleEngage = () => {
        if (slots.some(s => s === null)) {
            setMessage("Mechanism incomplete. Fill all gear slots.");
            return;
        }

        setIsRunning(true);
        setMessage("Engaging mechanism...");

        // Win condition: Just completing the chain is enough for this simple puzzle
        // Visual reward is the mirror turning
        setTimeout(() => {
            setMessage("Target Acquired. Ray Focused.");
            setTimeout(() => onComplete(100), 2000);
        }, 3000);
    };

    useEffect(() => {
        if (isRunning) {
            const interval = setInterval(() => {
                setMirrorAngle(prev => prev + 2);
            }, 16);
            return () => clearInterval(interval);
        }
    }, [isRunning]);

    return (
        <div className="flex flex-col items-center space-y-6 p-6 bg-[#1a110d] border-4 border-[#5e4026] shadow-2xl max-w-lg mx-auto select-none font-serif text-[#e6ccb2] rounded-lg">
            {/* Header */}
            <div className="text-center border-b border-[#5e4026] pb-4 w-full">
                <h3 className="text-xl text-[#e6ccb2] mb-1 tracking-[0.2em] uppercase">
                    {minigame.question}
                </h3>
                <p className="text-[#8b5a2b] text-xs font-mono">{minigame.instructions}</p>
            </div>

            {/* Main Mechanism Area */}
            <div className="relative w-full h-80 bg-[#2c1e16] border-4 border-[#3e2723] shadow-inner overflow-hidden flex items-center justify-between px-8 rounded">
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#5d4037 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>

                {/* 1. Drive Shaft (Left) */}
                <div className="relative z-10 flex flex-col items-center -ml-4">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        {/* Base Plate */}
                        <div className="absolute inset-0 bg-[#3e2723] rounded-full border-4 border-[#1a110d] shadow-lg"></div>
                        {/* Driver Gear */}
                        <div
                            className={`w-20 h-20 text-[#8d6e63] drop-shadow-md ${isRunning ? 'animate-spin' : ''}`}
                            style={{ animationDuration: '3s', animationTimingFunction: 'linear' }}
                        >
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <path d="M50 0 L55 10 L65 10 L70 0 L80 5 L80 15 L90 20 L100 15 L100 25 L90 30 L90 40 L100 45 L95 55 L85 55 L80 65 L90 70 L85 80 L75 80 L70 90 L60 85 L50 95 L40 85 L30 90 L25 80 L15 80 L10 70 L20 65 L15 55 L5 55 L0 45 L10 40 L10 30 L0 25 L0 15 L10 20 L20 15 L20 5 L30 0 L40 10 L50 10 Z" fill="currentColor" />
                                <circle cx="50" cy="50" r="15" fill="#3e2723" />
                                <rect x="45" y="45" width="10" height="10" fill="#1a110d" />
                            </svg>
                        </div>
                    </div>
                    <span className="text-[10px] text-[#8b5a2b] mt-2 font-mono uppercase tracking-widest bg-[#1a110d] px-2 py-1 rounded border border-[#3e2723]">Power</span>
                </div>

                {/* 2. Gear Slots */}
                <div className="flex-1 flex justify-center items-center -mx-6 z-0 relative h-full">
                    {/* Connecting Axle Line */}
                    <div className="absolute top-1/2 left-0 w-full h-3 bg-[#1a110d] -z-10 border-y border-[#3e2723]"></div>

                    {slots.map((slot, idx) => {
                        const gear = gears.find(g => g.id === slot);
                        return (
                            <button
                                key={idx}
                                onClick={() => handleSlotClick(idx)}
                                disabled={isRunning}
                                className={`
                                    relative w-28 h-28 flex items-center justify-center
                                    transition-all duration-200
                                    ${!slot ? 'hover:bg-white/5 rounded-full' : ''}
                                `}
                            >
                                {gear ? (
                                    <div
                                        className={`
                                            flex items-center justify-center drop-shadow-2xl filter
                                            ${isRunning ? 'animate-spin' : ''}
                                        `}
                                        style={{
                                            width: `${gear.size}px`,
                                            height: `${gear.size}px`,
                                            animationDuration: `${gear.id === 'large' ? 4 : gear.id === 'medium' ? 2.5 : 1.5}s`,
                                            animationDirection: idx % 2 === 0 ? 'reverse' : 'normal',
                                            animationTimingFunction: 'linear'
                                        }}
                                    >
                                        {/* SVG GEAR */}
                                        <svg viewBox="0 0 100 100" className={`w-full h-full ${gear.id === 'small' ? 'text-[#cd7f32]' : gear.id === 'medium' ? 'text-[#a0522d]' : 'text-[#8b4513]'}`}>
                                            <defs>
                                                <filter id="inset-shadow">
                                                    <feOffset dx="0" dy="0" />
                                                    <feGaussianBlur stdDeviation="2" result="offset-blur" />
                                                    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                                                    <feFlood floodColor="black" floodOpacity="0.5" result="color" />
                                                    <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                                                    <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                                                </filter>
                                            </defs>

                                            {/* Gear Teeth Path (Simplified Procedural-ish look) */}
                                            <path d={
                                                gear.id === 'small'
                                                    ? "M50 5 L55 15 L65 15 L70 5 L80 10 L80 20 L90 25 L100 20 L100 30 L90 35 L90 45 L100 50 L95 60 L85 60 L80 70 L90 75 L85 85 L75 85 L70 95 L60 90 L50 100 L40 90 L30 95 L25 85 L15 85 L10 75 L20 70 L15 60 L5 60 L0 50 L10 45 L10 35 L0 30 L0 20 L10 25 L20 20 L20 10 L30 5 L40 15 L50 15 Z"
                                                    : "M50 0 L54 10 L60 10 L64 0 L74 4 L74 14 L84 18 L94 14 L98 24 L88 28 L88 38 L98 42 L94 52 L84 52 L80 62 L90 66 L86 76 L76 76 L72 86 L62 82 L50 92 L38 82 L28 86 L24 76 L14 76 L10 66 L20 62 L16 52 L6 52 L2 42 L12 38 L12 28 L2 24 L6 14 L16 18 L26 14 L26 4 L36 0 L40 10 L50 10 Z"
                                            } fill="currentColor" stroke="#3e2723" strokeWidth="1" />

                                            {/* Inner Detail */}
                                            <circle cx="50" cy="50" r="20" fill="#1a110d" stroke="currentColor" strokeWidth="2" />
                                            <circle cx="50" cy="50" r="8" fill="#3e2723" />
                                            {/* Mounting Bolt */}
                                            <path d="M45 45 L55 45 L55 55 L45 55 Z" fill="#5d4037" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-[#1a110d] border-2 border-[#5d4037] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center">
                                        <div className="w-2 h-2 bg-[#3e2723] rounded-full"></div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* 3. Mirror Mount (Right) */}
                <div className="relative z-10 flex flex-col items-center -mr-4">
                    <div className="relative">
                        <div
                            className="w-24 h-24 rounded-full border-4 border-[#ffd700] bg-gradient-to-br from-amber-900 to-black flex items-center justify-center overflow-hidden shadow-2xl"
                            style={{ transform: `rotate(${mirrorAngle}deg)`, transition: 'transform 0.1s linear' }}
                        >
                            {/* Mirror Reflection */}
                            <div className="w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
                            {/* Brass Fittings */}
                            <div className="absolute inset-0 border-8 border-amber-700/30 rounded-full"></div>
                            <div className="absolute w-full h-1 bg-amber-500/20 rotate-45"></div>
                            <div className="absolute w-1 h-full bg-amber-500/20 rotate-45"></div>
                        </div>
                        {isRunning && (
                            <div className="absolute -inset-4 border border-amber-500/50 rounded-full animate-ping"></div>
                        )}
                    </div>
                    <span className="text-[10px] text-[#8b5a2b] mt-2 font-mono uppercase tracking-widest bg-[#1a110d] px-2 py-1 rounded border border-[#3e2723]">Optics</span>
                </div>
            </div>

            {/* Status Panel */}
            <div className={`
                w-full p-4 text-center border-2 font-mono text-sm transition-all duration-500 rounded
                ${isRunning
                    ? 'bg-emerald-900/30 border-emerald-700 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)]'
                    : 'bg-[#0f0a08] border-[#3e2723] text-[#8b5a2b]'}
            `}>
                {message}
            </div>

            {/* Action Button */}
            {!isRunning ? (
                <Button
                    onClick={handleEngage}
                    className="w-full py-4 text-lg tracking-[0.2em] bg-gradient-to-r from-[#3e2723] to-[#5d4037] hover:from-[#4e342e] hover:to-[#6d4c41] border border-[#8d6e63] text-[#e6ccb2] uppercase shadow-lg active:translate-y-0.5 transition-all"
                >
                    <Settings className="w-5 h-5 mr-3 animate-spin-slow" />
                    Engage Mechanism
                </Button>
            ) : (
                <div className="flex items-center justify-center text-emerald-500 animate-pulse uppercase tracking-widest font-bold py-2">
                    <CheckCircle2 className="w-6 h-6 mr-3" />
                    System Active
                </div>
            )}
        </div>
    );
};

export default GearsGame;
