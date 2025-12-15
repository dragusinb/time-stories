import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';
import { Sparkles, Crosshair } from 'lucide-react';

interface ConstellationGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

const ConstellationGame: React.FC<ConstellationGameProps> = ({ minigame, onComplete, theme = 'medieval' }) => {
    const [connected, setConnected] = useState<number[]>([]);
    const [message, setMessage] = useState(theme === 'apollo' ? "ALIGNING DOCKING VECTORS..." : "LINK NAVIGATION STARS");
    const [shaking, setShaking] = useState(false);

    const isApollo = theme === 'apollo';

    // Stars positions (percentage)
    const stars = [
        { id: 0, x: 20, y: 80, name: isApollo ? "PORT_A" : "ALPHA" },
        { id: 1, x: 40, y: 60, name: isApollo ? "VECTOR_1" : "BETA" },
        { id: 2, x: 50, y: 30, name: isApollo ? "GUIDANCE" : "GAMMA" },
        { id: 3, x: 70, y: 40, name: isApollo ? "VECTOR_2" : "DELTA" },
        { id: 4, x: 80, y: 70, name: isApollo ? "PORT_B" : "EPSILON" }
    ];

    // Correct path: 0 -> 1 -> 2 -> 3 -> 4
    const handleStarClick = (id: number) => {
        if (connected.includes(id)) return;

        // Must connect in order
        if (id === connected.length) {
            const newConnected = [...connected, id];
            setConnected(newConnected);

            if (newConnected.length === stars.length) {
                setMessage(isApollo ? "HARD DOCK CONFIRMED." : "TRAJECTORY LOCKED. GUIDANCE ACTIVE.");
                setTimeout(() => onComplete(100), 1500);
            }
        } else {
            setShaking(true);
            setMessage(isApollo ? "ALIGNMENT ERROR. RESET." : "INVALID CONNECTION. RETRY.");
            setTimeout(() => {
                setShaking(false);
                setMessage(isApollo ? "ALIGNING DOCKING VECTORS..." : "LINK NAVIGATION STARS");
            }, 600);
        }
    };

    return (
        <div className={`flex flex-col items-center space-y-6 p-4 md:p-8 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] font-pixel 
            ${isApollo ? 'bg-black border-green-900' : 'bg-slate-950 border-slate-800'}`}>
            <div className="text-center w-full">
                <div className="flex items-center justify-center gap-2 mb-2">
                    {isApollo ? <Crosshair className="w-5 h-5 text-green-500 animate-spin-slow" /> : <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />}
                    <h3 className={`text-xl tracking-[0.25em] uppercase glow-text ${isApollo ? 'text-green-500 font-mono' : 'text-amber-500'}`}>{minigame.question}</h3>
                </div>
                <div className={`h-px w-full mb-4 ${isApollo ? 'bg-green-900' : 'bg-gradient-to-r from-transparent via-amber-900/50 to-transparent'}`}></div>
                <p className={`text-xs uppercase tracking-widest font-mono ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>{minigame.instructions}</p>
            </div>

            {/* Viewport */}
            <div className={`relative w-64 h-64 md:w-80 md:h-80 overflow-hidden border-[6px] shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] transition-transform duration-100 
                ${shaking ? 'translate-x-1' : ''}
                ${isApollo ? 'rounded-none border-green-800 bg-black' : 'rounded-full border-slate-700 bg-[radial-gradient(circle_at_center,#1e293b_0%,#020617_100%)]'}`}>

                {/* Space Background */}
                {!isApollo && (
                    <div className="absolute inset-0">
                        {/* Distant Stars */}
                        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '50px 50px', backgroundPosition: '25px 25px' }}></div>
                    </div>
                )}

                {/* Apollo Grid */}
                {isApollo && (
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,50,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,50,0,0.2)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                )}

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {connected.map((starId, idx) => {
                        if (idx === 0) return null;
                        const prevStar = stars[connected[idx - 1]];
                        const currStar = stars[starId];
                        return (
                            <line
                                key={idx}
                                x1={`${prevStar.x}%`}
                                y1={`${prevStar.y}%`}
                                x2={`${currStar.x}%`}
                                y2={`${currStar.y}%`}
                                stroke={isApollo ? "#22c55e" : "#fbbf24"}
                                strokeWidth={isApollo ? "1" : "2"}
                                filter="url(#glow)"
                                className="animate-in fade-in duration-500"
                            />
                        );
                    })}
                    {/* Projected Next Line (dashed) */}
                    {connected.length > 0 && connected.length < stars.length && (
                        <line
                            x1={`${stars[connected[connected.length - 1]].x}%`}
                            y1={`${stars[connected[connected.length - 1]].y}%`}
                            x2={`${stars[connected.length].x}%`}
                            y2={`${stars[connected.length].y}%`}
                            stroke={isApollo ? "rgba(34, 197, 94, 0.3)" : "rgba(251, 191, 36, 0.2)"}
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    )}
                </svg>

                {/* Stars/Targets */}
                {stars.map((star) => (
                    <div key={star.id} className="absolute z-20" style={{ left: `${star.x}%`, top: `${star.y}%`, transform: 'translate(-50%, -50%)' }}>
                        <button
                            onClick={() => handleStarClick(star.id)}
                            className={`group relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
                                ${connected.includes(star.id) ? 'scale-110' : 'hover:scale-125 hover:bg-white/10'}
                            `}
                        >
                            {/* Icon */}
                            {isApollo ? (
                                <div className={`w-4 h-4 border transition-colors duration-300 ${connected.includes(star.id) ? 'bg-green-500 border-green-400' : 'border-green-700 bg-black'}`}></div>
                            ) : (
                                <div className={`w-3 h-3 rotate-45 transition-colors duration-300 ${connected.includes(star.id) ? 'bg-amber-400 shadow-[0_0_15px_#fbbf24]' : 'bg-slate-500 group-hover:bg-slate-300'}`}></div>
                            )}

                            {/* Target Reticle (Only on next target) */}
                            {connected.length === star.id && (
                                <div className={`absolute inset-0 border max-w-[200%] max-h-[200%] rounded-full animate-ping opacity-75 ${isApollo ? 'border-green-500' : 'border-green-400'}`}></div>
                            )}
                        </button>
                        {/* Label */}
                        <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[8px] font-mono tracking-wider transition-opacity duration-300
                            ${connected.includes(star.id) || connected.length === star.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                            ${isApollo ? 'text-green-500' : 'text-slate-600'}`}>
                            {star.name}
                        </div>
                    </div>
                ))}
            </div>

            <div className={`h-8 font-mono text-sm tracking-widest uppercase transition-colors duration-200
                ${shaking ? 'text-red-500' : connected.length === stars.length ? (isApollo ? 'text-green-500' : 'text-green-400') : (isApollo ? 'text-green-700' : 'text-amber-500')}`}>
                {message}
            </div>
        </div>
    );
};

export default ConstellationGame;
