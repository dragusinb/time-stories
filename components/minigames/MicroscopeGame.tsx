'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Microscope, Scan, CheckCircle, AlertTriangle } from 'lucide-react';

interface MicroscopeGameProps {
    question: string;
    instructions?: string;
    winningCondition?: string;
    targetName: string; // e.g., "Yersinia pestis"
    onComplete: (success: boolean) => void;
}

export function MicroscopeGame({ question, instructions, winningCondition, targetName, onComplete }: MicroscopeGameProps) {
    const [focus, setFocus] = useState(0); // 0 to 100
    const [magnification, setMagnification] = useState(1); // 1x, 2x, 4x
    const [foundTarget, setFoundTarget] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);

    // Target "sweet spot" for focus is around 75-85
    const optimalFocus = 80;
    const focusTolerance = 10;

    const isFocused = Math.abs(focus - optimalFocus) < focusTolerance;

    const handleScan = () => {
        setIsScanning(true);
        setScanProgress(0);

        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5;
            });
        }, 50);

        setTimeout(() => {
            setIsScanning(false);
            if (isFocused && magnification === 4) {
                setFoundTarget(true);
                setTimeout(() => onComplete(true), 2500);
            } else {
                setScanProgress(0); // Reset if failed
            }
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 font-pixel">
            <div className="pixel-card p-4 md:p-8 mb-8 text-center border-amber-500/30">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <Microscope className="w-12 h-12 text-amber-500" />
                    <h3 className="text-2xl text-amber-500 uppercase tracking-widest">Microscope Analysis</h3>
                </div>
                <p className="text-slate-400 text-sm mb-2">{question}</p>
                {instructions && <p className="text-xs text-slate-500 mb-1">INSTR: {instructions}</p>}
                {winningCondition && <p className="text-xs text-slate-500">GOAL: {winningCondition}</p>}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="pixel-card p-4 md:p-6 flex flex-col gap-8 bg-slate-900 shadow-xl">
                    <div>
                        <label className="block text-xs text-amber-500 mb-3 uppercase tracking-wider font-bold">Magnification Level</label>
                        <div className="flex gap-2 p-1 bg-slate-950 rounded border border-slate-700">
                            {[1, 2, 4].map((mag) => (
                                <button
                                    key={mag}
                                    onClick={() => setMagnification(mag)}
                                    className={`flex-1 py-3 text-xs border-2 transition-all font-bold ${magnification === mag
                                        ? 'border-amber-500 bg-amber-500 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                                        : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                                        }`}
                                >
                                    {mag}00x
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-amber-500 mb-3 uppercase tracking-wider font-bold">Focus Adjustment</label>
                        <div className="relative h-12 flex items-center bg-slate-950 rounded px-4 border border-slate-700">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={focus}
                                onChange={(e) => setFocus(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 outline-none"
                            />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono uppercase">
                            <span>Coarse</span>
                            <span>{focus}%</span>
                            <span>Fine</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-slate-800">
                        <button
                            onClick={handleScan}
                            disabled={foundTarget || isScanning}
                            className={`w-full py-4 text-sm uppercase tracking-wider border-4 transition-all flex items-center justify-center gap-2 font-bold ${foundTarget
                                ? 'border-green-500 bg-green-500/20 text-green-500'
                                : isScanning
                                    ? 'border-amber-500 bg-amber-500/10 text-amber-500 animate-pulse'
                                    : 'border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:border-slate-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none'
                                }`}
                        >
                            {foundTarget ? (
                                <>
                                    <CheckCircle className="w-4 h-4" /> Match Confirmed
                                </>
                            ) : isScanning ? (
                                <>
                                    <Scan className="w-4 h-4 animate-spin" /> Scanning...
                                </>
                            ) : (
                                <>
                                    <Scan className="w-4 h-4" /> Analyze Sample
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Viewport */}
                <div className="md:col-span-2 pixel-card p-1 relative aspect-square md:aspect-video bg-black overflow-hidden flex items-center justify-center border-[6px] border-slate-800 shadow-2xl">
                    {/* Lens Decoration */}
                    <div className="absolute inset-0 border-[20px] border-black/80 rounded-[10%] pointer-events-none z-30 shadow-[inset_0_0_50px_rgba(0,0,0,1)]"></div>

                    {/* Grid Overlay */}
                    <div className="absolute inset-0 z-20 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.3) 1px, transparent 1px)',
                            backgroundSize: '80px 80px',
                            backgroundPosition: 'center'
                        }}
                    >
                        {/* Center Crosshair */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-green-500/50"></div>
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-green-500/20"></div>
                        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-green-500/20"></div>
                    </div>

                    {/* Vignette */}
                    <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.9)_100%)]" />

                    {/* Scan Line Effect */}
                    {isScanning && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50 z-20 shadow-[0_0_15px_#22c55e] animate-[scan_1.5s_linear_infinite]"></div>
                    )}

                    {/* The Sample (Abstract CSS Art for Bacteria) */}
                    <div
                        className="relative transition-all duration-500 ease-out w-full h-full flex items-center justify-center"
                        style={{
                            transform: `scale(${magnification})`,
                            filter: `blur(${Math.abs(focus - optimalFocus) / 5}px) brightness(${100 - Math.abs(focus - optimalFocus) / 3}%) contrast(${1 + (focus / 100) * 0.5})`,
                            opacity: 0.8 + (focus / 500)
                        }}
                    >
                        {/* Background Tissue */}
                        <div className="w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[100px] absolute pointer-events-none" />
                        <div className="w-[400px] h-[400px] bg-amber-900/10 rounded-full blur-[80px] absolute -top-20 -left-20 pointer-events-none" />

                        {/* Bacteria Clusters */}
                        <div className="relative w-[300px] h-[300px] animate-pulse-slow">
                            {/* Bacteria 1 */}
                            <div className="absolute top-10 left-10 w-12 h-4 bg-green-600/40 rounded-full rotate-45 border border-green-500/20"></div>
                            {/* Bacteria 2 */}
                            <div className="absolute bottom-20 right-10 w-16 h-5 bg-green-600/40 rounded-full -rotate-12 border border-green-500/20"></div>

                            {/* Target Bacteria Cluster */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 flex items-center justify-center">
                                <div className="absolute w-14 h-5 bg-green-500/80 rounded-full rotate-45 shadow-[0_0_15px_rgba(34,197,94,0.4)] border border-green-400/50"></div>
                                <div className="absolute w-10 h-4 bg-green-500/80 rounded-full -rotate-12 translate-x-6 translate-y-2 shadow-[0_0_15px_rgba(34,197,94,0.4)] border border-green-400/50"></div>
                                <div className="absolute w-12 h-5 bg-green-500/80 rounded-full rotate-90 -translate-x-4 translate-y-2 shadow-[0_0_15px_rgba(34,197,94,0.4)] border border-green-400/50"></div>
                            </div>
                        </div>
                    </div>

                    {/* Status Text Overlay */}
                    <div className="absolute bottom-6 left-6 z-40 font-mono text-xs text-green-500 bg-black/80 p-2 border border-green-900/50 backdrop-blur-sm rounded">
                        <div className="flex flex-col gap-1">
                            <span className="opacity-70">MAGNIFICATION: <span className="text-green-400 font-bold">{magnification}00x</span></span>
                            <span className="opacity-70">FOCAL_PLANE: <span className={`font-bold ${isFocused ? 'text-green-400' : 'text-red-400'}`}>{focus >= 100 ? 100 : focus.toString().padStart(3, '0')}%</span></span>
                            <span className="opacity-70">STATUS: <span className="animate-pulse">{foundTarget ? 'MATCH_CONFIRMED' : isScanning ? 'SCANNING...' : 'STANDBY'}</span></span>
                        </div>
                    </div>

                    {/* Target Indicator (Only visible when found) */}
                    {foundTarget && (
                        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                            <div className="w-64 h-64 border-4 border-red-500 rounded-full animate-[ping_1.5s_ease-out_infinite] opacity-50"></div>
                            <div className="absolute w-72 h-72 border border-red-500/50 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full -mt-20 bg-red-500 text-black font-bold px-2 py-1 text-xs pixel-box shadow-lg">
                                YERSINIA PESTIS
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {!foundTarget && !isScanning && isFocused && magnification === 4 && (
                <div className="text-center mt-6 text-amber-400 animate-bounce text-xs uppercase tracking-widest font-bold bg-amber-900/20 py-2 border border-amber-500/30 inline-block px-4 rounded-full mx-auto block w-fit">
                    <AlertTriangle className="w-4 h-4 inline mr-2 -mt-1" />
                    Anomaly Detected - Initiate Scan
                </div>
            )}

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
