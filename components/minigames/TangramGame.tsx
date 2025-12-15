
import React, { useState, useEffect } from 'react';
import { Minigame } from '@/types';
import { Button } from '@/components/ui/Button';
import { Crosshair, Move, RotateCw, CheckCircle2 } from 'lucide-react';

interface TangramGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

// "Ballista Parts" - Blueprint style shapes
const SHAPES = [
    { id: 1, type: 'triangle', color: 'bg-cyan-500/20 border-cyan-400', path: 'M0,0 L100,0 L0,100 Z', target: { x: 50, y: 50, r: 0 } }, // Stock
    { id: 2, type: 'triangle', color: 'bg-cyan-500/20 border-cyan-400', path: 'M0,0 L100,100 L0,100 Z', target: { x: 150, y: 50, r: 90 } }, // Bow Arm L
    { id: 3, type: 'square', color: 'bg-blue-500/20 border-blue-400', path: 'M0,0 L70,0 L70,70 L0,70 Z', target: { x: 100, y: 150, r: 45 } }, // Mechanism
    { id: 4, type: 'parallelogram', color: 'bg-indigo-500/20 border-indigo-400', path: 'M25,0 L100,0 L75,50 L0,50 Z', target: { x: 100, y: 220, r: 0 } } // Base
];

const TangramGame: React.FC<TangramGameProps> = ({ minigame, onComplete }) => {
    // Randomized initial state
    const [parts, setParts] = useState(SHAPES.map(s => ({
        ...s,
        x: Math.random() * 150 + 20,
        y: Math.random() * 150 + 100,
        r: Math.floor(Math.random() * 4) * 90 // Random 90deg rotation
    })));

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    // Selection logic
    const handleSelect = (id: number) => {
        if (isComplete) return;
        setSelectedId(id);
    };

    // Movement 
    const moveSelected = (dx: number, dy: number) => {
        if (selectedId === null || isComplete) return;
        setParts(prev => prev.map(p => p.id === selectedId ? { ...p, x: p.x + dx, y: p.y + dy } : p));
    };

    const rotateSelected = () => {
        if (selectedId === null || isComplete) return;
        setParts(prev => prev.map(p => p.id === selectedId ? { ...p, r: (p.r + 45) % 360 } : p));
    };

    // Check Win Condition
    useEffect(() => {
        const TOLERANCE = 25; // Pixels
        const ROT_TOLERANCE = 1;

        const allCorrect = parts.every(p => {
            const dist = Math.sqrt(Math.pow(p.x - p.target.x, 2) + Math.pow(p.y - p.target.y, 2));
            const rotDiff = Math.abs(p.r - p.target.r) % 360;
            return dist < TOLERANCE && rotDiff === 0;
        });

        if (allCorrect && !isComplete) {
            setIsComplete(true);
            setTimeout(() => onComplete(100), 1000);
        }
    }, [parts, isComplete, onComplete]);

    // Render SVG Paths
    const renderPath = (shape: typeof SHAPES[0], state: typeof parts[0]) => {
        return (
            <g
                key={shape.id}
                transform={`translate(${state.x}, ${state.y}) rotate(${state.r})`}
                onClick={() => handleSelect(shape.id)}
                className={`cursor - pointer transition - all duration - 200 ${selectedId === shape.id ? 'opacity-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'opacity-70 hover:opacity-90'} `}
            >
                <path
                    d={shape.path}
                    className={`${shape.color} fill - current stroke - 2`}
                    vectorEffect="non-scaling-stroke"
                />
                <circle cx="0" cy="0" r="2" className="fill-white" />
            </g>
        );
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-4 bg-slate-900 border-4 border-slate-700 shadow-xl max-w-xl mx-auto select-none font-mono text-cyan-400">
            {/* Header */}
            <div className="w-full flex justify-between items-center border-b border-cyan-900 pb-2">
                <div>
                    <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                        <Crosshair className="w-5 h-5" /> SCORPION SIGHTS
                    </h3>
                    <p className="text-xs text-cyan-600">CALIBRATION SEQUENCE_INIT</p>
                </div>
                <div className={`text - xl font - bold ${isComplete ? 'text-green-500 animate-pulse' : 'text-slate-600'} `}>
                    {isComplete ? 'LOCKED' : 'ALIGNING...'}
                </div>
            </div>

            {/* Game Area - Blueprint Grid */}
            <div className="relative w-80 h-80 bg-[#0a192f] border-2 border-cyan-900/50 rounded-lg overflow-hidden shadow-inner grid-bg">
                {/* CSS Grid Pattern */}
                <style jsx>{`
    .grid - bg {
    background - image: linear - gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
        linear - gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
    background - size: 20px 20px;
}
`}</style>

                {/* Target Outlines (Ghost) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                    {SHAPES.map(s => (
                        <g key={s.id} transform={`translate(${s.target.x}, ${s.target.y}) rotate(${s.target.r})`}>
                            <path d={s.path} className="fill-none stroke-cyan-500 stroke-1 border-dashed" strokeDasharray="4 4" />
                        </g>
                    ))}
                </svg>

                {/* Draggable/Movable Shapes */}
                <svg className="absolute inset-0 w-full h-full">
                    {parts.map(p => {
                        const shape = SHAPES.find(s => s.id === p.id);
                        return shape ? renderPath(shape, p) : null;
                    })}
                </svg>
            </div>

            {/* Controls */}
            <div className="w-full grid grid-cols-2 gap-4">
                {/* D-Pad */}
                <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 grid grid-cols-3 gap-1 w-32 mx-auto">
                    <div />
                    <Button variant="ghost" className="h-8 p-0" onClick={() => moveSelected(0, -10)}>▲</Button>
                    <div />
                    <Button variant="ghost" className="h-8 p-0" onClick={() => moveSelected(-10, 0)}>◀</Button>
                    <div className="flex items-center justify-center text-cyan-700"><Move size={16} /></div>
                    <Button variant="ghost" className="h-8 p-0" onClick={() => moveSelected(10, 0)}>▶</Button>
                    <div />
                    <Button variant="ghost" className="h-8 p-0" onClick={() => moveSelected(0, 10)}>▼</Button>
                    <div />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 justify-center">
                    <Button
                        onClick={rotateSelected}
                        disabled={selectedId === null || isComplete}
                        className="bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-400 border border-cyan-800"
                    >
                        <RotateCw className="mr-2 w-4 h-4" /> ROTATE 45°
                    </Button>
                    <div className="text-xs text-center text-slate-500">
                        {selectedId ? `PART ${selectedId} SELECTED` : 'SELECT A PART'}
                    </div>
                </div>
            </div>

            {isComplete && (
                <div className="text-green-400 font-bold flex items-center gap-2 animate-bounce">
                    <CheckCircle2 /> OPTIMAL CONFIGURATION
                </div>
            )}
        </div>
    );
};

export default TangramGame;

