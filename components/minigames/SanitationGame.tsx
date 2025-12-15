import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';
import { motion } from 'framer-motion';
import { Flame, Skull, Rat, ShieldAlert, Trash2, Droplets, Thermometer, Hand } from 'lucide-react';

interface SanitationGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

const SanitationGame: React.FC<SanitationGameProps> = ({ minigame, onComplete }) => {
    const [cards, setCards] = useState<{ id: number; content: any; type: 'action' | 'disease'; flipped: boolean; matched: boolean }[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedCount, setMatchedCount] = useState(0);
    const [message, setMessage] = useState("Match the Protocol to the Threat.");

    // Pairs: Action -> Threat
    const pairs = [
        {
            action: { text: "Boil Water", icon: <Flame className="w-8 h-8 text-orange-500" /> },
            threat: { text: "Cholera", icon: <Skull className="w-8 h-8 text-green-700" /> }
        },
        {
            action: { text: "Kill Rats", icon: <Rat className="w-8 h-8 text-gray-400" /> },
            threat: { text: "The Plague", icon: <ShieldAlert className="w-8 h-8 text-purple-600" /> }
        },
        {
            action: { text: "Wash Hands", icon: <Hand className="w-8 h-8 text-blue-400" /> },
            threat: { text: "Typhoid", icon: <Thermometer className="w-8 h-8 text-red-500" /> }
        },
        {
            action: { text: "Dispose Waste", icon: <Trash2 className="w-8 h-8 text-slate-400" /> },
            threat: { text: "Dysentery", icon: <Droplets className="w-8 h-8 text-yellow-600" /> }
        }
    ];

    useEffect(() => {
        // Create deck
        const deck: any[] = [];
        pairs.forEach((pair, idx) => {
            deck.push({ id: idx * 2, content: pair.action, type: 'action', pairId: idx, flipped: false, matched: false });
            deck.push({ id: idx * 2 + 1, content: pair.threat, type: 'disease', pairId: idx, flipped: false, matched: false });
        });

        // Shuffle
        setCards(deck.sort(() => Math.random() - 0.5));
    }, []);

    const handleCardClick = (index: number) => {
        if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;

        const newCards = [...cards];
        newCards[index].flipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            // Check if pairId matches
            if ((cards[first] as any).pairId === (cards[second] as any).pairId) {
                // Match
                setTimeout(() => {
                    setCards(prev => prev.map((c, i) =>
                        i === first || i === second ? { ...c, matched: true } : c
                    ));
                    setFlippedCards([]);
                    setMatchedCount(prev => {
                        const newCount = prev + 1;
                        if (newCount === 4) {
                            setMessage("Protocols established. City is safe.");
                            setTimeout(() => onComplete(100), 1500);
                        }
                        return newCount;
                    });
                }, 500);
            } else {
                // No Match
                setTimeout(() => {
                    setCards(prev => prev.map((c, i) =>
                        i === first || i === second ? { ...c, flipped: false } : c
                    ));
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-6 bg-slate-900 border-4 border-green-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="text-center">
                <h3 className="text-xl font-serif text-green-400 mb-2 tracking-widest uppercase">{minigame.question}</h3>
                <p className="text-slate-400 text-xs font-mono">{minigame.instructions}</p>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {cards.map((card, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => handleCardClick(idx)}
                        className={`
                            w-16 h-20 border-2 rounded-sm flex flex-col items-center justify-center p-1
                            transition-all duration-300
                            ${card.flipped || card.matched
                                ? card.type === 'action' ? 'bg-blue-900 border-blue-500 text-blue-200' : 'bg-red-900 border-red-500 text-red-200'
                                : 'bg-slate-800 border-slate-600 hover:bg-slate-700'
                            }
                            ${card.matched ? 'opacity-50' : 'opacity-100'}
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {card.flipped || card.matched ? (
                            <>
                                <div className="mb-1">{card.content.icon}</div>
                                <span className="text-[8px] leading-tight font-mono">{card.content.text}</span>
                            </>
                        ) : (
                            <div className="w-full h-full bg-slate-800 opacity-20 flex items-center justify-center">
                                <span className="text-slate-600 text-xs">?</span>
                            </div>
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="h-8 font-bold font-mono text-sm text-green-400">
                {message}
            </div>
        </div>
    );
};

export default SanitationGame;
