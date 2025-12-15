import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Minigame } from '@/types';

interface SiloGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

const SiloGame: React.FC<SiloGameProps> = ({ minigame, onComplete, theme = 'medieval' }) => {
    const [fillLevel, setFillLevel] = useState(0); // 0 to 100
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState("ADJUST REGULATOR TO 75%");

    // Target: 75% fill
    const targetFill = 75;
    const tolerance = 5;

    const handleSubmit = () => {
        setSubmitted(true);
        const diff = Math.abs(fillLevel - targetFill);

        if (diff <= tolerance) {
            setMessage("OPTIMAL PRESSURE ACHIEVED.");
            setTimeout(() => onComplete(100), 1500);
        } else {
            setMessage(`WARNING: PRESSURE DEVIATION ${diff}%.`);
            setTimeout(() => {
                setSubmitted(false);
                setMessage("RECALIBRATE IMMEDIATELY.");
            }, 2000);
        }
    };

    const isApollo = theme === 'apollo';

    return (
        <div className={`flex flex-col items-center space-y-8 p-4 md:p-8 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] font-pixel transition-colors
            ${isApollo ? 'bg-black border-green-900 text-green-500' : 'bg-slate-900 border-slate-700 text-amber-500'}
        `}>
            <div className="text-center">
                <h3 className={`text-2xl mb-2 tracking-[0.2em] uppercase text-white ${isApollo ? 'shadow-green-500/20' : 'shadow-amber-500/20'}`}>{minigame.question}</h3>
                <p className={`text-xs font-mono p-2 rounded border inline-block ${isApollo ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-slate-950/50 border-slate-800 text-slate-400'}`}>
                    INSTR: {minigame.instructions}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-end">
                {/* Silo Visual */}
                <div className={`relative w-40 h-80 border-x-4 border-b-4 bg-slate-950 flex items-end shadow-inner overflow-hidden ${isApollo ? 'border-green-800' : 'border-slate-600'}`}>
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                    {/* Target Zone */}
                    <div className="absolute w-full bg-green-500/20 border-y-2 border-green-500/50 pointer-events-none z-10"
                        style={{ bottom: `${targetFill - tolerance}%`, height: `${tolerance * 2}%` }}>
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-green-400 font-mono">TARGET</div>
                    </div>

                    {/* Liquid / Fuel */}
                    <div
                        className={`w-full transition-all duration-500 ease-out border-t-4 relative ${isApollo ? 'bg-white/90 border-white' : 'bg-amber-600/90 border-amber-400'}`}
                        style={{ height: `${fillLevel}%` }}
                    >
                        {/* Bubbles / Texture */}
                        <div className={`absolute inset-0 animate-pulse opacity-30 bg-[size:8px_8px] ${isApollo ? 'bg-[radial-gradient(circle,_#00ff00_1px,_transparent_1px)]' : 'bg-[radial-gradient(circle,_#fbbf24_1px,_transparent_1px)]'}`}></div>
                        <div className={`absolute top-0 w-full h-2 opacity-50 ${isApollo ? 'bg-green-200' : 'bg-amber-300'}`}></div>
                    </div>

                    {/* Ruler Markings */}
                    {[25, 50, 75].map(mark => (
                        <div key={mark} className="absolute right-0 w-3 h-1 bg-slate-500 z-20" style={{ bottom: `${mark}%` }}>
                            <span className="absolute right-4 -top-2 text-[10px] text-slate-500 font-mono">{mark}</span>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center space-y-6 h-80 justify-center">
                    <div className="h-64 flex items-center bg-slate-800/50 p-4 rounded-full border border-slate-700">
                        <Slider
                            value={[fillLevel]}
                            onValueChange={(vals) => !submitted && setFillLevel(vals[0])}
                            max={100}
                            step={1}
                            className="w-64 -rotate-90 pixel-slider"
                        />
                    </div>
                    <div className={`font-mono text-3xl px-3 py-1 border rounded ${isApollo ? 'text-green-400 bg-green-900/20 border-green-500' : 'text-amber-400 bg-black/40 border-amber-500/30'}`}>
                        {fillLevel}%
                    </div>
                </div>
            </div>

            <div className={`h-12 flex items-center justify-center font-bold font-mono text-sm tracking-wider uppercase transition-colors duration-300
                ${submitted
                    ? (Math.abs(fillLevel - targetFill) <= tolerance ? 'text-green-400 animate-pulse' : 'text-red-400 animate-pulse')
                    : 'text-amber-500/80'}`}>
                {message}
            </div>

            <Button
                onClick={handleSubmit}
                disabled={submitted}
                className={`
                    w-full py-6 text-xl tracking-[0.25em] transition-all
                    ${submitted
                        ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                        : isApollo
                            ? 'bg-green-700 hover:bg-green-600 text-black border-b-4 border-green-900'
                            : 'bg-amber-600 hover:bg-amber-500 text-black border-b-4 border-amber-800 active:border-b-0 active:translate-y-1'
                    }
                `}
            >
                {submitted ? 'PROCESSING...' : 'ENGAGE'}
            </Button>
        </div>
    );
};

export default SiloGame;
