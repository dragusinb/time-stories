import React, { useState, useEffect } from 'react';
import { Minigame } from '@/types';
import { Button } from '@/components/ui/Button';

interface MirrorGameProps {
    minigame: Minigame;
    onComplete: (success: boolean) => void;
}

export const MirrorGame: React.FC<MirrorGameProps> = ({ minigame, onComplete }) => {
    // 3 Mirrors, angles in degrees
    const [angles, setAngles] = useState([0, 0, 0]);
    const [beamPath, setBeamPath] = useState<string>("");
    const [hitTarget, setHitTarget] = useState(false);
    const [message, setMessage] = useState("Align the mirrors to focus the beam.");

    // Target angle requirements (simplified)
    // Mirror 1 needs to be ~45
    // Mirror 2 needs to be ~135
    // Mirror 3 needs to be ~90
    const targetAngles = [45, 135, 90];
    const tolerance = 15;

    useEffect(() => {
        // Check alignment
        const isAligned = angles.every((angle, i) => Math.abs(angle - targetAngles[i]) < tolerance);

        if (isAligned) {
            setHitTarget(true);
            setMessage("Target Locked! Burning...");
            setTimeout(() => onComplete(true), 2000);
        } else {
            setHitTarget(false);
        }
    }, [angles, onComplete]);

    const rotateMirror = (index: number) => {
        if (hitTarget) return;
        setAngles(prev => {
            const newAngles = [...prev];
            newAngles[index] = (newAngles[index] + 45) % 360;
            return newAngles;
        });
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-6 bg-slate-800 rounded-none border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="text-center">
                <h3 className="text-xl font-serif text-amber-500 mb-2 tracking-widest uppercase">{minigame.question}</h3>
                <p className="text-slate-400 text-xs font-mono">{minigame.instructions}</p>
            </div>

            {/* Game Area */}
            <div className="relative w-80 h-64 bg-[#1a1a2e] border-4 border-slate-700 overflow-hidden shadow-inner pixelated">
                {/* Sun Source */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-yellow-400 border-4 border-yellow-200 shadow-[0_0_10px_rgba(250,204,21,0.6)] animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 bg-orange-400 border-2 border-orange-600"></div>
                </div>

                {/* Target Ship */}
                <div className={`absolute bottom-4 right-4 w-16 h-16 transition-all duration-500 ${hitTarget ? 'animate-bounce' : ''}`}>
                    {/* Ship Hull */}
                    <div className="absolute bottom-0 w-full h-8 bg-[#5d4037] border-2 border-black rounded-sm overflow-hidden">
                        <div className="w-full h-2 bg-[#3e2723] top-2 absolute"></div>
                    </div>
                    {/* Sail */}
                    <div className={`absolute top-0 left-4 w-8 h-10 bg-white border-2 border-slate-400 clip-path-triangle transition-colors duration-300 ${hitTarget ? 'bg-red-500 border-red-800' : ''}`}>
                        {hitTarget && <div className="absolute inset-0 bg-yellow-500/50 animate-pulse"></div>}
                    </div>
                    {hitTarget && (
                        <div className="absolute -top-6 left-0 text-[10px] text-red-500 font-bold animate-ping font-pixel">BURNING!</div>
                    )}
                </div>

                {/* Beams (Visual approximation) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" shapeRendering="crispEdges">
                    {/* Beam 1: Sun to Mirror 1 */}
                    <line x1="28" y1="28" x2="80" y2="100" stroke="#facc15" strokeWidth="4" strokeDasharray="8 8" className="animate-dash" opacity="0.8" />

                    {/* Beam 2: Mirror 1 to Mirror 2 (if aligned) */}
                    {Math.abs(angles[0] - 45) < tolerance && (
                        <line x1="80" y1="100" x2="200" y2="100" stroke="#facc15" strokeWidth="4" strokeDasharray="8 8" className="animate-dash" opacity="0.8" />
                    )}

                    {/* Beam 3: Mirror 2 to Mirror 3 (if aligned) */}
                    {Math.abs(angles[0] - 45) < tolerance && Math.abs(angles[1] - 135) < tolerance && (
                        <line x1="200" y1="100" x2="200" y2="200" stroke="#facc15" strokeWidth="4" strokeDasharray="8 8" className="animate-dash" opacity="0.8" />
                    )}

                    {/* Beam 4: Mirror 3 to Target (if aligned) */}
                    {hitTarget && (
                        <line x1="200" y1="200" x2="280" y2="220" stroke="#ef4444" strokeWidth="6" opacity="1" />
                    )}
                </svg>

                {/* Mirrors */}
                {[0, 1, 2].map((i) => {
                    const positions = [
                        { left: '80px', top: '100px' },
                        { left: '200px', top: '100px' },
                        { left: '200px', top: '200px' }
                    ];
                    return (
                        <div
                            key={i}
                            className="absolute w-12 h-2 bg-blue-300 border-2 border-white cursor-pointer hover:brightness-125 transition-transform shadow-sm group"
                            style={{
                                left: positions[i].left,
                                top: positions[i].top,
                                transform: `translate(-50%, -50%) rotate(${angles[i]}deg)`
                            }}
                            onClick={() => rotateMirror(i)}
                        >
                            {/* Reflection sheen */}
                            <div className="absolute top-0 left-0 w-1/2 h-full bg-white/50"></div>
                            {/* Pivot */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-700 rounded-full border border-slate-500 -z-10"></div>
                        </div>
                    );
                })}
            </div>

            <div className={`h-8 font-bold font-mono text-sm ${hitTarget ? 'text-red-500 animate-pulse' : 'text-amber-400'}`}>
                {message}
            </div>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Click mirrors to rotate • Align the beam</div>
        </div>
    );
};
