import React, { useState, useEffect, useRef } from 'react';
import { Minigame } from '@/types';
import { Button } from '@/components/ui/Button';
import { RotateCcw, Play, CheckCircle2 } from 'lucide-react';

interface CentrifugeGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

export const CentrifugeGame: React.FC<CentrifugeGameProps> = ({ minigame, onComplete }) => {
    const [rpm, setRpm] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("Hold START to spin. Keep RPM in the GREEN ZONE.");
    const [gameState, setGameState] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');

    // Constants
    const TARGET_RPM_MIN = 3500;
    const TARGET_RPM_MAX = 4500;
    const MAX_RPM = 6000;
    const ACCEL = 150;
    const DRAG = 50;

    const animationRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);

    const checkSuccess = (currentProgress: number) => {
        if (currentProgress >= 100) {
            setGameState('success');
            setMessage("Separation Complete! Samples isolated.");
            setTimeout(() => onComplete(100), 2000);
            return true;
        }
        return false;
    };

    const updatePhysics = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000; // Delta time in seconds
        lastTimeRef.current = timestamp;

        if (gameState === 'success') return;

        setRpm(prevRpm => {
            let newRpm = prevRpm;

            // Physics: Acceleration vs Drag
            if (isSpinning) {
                newRpm += ACCEL;
            } else {
                newRpm -= DRAG;
            }

            // Clamp
            newRpm = Math.max(0, Math.min(newRpm, MAX_RPM));

            // Check Target Zone
            if (newRpm >= TARGET_RPM_MIN && newRpm <= TARGET_RPM_MAX) {
                setProgress(p => {
                    const newProgress = Math.min(100, p + 0.5); // Increment progress
                    checkSuccess(newProgress);
                    return newProgress;
                });
            } else {
                // Penalize slightly if out of zone? Optional.
                // setProgress(p => Math.max(0, p - 0.1));
            }

            return newRpm;
        });

        animationRef.current = requestAnimationFrame(updatePhysics);
    };

    const handleMouseDown = () => {
        if (gameState === 'success') return;
        setIsSpinning(true);
        if (gameState === 'idle') {
            setGameState('running');
            lastTimeRef.current = performance.now();
            animationRef.current = requestAnimationFrame(updatePhysics);
        }
    };

    const handleMouseUp = () => {
        setIsSpinning(false);
    };

    useEffect(() => {
        return () => {
            if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    // Visual Helpers
    const rotationSpeed = rpm / 60; // deg per frame roughly

    return (
        <div className="flex flex-col items-center space-y-6 p-8 bg-slate-900 border-4 border-slate-700 rounded-xl shadow-2xl max-w-lg mx-auto select-none font-mono">
            <div className="text-center">
                <h3 className="text-xl text-blue-400 tracking-widest uppercase mb-2">Isotope Centrifuge</h3>
                <p className="text-xs text-slate-400 h-4">{message}</p>
            </div>

            {/* Centrifuge Visual */}
            <div className="relative w-64 h-64 bg-slate-800 rounded-full border-8 border-slate-600 shadow-inner flex items-center justify-center overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#475569_1px,_transparent_1px)] bg-[length:10px_10px]"></div>

                {/* Rotor */}
                <div
                    className="relative w-48 h-48 transition-transform duration-75 ease-linear"
                    style={{
                        animation: `spin ${Math.max(0.1, 6000 / (rpm + 1))}s linear infinite`
                    }}
                >
                    {/* Center Hub */}
                    <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-slate-500 rounded-full -translate-x-1/2 -translate-y-1/2 border-4 border-slate-400 z-10 shadow-lg"></div>

                    {/* Arms holding test tubes */}
                    {[0, 90, 180, 270].map((deg) => (
                        <div
                            key={deg}
                            className="absolute top-1/2 left-1/2 w-full h-8 -translate-y-1/2 -translate-x-1/2 flex justify-between items-center px-2"
                            style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
                        >
                            <div className={`w-12 h-4 rounded-full border border-slate-900 transition-colors ${progress > 50 ? 'bg-green-400' : 'bg-blue-500'}`}></div>
                            <div className={`w-12 h-4 rounded-full border border-slate-900 transition-colors ${progress > 50 ? 'bg-green-400' : 'bg-blue-500'}`}></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RPM Gauge */}
            <div className="w-full max-w-xs space-y-1">
                <div className="flex justify-between text-xs text-slate-500 font-bold">
                    <span>0 RPM</span>
                    <span>{MAX_RPM} RPM</span>
                </div>
                <div className="h-6 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700">
                    {/* Target Zone */}
                    <div
                        className="absolute top-0 bottom-0 bg-green-900/50 border-x border-green-500/50"
                        style={{
                            left: `${(TARGET_RPM_MIN / MAX_RPM) * 100}%`,
                            width: `${((TARGET_RPM_MAX - TARGET_RPM_MIN) / MAX_RPM) * 100}%`
                        }}
                    ></div>

                    {/* Needle/Bar */}
                    <div
                        className={`h-full transition-all duration-100 ease-out border-r-2 border-white ${rpm >= TARGET_RPM_MIN && rpm <= TARGET_RPM_MAX ? 'bg-green-500' : 'bg-amber-600'}`}
                        style={{ width: `${(rpm / MAX_RPM) * 100}%` }}
                    ></div>
                </div>
                <div className="text-center font-bold text-lg text-white">{Math.round(rpm)} <span className="text-xs text-slate-500">RPM</span></div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                    <span>SEPARATION PROGRESS</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
                    <div
                        className="h-full bg-blue-500 transition-all duration-200"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchEnd={handleMouseUp}
                    className={`
                        w-32 h-32 rounded-full border-8 font-bold text-xl uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95 transition-all select-none
                        ${isSpinning ? 'bg-red-600 border-red-800 text-white shadow-red-500/50' : 'bg-blue-600 border-blue-800 text-white'}
                    `}
                >
                    {isSpinning ? 'SPINNING' : 'HOLD'}
                </button>
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
