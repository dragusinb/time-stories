import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';

interface SiloGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

const SiloGame: React.FC<SiloGameProps> = ({ minigame, onComplete, theme = 'medieval' }) => {
    const [fillLevel, setFillLevel] = useState(50);
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("HOLD to increase pressure. RELEASE to decrease.");
    const [isHolding, setIsHolding] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);

    const animationRef = useRef<number | null>(null);
    const progressRef = useRef(0);
    const fillRef = useRef(50);

    // Target zone
    const TARGET_MIN = 70;
    const TARGET_MAX = 80;
    const REQUIRED_TIME = 100; // Progress units needed to win

    // Physics constants
    const FILL_RATE = 1.2;    // How fast pressure increases when holding
    const DRAIN_RATE = 0.8;   // How fast pressure decreases when releasing
    const DRIFT_AMOUNT = 0.3; // Random drift

    const isApollo = theme === 'apollo';

    useEffect(() => {
        if (!isRunning || gameComplete) return;

        const updateGame = () => {
            // Update fill level based on holding state
            fillRef.current += isHolding ? FILL_RATE : -DRAIN_RATE;

            // Add random drift for challenge
            fillRef.current += (Math.random() - 0.5) * DRIFT_AMOUNT;

            // Clamp between 0 and 100
            fillRef.current = Math.max(0, Math.min(100, fillRef.current));
            setFillLevel(fillRef.current);

            // Check if in target zone
            const inZone = fillRef.current >= TARGET_MIN && fillRef.current <= TARGET_MAX;

            if (inZone) {
                progressRef.current = Math.min(REQUIRED_TIME, progressRef.current + 1);
                setProgress(progressRef.current);

                if (progressRef.current >= REQUIRED_TIME) {
                    setGameComplete(true);
                    setMessage("OPTIMAL PRESSURE ACHIEVED!");
                    setTimeout(() => onComplete(100), 1500);
                    return;
                }
            } else {
                // Slowly lose progress when outside zone
                progressRef.current = Math.max(0, progressRef.current - 0.5);
                setProgress(progressRef.current);
            }

            animationRef.current = requestAnimationFrame(updateGame);
        };

        animationRef.current = requestAnimationFrame(updateGame);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isRunning, isHolding, gameComplete, onComplete]);

    const handleStart = () => {
        setIsRunning(true);
        setMessage("Maintain pressure in the GREEN ZONE!");
    };

    const handlePointerDown = () => {
        if (!isRunning || gameComplete) return;
        setIsHolding(true);
    };

    const handlePointerUp = () => {
        setIsHolding(false);
    };

    const inTargetZone = fillLevel >= TARGET_MIN && fillLevel <= TARGET_MAX;
    const progressPercent = (progress / REQUIRED_TIME) * 100;

    return (
        <div className={`flex flex-col items-center space-y-6 p-4 md:p-8 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] font-pixel transition-colors select-none
            ${isApollo ? 'bg-black border-green-900 text-green-500' : 'bg-slate-900 border-slate-700 text-amber-500'}
        `}>
            <div className="text-center">
                <h3 className={`text-xl md:text-2xl mb-2 tracking-[0.2em] uppercase text-white`}>{minigame.question}</h3>
                <p className={`text-xs font-mono p-2 rounded border inline-block ${isApollo ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-slate-950/50 border-slate-800 text-slate-400'}`}>
                    {minigame.instructions}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                {/* Silo Visual */}
                <div className={`relative w-32 md:w-40 h-64 md:h-80 border-x-4 border-b-4 bg-slate-950 flex items-end shadow-inner overflow-hidden rounded-b-lg ${isApollo ? 'border-green-800' : 'border-slate-600'}`}>
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                    {/* Target Zone */}
                    <div
                        className={`absolute w-full border-y-2 pointer-events-none z-10 transition-colors ${inTargetZone ? 'bg-green-500/40 border-green-400' : 'bg-green-500/20 border-green-500/50'}`}
                        style={{ bottom: `${TARGET_MIN}%`, height: `${TARGET_MAX - TARGET_MIN}%` }}
                    >
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] md:text-[10px] text-green-400 font-mono font-bold">TARGET</div>
                    </div>

                    {/* Liquid / Fuel */}
                    <div
                        className={`w-full transition-all duration-75 ease-out border-t-4 relative ${
                            inTargetZone
                                ? 'bg-green-500/90 border-green-300'
                                : isApollo
                                    ? 'bg-white/90 border-white'
                                    : 'bg-amber-600/90 border-amber-400'
                        }`}
                        style={{ height: `${fillLevel}%` }}
                    >
                        {/* Bubbles / Texture */}
                        <div className={`absolute inset-0 animate-pulse opacity-30 bg-[size:8px_8px] ${
                            inTargetZone
                                ? 'bg-[radial-gradient(circle,_#22c55e_1px,_transparent_1px)]'
                                : isApollo
                                    ? 'bg-[radial-gradient(circle,_#00ff00_1px,_transparent_1px)]'
                                    : 'bg-[radial-gradient(circle,_#fbbf24_1px,_transparent_1px)]'
                        }`}></div>
                        <div className={`absolute top-0 w-full h-2 opacity-50 ${inTargetZone ? 'bg-green-200' : isApollo ? 'bg-green-200' : 'bg-amber-300'}`}></div>
                    </div>

                    {/* Ruler Markings */}
                    {[25, 50, 75].map(mark => (
                        <div key={mark} className="absolute right-0 w-3 h-0.5 bg-slate-500 z-20" style={{ bottom: `${mark}%` }}>
                            <span className="absolute right-4 -top-1.5 text-[8px] md:text-[10px] text-slate-500 font-mono">{mark}</span>
                        </div>
                    ))}

                    {/* Current Level Indicator */}
                    <div
                        className={`absolute left-0 w-3 h-1 z-20 transition-all duration-75 ${inTargetZone ? 'bg-green-400' : 'bg-red-500'}`}
                        style={{ bottom: `${fillLevel}%` }}
                    >
                        <span className={`absolute left-4 -top-1.5 text-[10px] font-mono font-bold ${inTargetZone ? 'text-green-400' : 'text-red-400'}`}>
                            {Math.round(fillLevel)}
                        </span>
                    </div>
                </div>

                {/* Right Panel - Progress & Controls */}
                <div className="flex flex-col items-center space-y-4 w-48">
                    {/* Progress Bar */}
                    <div className="w-full">
                        <div className="flex justify-between text-xs font-mono mb-1">
                            <span className={isApollo ? 'text-green-600' : 'text-slate-400'}>STABILITY</span>
                            <span className={inTargetZone ? 'text-green-400' : 'text-slate-500'}>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className={`h-4 rounded-full overflow-hidden border ${isApollo ? 'bg-black border-green-800' : 'bg-slate-800 border-slate-600'}`}>
                            <div
                                className={`h-full transition-all duration-100 ${inTargetZone ? 'bg-green-500' : 'bg-amber-600'}`}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Digital Readout */}
                    <div className={`w-full font-mono text-2xl md:text-3xl px-4 py-2 border rounded text-center ${
                        inTargetZone
                            ? 'text-green-400 bg-green-900/30 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                            : isApollo
                                ? 'text-green-400 bg-green-900/20 border-green-500'
                                : 'text-amber-400 bg-black/40 border-amber-500/30'
                    }`}>
                        {Math.round(fillLevel)}%
                    </div>

                    {/* Status */}
                    <div className={`text-xs font-mono uppercase tracking-wider ${
                        gameComplete ? 'text-green-400' : inTargetZone ? 'text-green-500 animate-pulse' : 'text-amber-500'
                    }`}>
                        {gameComplete ? 'LOCKED' : inTargetZone ? 'IN ZONE' : fillLevel < TARGET_MIN ? 'TOO LOW' : 'TOO HIGH'}
                    </div>
                </div>
            </div>

            {/* Message */}
            <div className={`h-8 flex items-center justify-center font-mono text-xs md:text-sm tracking-wider uppercase transition-colors duration-300 text-center
                ${gameComplete ? 'text-green-400 animate-pulse' : inTargetZone ? 'text-green-500' : 'text-amber-500/80'}`}>
                {message}
            </div>

            {/* Control Button */}
            {!isRunning ? (
                <Button
                    onClick={handleStart}
                    className={`w-full py-6 text-xl tracking-[0.25em] transition-all
                        ${isApollo
                            ? 'bg-green-700 hover:bg-green-600 text-black border-b-4 border-green-900'
                            : 'bg-amber-600 hover:bg-amber-500 text-black border-b-4 border-amber-800 active:border-b-0 active:translate-y-1'
                        }
                    `}
                >
                    START CALIBRATION
                </Button>
            ) : (
                <button
                    onMouseDown={handlePointerDown}
                    onMouseUp={handlePointerUp}
                    onMouseLeave={handlePointerUp}
                    onTouchStart={handlePointerDown}
                    onTouchEnd={handlePointerUp}
                    disabled={gameComplete}
                    className={`w-full py-8 text-lg md:text-xl tracking-[0.25em] uppercase font-bold transition-all rounded border-4 select-none
                        ${gameComplete
                            ? 'bg-green-600 text-white border-green-800 cursor-not-allowed'
                            : isHolding
                                ? isApollo
                                    ? 'bg-green-500 text-black border-green-300 shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                                    : 'bg-amber-400 text-black border-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                                : isApollo
                                    ? 'bg-green-900 text-green-400 border-green-700 hover:bg-green-800'
                                    : 'bg-slate-800 text-amber-400 border-slate-600 hover:bg-slate-700'
                        }
                    `}
                >
                    {gameComplete ? 'COMPLETE' : isHolding ? 'PRESSURIZING...' : 'HOLD TO PRESSURIZE'}
                </button>
            )}
        </div>
    );
};

export default SiloGame;
