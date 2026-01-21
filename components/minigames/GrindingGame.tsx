import React, { useState, useEffect, useRef } from 'react';
import { Minigame } from '@/types';
import { Button } from '@/components/ui/Button';

interface GrindingGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

export const GrindingGame: React.FC<GrindingGameProps> = ({ minigame, onComplete }) => {
    const bowlRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [chunks, setChunks] = useState<{ id: number; x: number; y: number; hp: number }[]>([]);
    const [message, setMessage] = useState("Move mouse in circles to grind. Click chunks to crush.");

    // Spawn initial chunks
    useEffect(() => {
        const initialChunks = Array.from({ length: 5 }).map((_, i) => ({
            id: i,
            x: 30 + Math.random() * 40, // % position
            y: 30 + Math.random() * 40,
            hp: 3
        }));
        setChunks(initialChunks);
    }, []);

    // Track mouse movement for "Grinding"
    const lastPos = useRef({ x: 0, y: 0 });
    const totalDist = useRef(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (progress >= 100) return;

        // Calculate distance moved
        const dist = Math.sqrt(Math.pow(e.clientX - lastPos.current.x, 2) + Math.pow(e.clientY - lastPos.current.y, 2));
        lastPos.current = { x: e.clientX, y: e.clientY };

        // Only count if inside the bowl roughly (could optimize with refs)
        totalDist.current += dist;

        if (totalDist.current > 100) {
            // Add progress based on movement
            setProgress(p => Math.min(100, p + 0.5));
            totalDist.current = 0;

            // Randomly spawn dust/particles (visual only for now)
        }
    };

    const handleChunkClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setChunks(prev => prev.map(c => {
            if (c.id === id) {
                const newHp = c.hp - 1;
                if (newHp <= 0) {
                    setProgress(p => Math.min(100, p + 5)); // Bonus for crushing
                    return { ...c, hp: 0 }; // Will filter out
                }
                return { ...c, hp: newHp };
            }
            return c;
        }).filter(c => c.hp > 0));
    };

    useEffect(() => {
        if (progress >= 100) {
            setMessage("Paste consistency achieved.");
            setTimeout(() => onComplete(100), 1000);
        }
    }, [progress, onComplete]);

    return (
        <div
            className="flex flex-col items-center space-y-6 p-8 bg-stone-900 border-4 border-stone-700 rounded-xl shadow-2xl max-w-lg mx-auto select-none font-serif cursor-none"
            onMouseMove={handleMouseMove}
        >
            <div className="text-center">
                <h3 className="text-xl text-amber-700 font-bold tracking-widest uppercase mb-2">Mortar & Pestle</h3>
                <p className="text-xs text-stone-400 font-mono">{message}</p>
            </div>

            {/* Mortar Bowl */}
            <div
                ref={bowlRef}
                className="relative w-80 h-80 rounded-full bg-stone-800 border-8 border-stone-600 shadow-inner flex items-center justify-center overflow-hidden"
            >
                {/* Texture */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                {/* Ground Paste (Visual Progress) */}
                <div
                    className="absolute w-full h-full bg-green-800/80 rounded-full blur-xl transition-opacity duration-500"
                    style={{ opacity: progress / 100 }}
                ></div>

                {/* Uncrushed Chunks */}
                {chunks.map(chunk => (
                    <div
                        key={chunk.id}
                        className="absolute w-12 h-12 bg-green-900 rounded-full border-2 border-green-700 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-transform shadow-lg"
                        style={{ left: `${chunk.x}%`, top: `${chunk.y}%` }}
                        onClick={(e) => handleChunkClick(e, chunk.id)}
                    >
                        <div className="w-1 h-1 bg-black/20 rounded-full absolute top-2 left-3"></div>
                        <div className="w-2 h-2 bg-black/20 rounded-full absolute bottom-3 right-4"></div>
                    </div>
                ))}

                {/* The Pestle (Follows Mouse visually, but we need custom cursor logic or state) */}
                {/* For simplicity we'll just let the custom cursor exist or use a state-tracked pestle. 
                    Since we have onMouseMove on parent, we can track position relative to bowl? 
                    Actually, CSS cursor is easier for MVP, but physical feedback is better. 
                    Let's put a visual dot.
                */}
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs space-y-1">
                <div className="flex justify-between text-xs text-stone-500 font-bold">
                    <span>Consistency</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-4 bg-stone-800 rounded-full overflow-hidden border border-stone-600">
                    <div
                        className="h-full bg-amber-600 transition-all duration-200"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};
