import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';
import { RefreshCw, RotateCw, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

interface LensCraftingGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

const STAGES = [
    { name: 'Rough Grind', target: 30, color: 'text-amber-500', blur: 10 },
    { name: 'Fine Grind', target: 70, color: 'text-blue-400', blur: 4 },
    { name: 'Polishing', target: 100, color: 'text-green-400', blur: 0 }
];

const LensCraftingGame: React.FC<LensCraftingGameProps> = ({ minigame, onComplete }) => {
    // Physics State
    const [rpm, setRpm] = useState(0); // 0-120
    const [heat, setHeat] = useState(0); // 0-100
    const [progress, setProgress] = useState(0); // 0-100 (Total)

    // Game State
    const [isCracked, setIsCracked] = useState(false);
    const [stageIndex, setStageIndex] = useState(0);
    const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);

    // Refs for animation loop
    const requestRef = useRef<number | null>(null);
    const wheelRef = useRef<HTMLDivElement>(null);
    const heatRef = useRef(0);
    const rpmRef = useRef(0);
    const progressRef = useRef(0);

    // Constants
    // Constants
    const FRICTION = 0.15;
    const PEDAL_POWER = 25;
    const OVERHEAT_THRESH = 95;
    const SWEET_SPOT_MIN = 60;
    const SWEET_SPOT_MAX = 90;
    const GRIND_SPEED = 0.05;
    const COOLING_RATE = 1.0;
    const HEATING_RATE = 0.5;

    useEffect(() => {
        const animate = () => {
            if (isCracked) return;

            // 1. RPM Physics
            rpmRef.current = Math.max(0, rpmRef.current - FRICTION);
            setRpm(rpmRef.current);

            // 2. Rotate Wheel Visual
            if (wheelRef.current) {
                const currentRot = parseFloat(wheelRef.current.style.transform.replace('rotate(', '').replace('deg)', '') || '0');
                wheelRef.current.style.transform = `rotate(${currentRot + rpmRef.current * 0.5}deg)`;
            }

            // 3. Heat Management
            if (rpmRef.current > OVERHEAT_THRESH) {
                heatRef.current = Math.min(100, heatRef.current + HEATING_RATE);
            } else {
                heatRef.current = Math.max(0, heatRef.current - COOLING_RATE);
            }
            setHeat(heatRef.current);

            if (heatRef.current >= 100) {
                setIsCracked(true);
                return; // Stop loop
            }

            // 4. Progress Logic (Only in Sweet Spot)
            if (rpmRef.current >= SWEET_SPOT_MIN && rpmRef.current <= SWEET_SPOT_MAX) {
                progressRef.current = Math.min(100, progressRef.current + GRIND_SPEED);
                setProgress(progressRef.current);

                // Add Spark
                if (Math.random() > 0.7) {
                    addSpark();
                }
            }

            // 5. Stage Progression
            const currentStage = STAGES[stageIndex];
            if (progressRef.current >= currentStage.target) {
                if (stageIndex < STAGES.length - 1) {
                    setStageIndex(prev => prev + 1);
                } else if (progressRef.current >= 100) {
                    // Win Condition
                    setTimeout(() => onComplete(100), 500);
                    return; // Stop loop
                }
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [isCracked, stageIndex, onComplete]);

    const addSpark = () => {
        const id = Date.now() + Math.random();
        // Random angle spray from the "contact point" (right side of wheel)
        const angle = (Math.random() * 45 - 22.5) * (Math.PI / 180);
        const speed = 5 + Math.random() * 5;

        setSparks(prev => [...prev.slice(-10), { id, x: 0, y: 0 }]); // Simplified spark logic, just trigger render
    };

    const handlePedal = () => {
        if (isCracked) return;
        rpmRef.current = Math.min(130, rpmRef.current + PEDAL_POWER);
    };

    const handleReset = () => {
        setIsCracked(false);
        setRpm(0);
        setHeat(0);
        // Reset to beginning of current stage, not total zero? Or punish fully?
        // Let's punish slightly: back to start of current stage
        const prevTarget = stageIndex > 0 ? STAGES[stageIndex - 1].target : 0;
        progressRef.current = prevTarget;
        setProgress(prevTarget);
        rpmRef.current = 0;
        heatRef.current = 0;
    };

    // Calculate Blur for the Lens
    const currentBlur = STAGES[stageIndex].blur - (
        (progress - (stageIndex > 0 ? STAGES[stageIndex - 1].target : 0)) /
        (STAGES[stageIndex].target - (stageIndex > 0 ? STAGES[stageIndex - 1].target : 0))
    ) * (STAGES[stageIndex].blur - (stageIndex < 2 ? STAGES[stageIndex + 1].blur : 0));

    // Clamp blur
    const displayBlur = Math.max(0, currentBlur);

    return (
        <div className="flex flex-col items-center space-y-6 p-6 bg-slate-900 border-4 border-slate-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] max-w-lg mx-auto select-none">
            {/* Header */}
            <div className="text-center w-full flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-amber-500 uppercase tracking-wider">{minigame.question}</h3>
                    <p className="text-slate-500 text-xs font-mono mt-1">{minigame.instructions}</p>
                </div>
                <div className="text-right">
                    <div className={`text-sm font-bold ${STAGES[stageIndex].color}`}>{STAGES[stageIndex].name}</div>
                    <div className="text-xs text-slate-500">{Math.floor(progress)}%</div>
                </div>
            </div>

            {/* Main Game Area */}
            <div className="relative w-full h-64 bg-slate-950 border-4 border-slate-800 rounded-lg overflow-hidden flex items-center justify-center">

                {/* 1. The Lens (Target) */}
                <div className="relative z-10 w-32 h-32 rounded-full border-4 border-slate-600 bg-slate-900/50 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-2xl">
                    {/* Bacteria Image (Background) */}
                    <div
                        className="absolute inset-0 bg-[url('/images/minigames/magnifier.png')] bg-cover bg-center opacity-80"
                        style={{ filter: `blur(${displayBlur}px)` }}
                    />

                    {/* Gloss/Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full" />

                    {/* Cracked Overlay */}
                    {isCracked && (
                        <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center z-50">
                            <span className="text-red-500 font-bold text-2xl -rotate-12 border-4 border-red-500 p-2">CRACKED</span>
                        </div>
                    )}
                </div>

                {/* 2. The Grinding Wheel */}
                <div
                    ref={wheelRef}
                    className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-slate-800 rounded-full border-8 border-slate-600 border-dashed z-0"
                    style={{ transition: 'transform 0.05s linear' }}
                >
                    <div className="absolute inset-0 rounded-full border-4 border-slate-500 opacity-20 animate-spin-slow"></div>
                </div>

                {/* 3. Spirits/Sparks */}
                {rpm > SWEET_SPOT_MIN && !isCracked && (
                    <div className="absolute bottom-10 left-1/2 ml-10 z-20">
                        <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                    </div>
                )}

                {/* 4. Heat Haze / Warning */}
                {heat > 50 && (
                    <div className="absolute inset-0 pointer-events-none z-30 bg-red-500/10 animate-pulse mix-blend-overlay"></div>
                )}
            </div>

            {/* Gauges */}
            <div className="w-full grid grid-cols-2 gap-4">
                {/* RPM Gauge */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                        <span>RPM</span>
                        <span>{Math.floor(rpm)}</span>
                    </div>
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
                        <div
                            className={`h-full transition-all duration-75 ${rpm > OVERHEAT_THRESH ? 'bg-red-500' : rpm > SWEET_SPOT_MIN ? 'bg-green-500' : 'bg-slate-500'}`}
                            style={{ width: `${(rpm / 120) * 100}%` }}
                        />
                        {/* Sweet Spot Markers */}
                        <div className="absolute top-0 bottom-0 bg-green-500/20" style={{ left: `${(SWEET_SPOT_MIN / 120) * 100}%`, width: `${((SWEET_SPOT_MAX - SWEET_SPOT_MIN) / 120) * 100}%` }}></div>
                    </div>
                </div>

                {/* Heat Gauge */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                        <span>HEAT</span>
                        <span className={heat > 80 ? 'text-red-500 animate-pulse' : ''}>{Math.floor(heat)}%</span>
                    </div>
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                            className={`h-full transition-all duration-200 ${heat > 80 ? 'bg-red-600' : 'bg-amber-600'}`}
                            style={{ width: `${heat}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Controls */}
            {isCracked ? (
                <div className="w-full text-center space-y-4">
                    <p className="text-red-400 text-sm">The lens cracked from overheating!</p>
                    <Button onClick={handleReset} className="w-full bg-slate-700 hover:bg-slate-600 border-slate-500">
                        <RefreshCw className="mr-2 w-4 h-4" /> Try Again
                    </Button>
                </div>
            ) : (
                <div className="w-full space-y-2">
                    <Button
                        onClick={handlePedal}
                        className="w-full h-20 text-xl tracking-widest bg-slate-800 hover:bg-slate-700 border-b-8 border-slate-950 active:border-b-0 active:translate-y-2 transition-all"
                    >
                        <div className="flex flex-col items-center">
                            <RotateCw className={`w-6 h-6 mb-1 ${rpm > 0 ? 'animate-spin' : ''}`} />
                            TAP TO SPIN
                        </div>
                    </Button>
                    <p className="text-center text-xs text-slate-500 font-mono">Keep RPM in the GREEN zone. Avoid RED.</p>
                </div>
            )}
        </div>
    );
};

export default LensCraftingGame;
