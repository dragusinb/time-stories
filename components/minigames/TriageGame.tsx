import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';
import { HeartPulse, User, Coins, Cross, Box, Camera, Footprints, AlertTriangle } from 'lucide-react';

interface TriageGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

const TriageGame: React.FC<TriageGameProps> = ({ minigame, onComplete, theme = 'medieval' }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState(theme === 'apollo' ? "Cargo exceeds ascent weight. Select PRIORITY payload to KEEP." : "One dose left. Choose wisely.");

    const isApollo = theme === 'apollo';

    // Medieval Patients
    const patients = [
        { id: 0, name: "Merchant", icon: <Coins className="text-yellow-500" />, desc: "Offers gold. Funds the hospital.", status: "Critical" },
        { id: 1, name: "Baker", icon: <User className="text-blue-400" />, desc: "Young. Feeds the poor.", status: "Critical" },
        { id: 2, name: "Priest", icon: <Cross className="text-purple-400" />, desc: "Old. Comforts the dying.", status: "Stable" },
        { id: 3, name: "Yourself", icon: <HeartPulse className="text-red-500" />, desc: "Exhausted. Essential to save others.", status: "Stable" }
    ];

    // Apollo Cargo items (Select what to KEEP/SAVE)
    // Concept: We are jettisoning everything else.
    // Correct Option in data should map to the index of the item to KEEP.
    const cargo = [
        { id: 0, name: "PLSS Rating 6", icon: <Box className="text-slate-400" />, desc: "Suit Life Support. Heavy. Empty.", status: "Expendable" },
        { id: 1, name: "Lunar Overshoes", icon: <Footprints className="text-slate-400" />, desc: "Contaminated dust. Heavy rubber.", status: "Expendable" },
        { id: 2, name: "Hasselblad Camera", icon: <Camera className="text-slate-400" />, desc: "Camera body. Film mag removed.", status: "Expendable" },
        { id: 3, name: "Moon Rocks", icon: <Box className="text-green-500" />, desc: "Priority Samples. Mission Objective.", status: "CRITICAL" }
    ];

    const items = isApollo ? cargo : patients;

    const handleSubmit = () => {
        if (selected === null) return;
        setSubmitted(true);

        const correct = isApollo ? 3 : 1; // 3 = Moon Rocks, 1 = Baker (implied correct in original)

        if (selected === correct) {
            setMessage(isApollo ? "Payload secured. Jettisoning trash." : "Ethical choice made. The Baker survives to feed the city.");
            setTimeout(() => onComplete(100), 2000);
        } else {
            setMessage(isApollo ? "Warning: Critical mission data lost." : "Choice recorded. Consequences unknown.");
            setTimeout(() => onComplete(50), 2000);
        }
    };

    return (
        <div className={`flex flex-col items-center space-y-6 p-6 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] ${isApollo ? 'bg-black border-green-900 text-green-500' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>
            <div className="text-center">
                <h3 className={`text-xl font-serif mb-2 tracking-widest uppercase ${isApollo ? 'text-green-500 font-mono' : 'text-red-400'}`}>{minigame.question}</h3>
                <p className={`text-xs font-mono ${isApollo ? 'text-green-700' : 'text-slate-400'}`}>{minigame.instructions}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full max-w-md font-pixel">
                {items.map((p, idx) => (
                    <button
                        key={idx}
                        onClick={() => !submitted && setSelected(idx)}
                        className={`
                            flex items-center gap-4 p-4 border-4 transition-all
                            ${selected === idx
                                ? (isApollo ? 'bg-green-900/40 border-green-500 shadow-[2px_2px_0px_0px_rgba(74,222,128,0.5)] translate-x-1' : 'bg-slate-800 border-blue-500 shadow-[2px_2px_0px_0px_rgba(59,130,246,0.5)] translate-x-1')
                                : (isApollo ? 'bg-black border-green-900 hover:bg-green-900/20' : 'bg-slate-900 border-slate-700 hover:bg-slate-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]')
                            }
                            ${submitted && selected !== idx ? 'opacity-50' : ''}
                        `}
                    >
                        <div className={`w-12 h-12 flex items-center justify-center border-2 pixelated ${isApollo ? 'bg-black border-green-900' : 'bg-slate-800 border-slate-600'}`}>
                            {isApollo ? (
                                <span className="text-2xl filter drop-shadow-md">
                                    {p.id === 0 && '🎒'}
                                    {p.id === 1 && '👢'}
                                    {p.id === 2 && '📷'}
                                    {p.id === 3 && '🪨'}
                                </span>
                            ) : (
                                <span className="text-2xl filter grayscale-[0.2] drop-shadow-md">
                                    {p.id === 0 && '💰'}
                                    {p.id === 1 && '🍞'}
                                    {p.id === 2 && '✝️'}
                                    {p.id === 3 && '💔'}
                                </span>
                            )}
                        </div>
                        <div className="text-left flex-1">
                            <div className="flex justify-between">
                                <span className={`font-bold ${isApollo ? 'text-green-400 font-mono' : 'text-slate-200'}`}>{p.name}</span>
                                <span className={`text-xs font-mono ${p.status === 'Critical' || p.status === 'CRITICAL' ? (isApollo ? 'text-green-500 animate-pulse' : 'text-red-500 animate-pulse') : (isApollo ? 'text-green-800' : 'text-yellow-500')}`}>
                                    {p.status}
                                </span>
                            </div>
                            <p className={`text-xs ${isApollo ? 'text-green-700 font-mono' : 'text-slate-500'}`}>{p.desc}</p>
                        </div>
                    </button>
                ))}
            </div>

            <div className={`h-8 font-bold font-mono text-sm ${isApollo ? 'text-green-600' : 'text-slate-300'}`}>
                {message}
            </div>

            <Button
                onClick={handleSubmit}
                disabled={selected === null || submitted}
                className={`w-full py-4 text-lg border-b-4 border-r-4 active:border-0 active:translate-y-1 active:translate-x-1 outline-none transition-none
                    ${isApollo
                        ? 'bg-green-600 text-black border-green-900 hover:bg-green-500 font-mono disabled:opacity-50 disabled:bg-green-900 disabled:text-green-700'
                        : 'pixel-btn-primary'
                    }`}
            >
                {submitted ? (isApollo ? 'JETTISONING...' : 'ADMINISTERING...') : (isApollo ? 'CONFIRM PAYLOAD' : 'CONFIRM TRIAGE')}
            </Button>
        </div>
    );
};

export default TriageGame;
