import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';
import { Scale, MessageSquare } from 'lucide-react';

interface DebateGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

const DebateGame: React.FC<DebateGameProps> = ({ minigame, onComplete }) => {
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0); // 0 to 100
    const [message, setMessage] = useState("Defend your logic against the Inquisition.");
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // 3 Rounds of debate
    const rounds = [
        {
            opponent: "Inquisitor Rossi",
            statement: "Disease is God's punishment for sin. Your 'invisible seeds' are heresy.",
            options: [
                { text: "But the nuns are dying too. Are they sinners?", score: 100, feedback: "A strong point. Rossi hesitates." },
                { text: "You are wrong. Science proves it.", score: 0, feedback: "Heresy! The guards step forward." },
                { text: "God created the seeds as a test.", score: 50, feedback: "A clever theological pivot." }
            ]
        },
        {
            opponent: "Ghiberti",
            statement: "He uses dark magic! I saw him mixing potions with strange fumes!",
            options: [
                { text: "It was just vinegar and garlic.", score: 50, feedback: "Weak defense." },
                { text: "I am using God's creation to heal His children.", score: 100, feedback: "The crowd murmurs in agreement." },
                { text: "You are just jealous of my success.", score: 20, feedback: "Ad hominem attacks weaken your case." }
            ]
        },
        {
            opponent: "The Bishop",
            statement: "If you can cure this, why has God allowed the plague to spread?",
            options: [
                { text: "God helps those who help themselves.", score: 80, feedback: "A standard answer." },
                { text: "We are the tools of His mercy.", score: 100, feedback: "The Bishop nods slowly." },
                { text: "I don't know.", score: 0, feedback: "Silence is admission of guilt." }
            ]
        }
    ];

    const handleSelect = (idx: number) => {
        setSelectedOption(idx);
        const currentRound = rounds[round];
        const option = currentRound.options[idx];

        setMessage(option.feedback);

        setTimeout(() => {
            if (option.score >= 50) {
                if (round < 2) {
                    setRound(prev => prev + 1);
                    setSelectedOption(null);
                    setMessage("Next accusation...");
                    setScore(prev => prev + option.score);
                } else {
                    setScore(prev => prev + option.score);
                    setMessage("The Tribunal is deliberating...");
                    setTimeout(() => onComplete(100), 1500);
                }
            } else {
                setMessage("Your argument failed. Try again.");
                setSelectedOption(null);
            }
        }, 1500);
    };

    const currentRound = rounds[round];

    return (
        <div className="flex flex-col items-center space-y-6 p-6 bg-slate-900 border-4 border-red-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="text-center">
                <h3 className="text-xl font-serif text-amber-500 mb-2 tracking-widest uppercase">{minigame.question}</h3>
                <p className="text-slate-400 text-xs font-mono">{minigame.instructions}</p>
                <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">Round {round + 1}/3</p>
            </div>

            {/* Debate Arena */}
            <div className="w-full max-w-md bg-slate-800 border-2 border-slate-700 p-4 rounded-lg relative">
                {/* Opponent */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-red-900 flex items-center justify-center border-4 border-red-500 shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <img src="/images/minigames/skull.png" alt="Inquisition" className="w-10 h-10 image-pixelated" />
                    </div>
                    <div className="bg-red-900/20 border border-red-900/50 p-3 rounded-tr-xl rounded-b-xl">
                        <p className="text-red-200 text-sm font-serif italic">"{currentRound.statement}"</p>
                        <p className="text-red-500 text-xs mt-1 font-bold uppercase">- {currentRound.opponent}</p>
                    </div>
                </div>

                {/* Player Options */}
                <div className="space-y-3">
                    {currentRound.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={selectedOption !== null}
                            className={`w-full text-left p-3 border-b-4 border-r-4 text-sm font-mono tracking-wide transition-all ${selectedOption === idx
                                ? 'bg-amber-600 border-amber-800 text-amber-100 translate-y-1 translate-x-1 border-b-0 border-r-0'
                                : 'bg-slate-700 border-slate-900 text-slate-300 hover:bg-slate-600 active:translate-y-1 active:translate-x-1 active:border-b-0 active:border-r-0'
                                }`}
                        >
                            <span className="mr-2 text-slate-500 font-bold">{String.fromCharCode(65 + idx)}.</span>
                            {option.text}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-8 font-bold font-mono text-sm text-amber-400">
                {message}
            </div>
        </div>
    );
};

export default DebateGame;
