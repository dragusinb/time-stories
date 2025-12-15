import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';

interface DisplacementGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

const DisplacementGame: React.FC<DisplacementGameProps> = ({ minigame, onComplete }) => {
    const [waterLevelGold, setWaterLevelGold] = useState(25);
    const [waterLevelCrown, setWaterLevelCrown] = useState(25);
    const [isSubmerged, setIsSubmerged] = useState(false);
    const [decision, setDecision] = useState<string | null>(null);
    const [message, setMessage] = useState("Ready to experiment.");
    const [bubbles, setBubbles] = useState<number[]>([]);

    const handleSubmerge = () => {
        setIsSubmerged(true);
        // Trigger bubbles
        setBubbles([1, 2, 3, 4, 5]);

        // Displacement Physics
        // Gold (Higher Density) = Less Volume = Lower Water Level Rise
        // Crown (Impure/Lower Density) = More Volume = Higher Water Level Rise
        setWaterLevelGold(55);
        setWaterLevelCrown(70);
        setMessage("Observe the water displacement levels.");

        setTimeout(() => setBubbles([]), 2000);
    };

    const handleReset = () => {
        setIsSubmerged(false);
        setWaterLevelGold(25);
        setWaterLevelCrown(25);
        setDecision(null);
        setBubbles([]);
        setMessage("Ready to experiment.");
    };

    const handleDecision = (isPure: boolean) => {
        if (!isSubmerged) {
            setMessage("Action Required: Submerge Items First");
            return;
        }

        if (isPure) {
            setMessage("Incorrect Analysis. Observe the volume displaced.");
            setDecision("pure");
        } else {
            setMessage("EUREKA! The Crown displaces MORE water. It is a fake!");
            setDecision("fake");
            setTimeout(() => onComplete(100), 2000);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-8 bg-slate-900 border-4 border-slate-950 font-pixel relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/20"></div>

            <div className="text-center relative z-10 w-full">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/50 animate-pulse">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                    <h3 className="text-xl text-amber-500 tracking-[0.2em] uppercase">Displacement Lab</h3>
                </div>
                <p className="text-slate-400 text-[10px] font-mono border-y border-slate-800 py-2 inline-block px-4">{minigame.instructions}</p>
            </div>

            <div className="flex gap-12 items-end justify-center h-72 w-full max-w-2xl relative z-10">
                {/* Tank 1: Pure Gold */}
                <div className="flex flex-col items-center space-y-3 group">
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-900/30 px-2 py-0.5 rounded border border-amber-500/30">REFERENCE SAMPLE (1kg)</span>
                    <div className="relative w-32 h-64 border-x-4 border-b-4 border-slate-400 bg-blue-900/10 rounded-b-lg backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                        {/* Measurement Lines */}
                        <div className="absolute right-0 top-0 h-full w-4 flex flex-col justify-between py-4 opacity-50">
                            {[...Array(10)].map((_, i) => <div key={i} className="w-full h-px bg-slate-400"></div>)}
                        </div>

                        {/* Water Body */}
                        <motion.div
                            className="absolute bottom-0 left-0 w-full bg-blue-500/40 border-t-2 border-blue-400 transition-all duration-1000 ease-out"
                            initial={{ height: "25%" }}
                            animate={{ height: `${waterLevelGold}%` }}
                        >
                            <div className="w-full h-2 bg-blue-300/30 absolute top-0 animate-pulse"></div>
                        </motion.div>

                        {/* Object: Gold Bar */}
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 border-2 border-yellow-900 shadow-lg transform-gpu"
                            initial={{ top: "-60px" }}
                            animate={{ top: isSubmerged ? "auto" : "-60px", bottom: isSubmerged ? "20px" : "auto" }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        >
                            <div className="absolute inset-0 border border-yellow-200/50 opacity-50"></div>
                            <div className="text-[8px] text-yellow-900 font-bold text-center leading-8 opacity-70">PURE 24K</div>
                        </motion.div>

                        {/* Bubbles */}
                        {isSubmerged && bubbles.map((b, i) => (
                            <motion.div
                                key={`b1-${i}`}
                                className="absolute bg-white/40 rounded-full w-2 h-2"
                                initial={{ bottom: "20px", left: "50%", opacity: 1, scale: 0 }}
                                animate={{ bottom: "100%", left: `${50 + (Math.random() * 40 - 20)}%`, opacity: 0, scale: 1.5 }}
                                transition={{ duration: 1 + Math.random(), delay: i * 0.1, repeat: Infinity }}
                            />
                        ))}
                    </div>
                    <div className="text-xs font-mono text-blue-300">Level: <span className="font-bold">{waterLevelGold}</span> units</div>
                </div>

                {/* Tank 2: The Crown */}
                <div className="flex flex-col items-center space-y-3 group">
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-900/30 px-2 py-0.5 rounded border border-amber-500/30">SUSPECT OBJECT (1kg)</span>
                    <div className="relative w-32 h-64 border-x-4 border-b-4 border-slate-400 bg-blue-900/10 rounded-b-lg backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                        {/* Measurement Lines */}
                        <div className="absolute right-0 top-0 h-full w-4 flex flex-col justify-between py-4 opacity-50">
                            {[...Array(10)].map((_, i) => <div key={i} className="w-full h-px bg-slate-400"></div>)}
                        </div>

                        {/* Water Body */}
                        <motion.div
                            className="absolute bottom-0 left-0 w-full bg-blue-500/40 border-t-2 border-blue-400 transition-all duration-1000 ease-out"
                            initial={{ height: "25%" }}
                            animate={{ height: `${waterLevelCrown}%` }}
                        >
                            <div className="w-full h-2 bg-blue-300/30 absolute top-0 animate-pulse"></div>
                        </motion.div>

                        {/* Object: The Crown */}
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 w-20 h-14"
                            initial={{ top: "-70px" }}
                            animate={{ top: isSubmerged ? "auto" : "-70px", bottom: isSubmerged ? "20px" : "auto" }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        >
                            {/* Detailed Crown Visual */}
                            <div className="w-full h-full relative group-hover:scale-105 transition-transform">
                                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 border-2 border-yellow-900 rounded-sm"></div>
                                <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-yellow-500 border-x-2 border-t-2 border-yellow-900 skew-x-12 origin-bottom-left"></div>
                                <div className="absolute top-2 left-1/3 w-1/3 h-[calc(50%-8px)] bg-yellow-400 border-x-2 border-t-2 border-yellow-900"></div>
                                <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-yellow-500 border-x-2 border-t-2 border-yellow-900 -skew-x-12 origin-bottom-right"></div>
                                {/* Gemstones */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rotate-45 border border-red-900 shadow-inner"></div>
                            </div>
                        </motion.div>

                        {/* Bubbles */}
                        {isSubmerged && bubbles.map((b, i) => (
                            <motion.div
                                key={`b2-${i}`}
                                className="absolute bg-white/40 rounded-full w-2 h-2"
                                initial={{ bottom: "20px", left: "50%", opacity: 1, scale: 0 }}
                                animate={{ bottom: "100%", left: `${50 + (Math.random() * 40 - 20)}%`, opacity: 0, scale: 1.5 }}
                                transition={{ duration: 0.8 + Math.random(), delay: i * 0.05, repeat: Infinity }}
                            />
                        ))}
                    </div>
                    <div className="text-xs font-mono text-blue-300">Level: <span className="font-bold">{waterLevelCrown}</span> units</div>
                </div>
            </div>

            <div className={`h-8 font-bold font-mono text-xs uppercase tracking-wider transition-colors duration-300 ${decision === 'fake' ? 'text-green-400' : decision === 'pure' ? 'text-red-400' : 'text-amber-400'}`}>
                {message}
            </div>

            <div className="flex gap-4 w-full max-w-lg z-20">
                {!isSubmerged ? (
                    <Button
                        onClick={handleSubmerge}
                        className="w-full pixel-btn-primary py-4 text-sm tracking-widest"
                    >
                        INITIATE EXPERIMENT
                    </Button>
                ) : (
                    <div className="flex gap-4 w-full">
                        {/* Using standard buttons styled as pixel buttons */}
                        <button
                            onClick={() => handleDecision(true)}
                            disabled={decision === 'fake'}
                            className={`flex-1 py-4 border-b-4 text-xs font-bold uppercase tracking-widest transition-all active:translate-y-1 active:border-b-0 ${decision === 'fake' ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500 border-slate-900' : 'bg-slate-700 hover:bg-slate-600 border-slate-950 text-slate-200 shadow-md'}`}
                        >
                            VERDICT: PURE GOLD
                        </button>
                        <button
                            onClick={() => handleDecision(false)}
                            disabled={decision === 'fake'}
                            className={`flex-1 py-4 border-b-4 text-xs font-bold uppercase tracking-widest transition-all active:translate-y-1 active:border-b-0 ${decision === 'fake' ? 'cursor-not-allowed bg-green-600 text-white border-green-900' : 'bg-amber-600 hover:bg-amber-500 border-amber-800 text-amber-100 shadow-md'}`}
                        >
                            VERDICT: IT'S A FAKE!
                        </button>
                    </div>
                )}
            </div>

            {isSubmerged && decision !== 'fake' && (
                <button onClick={handleReset} className="text-[10px] text-slate-500 hover:text-white underline font-mono uppercase tracking-widest mt-2">
                    Reset Experiment Parameters
                </button>
            )}
        </div>
    );
};

export default DisplacementGame;
