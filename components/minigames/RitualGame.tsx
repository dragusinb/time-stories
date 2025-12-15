import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';


interface RitualGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

const RitualGame: React.FC<RitualGameProps> = ({ minigame, onComplete }) => {
    const [sequence, setSequence] = useState<string[]>([]);
    const [message, setMessage] = useState("Assemble the apparatus.");

    // Items: Burner, Flask, Condenser, Receiver
    const items = [
        { id: "Burner", icon: <img src="/images/minigames/flame.png" alt="Burner" className="w-8 h-8 image-pixelated" /> },
        { id: "Flask", icon: <img src="/images/minigames/flask.png" alt="Flask" className="w-8 h-8 image-pixelated" /> },
        { id: "Condenser", icon: <img src="/images/minigames/bubbles.png" alt="Condenser" className="w-8 h-8 image-pixelated" /> }, // Reusing bubbles for now as separate component
        { id: "Receiver", icon: <img src="/images/minigames/water.png" alt="Receiver" className="w-8 h-8 image-pixelated" /> }
    ];

    const correctOrder = ["Burner", "Flask", "Condenser", "Receiver"];

    const handleItemClick = (item: string) => {
        if (sequence.includes(item)) return;

        const newSequence = [...sequence, item];
        setSequence(newSequence);

        // Check if correct so far
        if (newSequence[newSequence.length - 1] !== correctOrder[newSequence.length - 1]) {
            setMessage("Incorrect placement! The glass shatters.");
            setTimeout(() => {
                setSequence([]);
                setMessage("Try again.");
            }, 1000);
            return;
        }

        if (newSequence.length === correctOrder.length) {
            setMessage("Apparatus assembled. Distillation begins.");
            setTimeout(() => onComplete(100), 1500);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-6 bg-slate-900 border-4 border-amber-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="text-center">
                <h3 className="text-xl font-serif text-amber-500 mb-2 tracking-widest uppercase">{minigame.question}</h3>
                <p className="text-slate-400 text-xs font-mono">{minigame.instructions}</p>
            </div>

            {/* Assembly Area */}
            <div className="flex items-end justify-center gap-2 h-32 w-full bg-slate-800 border-b-4 border-slate-700 p-4 relative">
                {sequence.map((item, idx) => {
                    const itemObj = items.find(i => i.id === item);
                    return (
                        <div key={idx} className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {itemObj?.icon}
                            <span className="text-[10px] text-slate-500 mt-1">{item}</span>
                        </div>
                    );
                })}
                {sequence.length === 0 && <span className="text-slate-600 text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Empty Bench</span>}
            </div>

            <div className="h-8 font-bold font-mono text-sm text-amber-400">
                {message}
            </div>

            {/* Inventory */}
            <div className="grid grid-cols-4 gap-4">
                {items.map((item) => (
                    <Button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        disabled={sequence.includes(item.id)}
                        className={`
                            h-20 flex flex-col items-center justify-center gap-2 border-2
                            ${sequence.includes(item.id)
                                ? 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed'
                                : 'bg-slate-700 border-slate-500 hover:bg-slate-600 hover:border-amber-500'
                            }
                        `}
                    >
                        {item.icon}
                        <span className="text-xs">{item.id}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default RitualGame;
