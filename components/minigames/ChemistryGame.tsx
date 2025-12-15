import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';

interface ChemistryGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

const ChemistryGame: React.FC<ChemistryGameProps> = ({ minigame, onComplete }) => {
    const [cauldron, setCauldron] = useState<string[]>([]);
    const [message, setMessage] = useState("Prepare the solution.");

    // Ingredients
    const ingredients = minigame.ingredients || ["Water", "Salt", "Mercury", "Leeches", "Boil", "Prayer"];
    const correctCombination = minigame.correctCombination || ["Water", "Salt"];

    const handleAdd = (ingredient: string) => {
        if (cauldron.includes(ingredient)) return;

        const newCauldron = [...cauldron, ingredient];
        setCauldron(newCauldron);

        // Check if we have all correct ingredients AND no wrong ones
        const hasAllCorrect = correctCombination.every(i => newCauldron.includes(i));
        const hasWrong = newCauldron.some(i => !correctCombination.includes(i) && i !== "Boil");

        if (hasWrong) {
            setMessage("Contaminated! The solution is toxic.");
            setTimeout(() => {
                setCauldron([]);
                setMessage("Restarting...");
            }, 1000);
        } else if (hasAllCorrect && ingredient === "Boil") {
            setMessage("Reaction complete. Solution stable.");
            setTimeout(() => onComplete(100), 1500);
        } else if (hasAllCorrect && !newCauldron.includes("Boil")) {
            setMessage("Ingredients mixed. Apply heat to react.");
        } else {
            setMessage(`Added ${ingredient}.`);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-6 bg-slate-900 border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="text-center">
                <h3 className="text-xl font-serif text-blue-400 mb-2 tracking-widest uppercase">{minigame.question}</h3>
                <p className="text-slate-400 text-xs font-mono">{minigame.instructions}</p>
            </div>

            {/* Beaker Visual */}
            <div className="relative w-32 h-40 border-4 border-slate-400 border-t-0 rounded-b-xl bg-slate-800/50 overflow-hidden flex items-end justify-center">
                <div
                    className="w-full bg-blue-500/50 transition-all duration-500 flex items-center justify-center"
                    style={{ height: `${(cauldron.length / ingredients.length) * 100}%` }}
                >
                    {cauldron.includes("Boil") && (
                        <div className="animate-bounce opacity-80">
                            <img src="/images/minigames/bubbles.png" alt="Bubbles" className="w-8 h-8 pixelated" />
                        </div>
                    )}
                </div>
                {/* Bubbles */}
                {cauldron.length > 0 && (
                    <div className="absolute inset-0 flex justify-center items-end space-x-2 pb-2">
                        <div className="w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                        <div className="w-3 h-3 bg-white/20 rounded-full animate-pulse delay-100"></div>
                    </div>
                )}
            </div>

            <div className="h-8 font-bold font-mono text-sm text-blue-300">
                {message}
            </div>

            {/* Ingredients Grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                {ingredients.map((ing) => (
                    <Button
                        key={ing}
                        onClick={() => handleAdd(ing)}
                        disabled={cauldron.includes(ing)}
                        className={`
                            h-12 text-xs border-2
                            ${cauldron.includes(ing)
                                ? 'bg-slate-800 border-slate-700 opacity-50'
                                : 'bg-slate-700 border-slate-500 hover:bg-blue-900 hover:border-blue-400'
                            }
                        `}
                    >
                        {ing === "Boil" && <img src="/images/minigames/flame.png" alt="Flame" className="w-4 h-4 mr-2 pixelated" />}
                        {ing === "Mercury" && <img src="/images/minigames/skull.png" alt="Skull" className="w-4 h-4 mr-2 pixelated" />}
                        {ing}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default ChemistryGame;
