import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';
import { motion } from 'framer-motion';

interface SymbolMatchingGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

const SymbolMatchingGame: React.FC<SymbolMatchingGameProps> = ({ minigame, onComplete }) => {
    const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedCount, setMatchedCount] = useState(0);
    const [message, setMessage] = useState("Match the Alchemical Symbols.");

    // Symbols: Fire, Water, Earth, Air, Salt, Mercury, Sulfur, Gold
    const symbols = ["🜂", "🜄", "🜃", "🜁", "🜔", "☿", "🜍", "☉"];

    useEffect(() => {
        // Initialize game
        const gameSymbols = symbols.slice(0, 4); // Use 4 pairs for 8 cards
        const deck = [...gameSymbols, ...gameSymbols]
            .sort(() => Math.random() - 0.5)
            .map((symbol, index) => ({
                id: index,
                symbol,
                flipped: false,
                matched: false
            }));
        setCards(deck);
    }, []);

    const handleCardClick = (id: number) => {
        if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;

        const newCards = [...cards];
        newCards[id].flipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, id];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].symbol === cards[second].symbol) {
                // Match
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === first || c.id === second ? { ...c, matched: true } : c
                    ));
                    setFlippedCards([]);
                    setMatchedCount(prev => {
                        const newCount = prev + 1;
                        if (newCount === 4) {
                            setMessage("All symbols aligned. The path is clear.");
                            setTimeout(() => onComplete(100), 1500);
                        }
                        return newCount;
                    });
                }, 500);
            } else {
                // No Match
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === first || c.id === second ? { ...c, flipped: false } : c
                    ));
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-6 bg-slate-900 border-4 border-amber-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="text-center">
                <h3 className="text-xl font-serif text-amber-500 mb-2 tracking-widest uppercase">{minigame.question}</h3>
                <p className="text-slate-400 text-xs font-mono">{minigame.instructions}</p>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {cards.map((card) => (
                    <motion.button
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className={`
                            w-16 h-20 border-2 rounded-sm flex items-center justify-center text-3xl
                            transition-all duration-300
                            ${card.flipped || card.matched
                                ? 'bg-amber-100 border-amber-300 text-amber-900 rotate-y-180'
                                : 'bg-amber-900 border-amber-700 hover:bg-amber-800'
                            }
                            ${card.matched ? 'opacity-50' : 'opacity-100'}
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {card.flipped || card.matched ? card.symbol : "?"}
                    </motion.button>
                ))}
            </div>

            <div className="h-8 font-bold font-mono text-sm text-amber-400">
                {message}
            </div>
        </div>
    );
};

export default SymbolMatchingGame;
