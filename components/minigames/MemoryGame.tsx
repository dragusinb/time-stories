'use client';

import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

interface MemoryGameProps {
    question: string;
    instructions?: string;
    winningCondition?: string;
    options: string[]; // Pairs of items to match (e.g., ["ItemA", "MatchA", "ItemB", "MatchB"])
    onComplete: (success: boolean) => void;
}

interface GameCard {
    id: number;
    pairId: number;
    content: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export function MemoryGame({ question, instructions, winningCondition, options, onComplete }: MemoryGameProps) {
    const [cards, setCards] = useState<GameCard[]>([]);
    const [flippedIds, setFlippedIds] = useState<number[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        // Initialize game
        // We assume options are provided as pairs: [ItemA, MatchA, ItemB, MatchB, ...]
        const gameCards = options.map((content, index) => ({
            id: index,
            pairId: Math.floor(index / 2), // 0 and 1 get pairId 0, 2 and 3 get pairId 1, etc.
            content,
            isFlipped: false,
            isMatched: false,
        }));

        // Shuffle the cards
        const shuffled = [...gameCards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
    }, [options]);

    const handleCardClick = (id: number) => {
        // Find the card in the array (since we shuffled, index is not id)
        const cardIndex = cards.findIndex(c => c.id === id);
        if (cardIndex === -1) return;

        const card = cards[cardIndex];
        if (isProcessing || card.isMatched || card.isFlipped) return;

        const newFlippedIds = [...flippedIds, id];
        setFlippedIds(newFlippedIds);

        // Flip the card visually
        setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));

        if (newFlippedIds.length === 2) {
            setIsProcessing(true);
            setMoves(m => m + 1);

            const [firstId, secondId] = newFlippedIds;
            const firstCard = cards.find(c => c.id === firstId);
            const secondCard = cards.find(c => c.id === secondId);

            if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
                // Match
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === firstId || c.id === secondId
                            ? { ...c, isMatched: true, isFlipped: true }
                            : c
                    ));
                    setFlippedIds([]);
                    setIsProcessing(false);
                }, 500);
            } else {
                // No Match
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === firstId || c.id === secondId
                            ? { ...c, isFlipped: false }
                            : c
                    ));
                    setFlippedIds([]);
                    setIsProcessing(false);
                }, 1000);
            }
        }
    };

    useEffect(() => {
        if (cards.length > 0 && cards.every(c => c.isMatched)) {
            setTimeout(() => onComplete(true), 1000);
        }
    }, [cards, onComplete]);

    // --- THEMES ---
    // ANCIENT (Archimedes/Story 3)
    // SCI-FI (Apollo/Story 1)

    // We infer theme slightly from context if not passed, but let's assume standard 'pixel' default for Story 2
    // To make this fully theme-aware we'd need the theme prop passed down like in CipherGame.
    // For now, let's just make the default much nicer.

    return (
        <div className="max-w-4xl mx-auto py-8 font-pixel select-none">
            <div className="pixel-card p-4 md:p-8 mb-8 text-center border-amber-500/30">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-800 border-2 border-amber-500 relative flex flex-wrap gap-1 p-1 shadow-lg">
                        <div className="w-4 h-full bg-amber-500/20 animate-pulse"></div>
                        <div className="w-4 h-full bg-amber-500/20 animate-pulse delay-75"></div>
                    </div>
                    <div>
                        <h3 className="text-2xl text-amber-500 uppercase tracking-widest text-shadow-sm">Pattern Buffer</h3>
                        <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em]">Neural Link Established</p>
                    </div>
                </div>
                <p className="text-slate-300 text-sm mb-4 font-sans">{question}</p>

                <div className="flex justify-center gap-8 text-xs font-mono text-slate-500 border-t border-slate-800 pt-4">
                    <div>MOVES: <span className="text-amber-500">{moves}</span></div>
                    <div>MATCHES: <span className="text-green-500">{cards.filter(c => c.isMatched).length / 2}</span> / {options.length / 2}</div>
                </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {cards.map(card => (
                    <button
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        disabled={card.isFlipped || card.isMatched}
                        className={`
                            aspect-[3/4] p-2 border-b-4 rounded-sm transition-all duration-300 transform preserve-3d relative
                            ${card.isMatched
                                ? 'bg-green-900/20 border-green-600 translate-y-2 opacity-50 cursor-default'
                                : card.isFlipped
                                    ? 'bg-amber-900/20 border-amber-600 translate-y-1'
                                    : 'bg-slate-700 border-slate-900 hover:-translate-y-1 hover:bg-slate-600 hover:border-slate-800 shadow-xl'
                            }
                        `}
                    >
                        {/* Front (Hidden) */}
                        <div className={`absolute inset-0 flex items-center justify-center bg-slate-800 backface-hidden transition-opacity duration-300 ${card.isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="w-8 h-8 opacity-20 bg-amber-500/50 rotate-45"></div>
                        </div>

                        {/* Back (Revealed) */}
                        <div className={`absolute inset-0 flex items-center justify-center flex-col gap-2 p-1 transition-opacity duration-300 ${card.isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="text-xs md:text-sm font-bold text-amber-100 text-center leading-tight break-words">{card.content}</span>
                            {card.isMatched && <div className="text-[10px] text-green-400 font-mono tracking-widest uppercase">Match</div>}
                        </div>
                    </button>
                ))}
            </div>

            {cards.length > 0 && cards.every(c => c.isMatched) && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-8 text-center"
                >
                    <div className="inline-block px-8 py-4 bg-green-900/80 border-2 border-green-500 text-green-100 uppercase tracking-widest font-bold shadow-lg animate-bounce">
                        Sequence Complete
                    </div>
                </motion.div>
            )}
        </div>
    );
}
