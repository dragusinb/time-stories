import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';
import { RefreshCw, RotateCw, Sparkles, Flame, CheckCircle2, Zap } from 'lucide-react';

interface LensCraftingGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

const STAGES = [
    { name: 'Rough Grind', target: 30, blur: 10 },
    { name: 'Fine Grind', target: 70, blur: 4 },
    { name: 'Polishing', target: 100, blur: 0 }
];

const LensCraftingGame: React.FC<LensCraftingGameProps> = ({ minigame, onComplete, theme = 'medieval' }) => {
    // Physics State
    const [rpm, setRpm] = useState(0); // 0-120
    const [heat, setHeat] = useState(0); // 0-100
    const [progress, setProgress] = useState(0); // 0-100 (Total)

    // Game State
    const [isCracked, setIsCracked] = useState(false);
    const [stageIndex, setStageIndex] = useState(0);

    // Refs for animation loop
    const requestRef = useRef<number | null>(null);
    const wheelRef = useRef<HTMLDivElement>(null);
    const heatRef = useRef(0);
    const rpmRef = useRef(0);
    const progressRef = useRef(0);

    // Constants
    const FRICTION = 0.15;
    const PEDAL_POWER = 25;
    const OVERHEAT_THRESH = 95;
    const SWEET_SPOT_MIN = 60;
    const SWEET_SPOT_MAX = 90;
    const GRIND_SPEED = 0.05;
    const COOLING_RATE = 1.0;
    const HEATING_RATE = 0.5;

    const isApollo = theme === 'apollo';
    const isAncient = theme === 'ancient';

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

    const handlePedal = () => {
        if (isCracked) return;
        rpmRef.current = Math.min(130, rpmRef.current + PEDAL_POWER);
    };

    const handleReset = () => {
        setIsCracked(false);
        setRpm(0);
        setHeat(0);
        // Reset to beginning of current stage
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

    const displayBlur = Math.max(0, currentBlur);

    // Theme Styles
    const containerClasses = isApollo
        ? "bg-black border-green-900 text-green-500 font-mono shadow-[0_0_20px_rgba(34,197,94,0.2)]"
        : "bg-[#1a110d] border-[#8b5a2b] text-[#e6ccb2] font-serif";

    const wheelClasses = isApollo
        ? "border-green-800 bg-black/50"
        : "border-[#5e4026] bg-[#2a1d15]";

    const sweetSpotColor = isApollo ? "bg-green-500/30" : "bg-amber-500/30";
    const gaugeBg = isApollo ? "bg-green-950 border-green-800" : "bg-[#2a1d15] border-[#5e4026]";
    const buttonClasses = isApollo
        ? "bg-green-900 text-green-100 border-green-700 hover:bg-green-800"
        : "bg-[#8b5a2b] text-[#e6ccb2] border-[#5e4026] hover:bg-[#a06b35]";

    return (
        <div className={`flex flex-col items-center space-y-6 p-6 border-4 shadow-xl max-w-lg mx-auto select-none transition-all duration-300 ${containerClasses}`}>
            {/* Header */}
            <div className="text-center w-full flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider">{minigame.question}</h3>
                    <p className={`text-xs mt-1 ${isApollo ? 'text-green-700' : 'text-[#8b5a2b]'}`}>{minigame.instructions}</p>
                </div>
                <div className="text-right">
                    <div className={`text-sm font-bold ${isApollo ? 'text-green-400' : 'text-amber-500'}`}>{STAGES[stageIndex].name}</div>
                    <div className={`text-xs ${isApollo ? 'text-green-800' : 'text-[#8b5a2b]'}`}>{Math.floor(progress)}%</div>
                </div>
            </div>

            {/* Main Game Area */}
            <div className={`relative w-full h-64 border-4 rounded-lg overflow-hidden flex items-center justify-center ${isApollo ? 'bg-black border-green-900' : 'bg-[#0f0a08] border-[#2a1d15]'}`}>

                {/* 1. The Lens (Target) */}
                <div className={`relative z-10 w-32 h-32 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-2xl
                    ${isApollo ? 'border-green-600 bg-green-900/20 shadow-green-900/50' : 'border-[#e6ccb2] bg-[#e6ccb2]/10 shadow-[#e6ccb2]/20'}
                `}>
                    {/* Interior Image/Effect */}
                    {isApollo ? (
                        <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)]">
                            {Array.from({ length: 400 }).map((_, i) => (
                                <div key={i} className={`border-[0.5px] border-green-500/20 ${Math.random() > 0.9 ? 'bg-green-500/30' : ''}`}
                                    style={{ filter: `blur(${displayBlur}px)` }}></div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className="absolute inset-0 bg-[url('/images/minigames/magnifier.png')] bg-cover bg-center opacity-80"
                            style={{ filter: `blur(${displayBlur}px) sepia(0.8)` }}
                        />
                    )}

                    {/* Gloss/Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full" />

                    {/* Cracked Overlay */}
                    {isCracked && (
                        <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center z-50 animate-pulse">
                            <span className="text-red-500 font-bold text-2xl -rotate-12 border-4 border-red-500 p-2 uppercase">
                                {isApollo ? 'CRITICAL FAILURE' : 'CRACKED'}
                            </span>
                        </div>
                    )}
                </div>

                {/* 2. The Grinding Wheel */}
                <div
                    ref={wheelRef}
                    className={`absolute -bottom-32 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full border-8 border-dashed z-0 ${wheelClasses}`}
                    style={{ transition: 'transform 0.05s linear' }}
                >
                    <div className={`absolute inset-0 rounded-full border-4 opacity-20 animate-spin-slow ${isApollo ? 'border-green-500' : 'border-[#e6ccb2]'}`}></div>
                </div>

                {/* 3. Spirits/Sparks */}
                {rpm > SWEET_SPOT_MIN && !isCracked && (
                    <div className="absolute bottom-10 left-1/2 ml-10 z-20">
                        {isApollo ? (
                            <Zap className="w-8 h-8 text-green-400 animate-pulse" />
                        ) : (
                            <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                        )}
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
                    <div className={`flex justify-between text-xs font-mono uppercase ${isApollo ? 'text-green-700' : 'text-[#8b5a2b]'}`}>
                        <span>{isApollo ? 'Rotation' : 'Speed'}</span>
                        <span>{Math.floor(rpm)}</span>
                    </div>
                    <div className={`h-4 rounded-full overflow-hidden border relative ${gaugeBg}`}>
                        <div
                            className={`h-full transition-all duration-75 ${rpm > OVERHEAT_THRESH ? 'bg-red-500' : rpm > SWEET_SPOT_MIN ? (isApollo ? 'bg-green-500' : 'bg-amber-500') : (isApollo ? 'bg-green-900' : 'bg-[#5e4026]')}`}
                            style={{ width: `${(rpm / 120) * 100}%` }}
                        />
                        {/* Sweet Spot Markers */}
                        <div className={`absolute top-0 bottom-0 ${sweetSpotColor}`} style={{ left: `${(SWEET_SPOT_MIN / 120) * 100}%`, width: `${((SWEET_SPOT_MAX - SWEET_SPOT_MIN) / 120) * 100}%` }}></div>
                    </div>
                </div>

                {/* Heat Gauge */}
                <div className="space-y-1">
                    <div className={`flex justify-between text-xs font-mono uppercase ${isApollo ? 'text-green-700' : 'text-[#8b5a2b]'}`}>
                        <span>{isApollo ? 'Temp' : 'Heat'}</span>
                        <span className={heat > 80 ? 'text-red-500 animate-pulse' : ''}>{Math.floor(heat)}%</span>
                    </div>
                    <div className={`h-4 rounded-full overflow-hidden border ${gaugeBg}`}>
                        <div
                            className={`h-full transition-all duration-200 ${heat > 80 ? 'bg-red-600' : (isApollo ? 'bg-green-700' : 'bg-orange-700')}`}
                            style={{ width: `${heat}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Controls */}
            {isCracked ? (
                <div className="w-full text-center space-y-4">
                    <p className="text-red-400 text-sm">{isApollo ? 'STRUCTURE COMPROMISED' : 'The lens is ruined!'}</p>
                    <Button onClick={handleReset} className={`w-full ${buttonClasses}`}>
                        <RefreshCw className="mr-2 w-4 h-4" /> {isApollo ? 'RESET SYSTEM' : 'Try Again'}
                    </Button>
                </div>
            ) : (
                <div className="w-full space-y-2">
                    <Button
                        onClick={handlePedal}
                        className={`w-full h-20 text-xl tracking-widest border-b-8 active:border-b-0 active:translate-y-2 transition-all ${buttonClasses}`}
                    >
                        <div className="flex flex-col items-center">
                            <RotateCw className={`w-6 h-6 mb-1 ${rpm > 0 ? 'animate-spin' : ''}`} />
                            {isApollo ? 'ENGAGE MOTOR' : 'SPIN WHEEL'}
                        </div>
                    </Button>
                    <p className={`text-center text-xs font-mono ${isApollo ? 'text-green-800' : 'text-[#8b5a2b]'}`}>
                        {isApollo ? 'MAINTAIN OPTIMAL RPM.' : 'Keep logic in the sweet spot.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default LensCraftingGame;
