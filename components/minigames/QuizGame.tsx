import React, { useState } from 'react';
import { Minigame } from '@/types';
import { Brain } from 'lucide-react';

interface QuizGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

export function QuizGame({ minigame, onComplete }: QuizGameProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const { instructions, winningCondition } = minigame;

    const handleSubmit = () => {
        if (selectedOption === null) return;

        const correct = selectedOption === minigame.correctOption;
        setIsCorrect(correct);

        if (correct) {
            setTimeout(() => onComplete(100), 1500);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 font-pixel">
            <div className="pixel-card p-8 border-amber-500/30">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <Brain className="w-12 h-12 text-amber-500" />
                    <h3 className="text-2xl text-amber-500 uppercase tracking-widest">Knowledge Check</h3>
                </div>

                {/* Instructions Block */}
                <div className="mb-8 text-center">
                    {instructions && <p className="text-xs text-slate-500 mb-1">INSTR: {instructions}</p>}
                    {winningCondition && <p className="text-xs text-slate-500">GOAL: {winningCondition}</p>}
                </div>

                <h4 className="text-lg text-white mb-8 text-center leading-relaxed">{minigame.question}</h4>

                <div className="grid gap-4 mb-8">
                    {minigame.options?.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (isCorrect === true) return;
                                setSelectedOption(index);
                                setIsCorrect(null);
                            }}
                            className={`p-4 text-left transition-all border-4 text-sm uppercase tracking-wider ${selectedOption === index
                                ? isCorrect === true
                                    ? 'bg-green-500/20 border-green-500 text-green-100'
                                    : isCorrect === false
                                        ? 'bg-red-500/20 border-red-500 text-red-100'
                                        : 'bg-amber-500/20 border-amber-500 text-amber-100'
                                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                                }`}
                        >
                            <span className="mr-4 text-slate-500">{String.fromCharCode(65 + index)}.</span>
                            {option}
                        </button>
                    ))}
                </div>

                <button
                    className={`w-full py-4 text-lg uppercase tracking-widest transition-all ${selectedOption === null || isCorrect === true
                        ? 'bg-slate-900 border-4 border-slate-800 text-slate-700 cursor-not-allowed'
                        : 'pixel-btn-primary'
                        }`}
                    onClick={handleSubmit}
                    disabled={selectedOption === null || isCorrect === true}
                >
                    {isCorrect === true ? 'Correct! Continuing...' : 'Submit Answer'}
                </button>

                {isCorrect === false && (
                    <p className="text-red-500 text-center mt-4 text-xs animate-pulse">INCORRECT. RE-EVALUATE DATA.</p>
                )}
            </div>
        </div>
    );
}
