import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';
import { Search, ZoomIn, ZoomOut } from 'lucide-react';

interface DiagnosisGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

const DiagnosisGame: React.FC<DiagnosisGameProps> = ({ minigame, onComplete, theme = 'medieval' }) => {
    const [focus, setFocus] = useState(0); // 0 to 100, target 50
    const [magnification, setMagnification] = useState(1); // 1x, 2x, 4x
    const [identified, setIdentified] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const targetFocus = 50;
    const tolerance = 10;

    const handleFocus = (delta: number) => {
        setFocus(prev => Math.max(0, Math.min(100, prev + delta)));
        setErrorMessage(null);
    };

    const handleIdentify = () => {
        const focusOk = Math.abs(focus - targetFocus) <= tolerance;
        const magOk = magnification === 4;

        if (focusOk && magOk) {
            setIdentified(true);
            setErrorMessage(null);
            setTimeout(() => onComplete(100), 1500);
        } else {
            // Provide specific feedback
            if (!magOk && !focusOk) {
                setErrorMessage("Increase magnification to 4x and adjust focus");
            } else if (!magOk) {
                setErrorMessage("Magnification too low - set to 4x");
            } else {
                setErrorMessage("Image blurry - adjust focus to center");
            }
            // Clear error after delay
            setTimeout(() => setErrorMessage(null), 3000);
        }
    };

    const blurAmount = Math.abs(focus - targetFocus) / 5;
    const isApollo = theme === 'apollo';

    return (
        <div className={`flex flex-col items-center space-y-6 p-6 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] ${isApollo ? 'bg-black border-green-900 text-green-500' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>
            <div className="text-center">
                <h3 className={`text-xl font-serif mb-2 tracking-widest uppercase ${isApollo ? 'text-green-500 font-mono' : 'text-blue-400'}`}>{minigame.question}</h3>
                <p className={`text-xs ${isApollo ? 'text-green-700 font-mono' : 'text-slate-400 font-mono'}`}>{minigame.instructions}</p>
            </div>

            {/* Viewport */}
            <div className={`relative w-64 h-64 border-8 bg-black overflow-hidden shadow-inner ${isApollo ? 'border-green-800 rounded-none' : 'border-slate-800 rounded-full'}`}>
                {/* Crosshair */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-50 z-10">
                    <div className={`w-full h-0.5 ${isApollo ? 'bg-green-500/50' : 'bg-red-500/50'}`}></div>
                    <div className={`h-full w-0.5 ${isApollo ? 'bg-green-500/50' : 'bg-red-500/50'}`}></div>
                </div>

                {/* Sample */}
                <div
                    className="absolute inset-0 flex items-center justify-center transition-all duration-300 image-pixelated"
                    style={{
                        filter: `blur(${blurAmount}px)`,
                        transform: `scale(${magnification})`
                    }}
                >
                    {/* Visual (Pixelated Style) */}
                    <div className="w-32 h-32 relative opacity-80">
                        {isApollo ? (
                            // Circuit / System blocks for Apollo
                            <>
                                <div className="absolute top-10 left-10 w-16 h-2 bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                                <div className="absolute top-14 left-10 w-2 h-10 bg-green-500"></div>
                                <div className="absolute top-24 left-10 w-8 h-8 border-2 border-green-500"></div>
                                <div className="absolute top-6 left-28 w-4 h-16 bg-green-500 opacity-50"></div>
                                {/* Scanning line effect */}
                                <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                            </>
                        ) : (
                            // Bacteria for Alchemist
                            <>
                                <div className="absolute top-10 left-10 w-8 h-4 bg-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"></div>
                                <div className="absolute top-20 left-20 w-8 h-4 bg-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"></div>
                                <div className="absolute top-15 left-15 w-8 h-4 bg-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] rotate-90"></div>
                                <div className="absolute top-5 left-25 w-8 h-4 bg-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"></div>

                                {/* Specular highlights/details */}
                                <div className="absolute top-11 left-11 w-2 h-2 bg-green-400"></div>
                                <div className="absolute top-21 left-21 w-2 h-2 bg-green-400"></div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className={`flex flex-col gap-4 w-full max-w-xs ${isApollo ? 'font-mono' : ''}`}>
                <div className={`flex justify-between items-center p-2 rounded border ${isApollo ? 'bg-green-900/20 border-green-800' : 'bg-slate-800 border-slate-600'}`}>
                    <span className={`text-xs ${isApollo ? 'text-green-600' : 'text-slate-400'}`}>{isApollo ? 'SIGNAL_GAIN' : 'MAGNIFICATION'}</span>
                    <div className="flex gap-2">
                        {[1, 2, 4].map(m => (
                            <button
                                key={m}
                                onClick={() => { setMagnification(m); setErrorMessage(null); }}
                                className={`px-2 py-1 text-xs font-bold rounded ${magnification === m
                                        ? (isApollo ? 'bg-green-600 text-black' : 'bg-blue-600 text-white')
                                        : (isApollo ? 'bg-black text-green-700 border border-green-900' : 'bg-slate-700 text-slate-400')
                                    }`}
                            >
                                {m}x
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`flex justify-between items-center p-2 rounded border ${isApollo ? 'bg-green-900/20 border-green-800' : 'bg-slate-800 border-slate-600'}`}>
                    <span className={`text-xs ${isApollo ? 'text-green-600' : 'text-slate-400'}`}>{isApollo ? 'CALIBRATION' : 'FOCUS'}</span>
                    <div className="flex gap-2">
                        <Button onClick={() => handleFocus(-10)} size="sm" className={`h-8 w-8 p-0 ${isApollo ? 'bg-green-900 text-green-400 border-green-700 hover:bg-green-800' : ''}`}>-</Button>
                        <div className={`w-24 h-2 rounded-full self-center ${isApollo ? 'bg-black border border-green-900' : 'bg-slate-900'}`}>
                            <div
                                className={`h-full rounded-full transition-all ${isApollo ? 'bg-green-500 shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'bg-blue-500'}`}
                                style={{ width: `${focus}%` }}
                            ></div>
                        </div>
                        <Button onClick={() => handleFocus(10)} size="sm" className={`h-8 w-8 p-0 ${isApollo ? 'bg-green-900 text-green-400 border-green-700 hover:bg-green-800' : ''}`}>+</Button>
                    </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className={`p-2 rounded text-xs font-mono text-center animate-pulse ${isApollo ? 'bg-red-900/30 border border-red-700 text-red-400' : 'bg-red-900/30 border border-red-700 text-red-400'}`}>
                        {errorMessage}
                    </div>
                )}

                <Button
                    onClick={handleIdentify}
                    disabled={identified}
                    className={`w-full py-4 text-sm font-bold tracking-widest uppercase border-b-4 border-r-4 active:border-0 active:translate-y-1 active:translate-x-1 outline-none transition-none
                        ${identified
                            ? (isApollo ? 'bg-green-600 text-black border-green-900' : 'bg-green-600 border-green-800 text-white')
                            : (isApollo ? 'bg-black text-green-500 border-green-700 hover:bg-green-900/20' : 'bg-blue-600 border-blue-800 text-white hover:bg-blue-500')
                        }`}
                >
                    {identified ? (isApollo ? 'SYSTEM VERIFIED' : 'PATHOGEN IDENTIFIED') : (isApollo ? 'RUN DIAGNOSTIC' : 'ANALYZE SAMPLE')}
                </Button>
            </div>
        </div>
    );
};

export default DiagnosisGame;
