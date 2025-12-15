'use client';

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowUp, ArrowDown, RotateCcw, CheckCircle, ArrowRightLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SequenceGameProps {
    question: string;
    instructions?: string;
    winningCondition?: string;
    items: string[];
    itemImages?: string[];
    correctOrder: string[];
    theme?: 'sci-fi' | 'ancient';
    onComplete: (success: boolean) => void;
}

export function SequenceGame({ question, instructions, winningCondition, items, itemImages, correctOrder, theme = 'sci-fi', onComplete }: SequenceGameProps) {
    // Initial state: items are in the "pool" (inventory), "sequence" (assembly) is empty
    // We shuffle the initial items to ensure they aren't already in order
    const [pool, setPool] = useState<string[]>(() => [...items].sort(() => Math.random() - 0.5));
    const [sequence, setSequence] = useState<string[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleAddToSequence = (item: string) => {
        if (isCorrect === true) return;
        setPool(prev => prev.filter(i => i !== item));
        setSequence(prev => [...prev, item]);
        setIsCorrect(null);
    };

    const handleRemoveFromSequence = (item: string) => {
        if (isCorrect === true) return;
        setSequence(prev => prev.filter(i => i !== item));
        setPool(prev => [...prev, item]);
        setIsCorrect(null);
    };

    const handleReset = () => {
        setPool([...items].sort(() => Math.random() - 0.5));
        setSequence([]);
        setIsCorrect(null);
    };

    const handleSubmit = () => {
        if (sequence.length !== correctOrder.length) return;

        const correct = sequence.every((item, index) => item === correctOrder[index]);
        setIsCorrect(correct);

        if (correct) {
            setTimeout(() => onComplete(true), 2000); // Longer delay to enjoy success state
        } else {
            // Shake effect logic handled by CSS classes
            setTimeout(() => setIsCorrect(null), 2500);
        }
    };

    // --- ANCIENT THEME (Story 3) ---
    if (theme === 'ancient') {
        return (
            <div className="max-w-4xl mx-auto py-8 font-serif select-none">
                <div className="bg-[#2a1b15] border-[8px] border-[#8b5a2b] rounded-lg p-1 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
                    {/* Texture overlay */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>

                    {/* Header */}
                    <div className="relative z-10 p-8 pb-4 text-center border-b-4 border-[#5e4026] bg-[#1a110d]/80">
                        <div className="flex items-center justify-center gap-4 mb-2">
                            <ArrowRightLeft className="w-10 h-10 text-amber-600" />
                            <h3 className="text-2xl text-[#e6ccb2] uppercase tracking-[0.2em] font-bold">Construction</h3>
                        </div>
                        <p className="text-[#a68a64] text-sm italic">{question}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 p-8 relative z-10">
                        {/* Source Items (Material Pile) */}
                        <div className="bg-[#3d2b1f] border-4 border-[#5e4026] p-6 shadow-inner rounded-sm relative group">
                            <div className="absolute -top-3 left-4 bg-[#8b5a2b] px-3 py-1 text-[10px] uppercase tracking-widest text-[#1a110d] font-bold border border-[#d6c0a0]">
                                Supplies
                            </div>

                            <div className="flex justify-end mb-4">
                                <button onClick={handleReset} className="text-[#a68a64] hover:text-[#e6ccb2] text-xs uppercase flex items-center gap-1 transition-colors">
                                    <RotateCcw className="w-3 h-3" /> Clear Table
                                </button>
                            </div>

                            <div className="space-y-3 min-h-[300px]">
                                <AnimatePresence>
                                    {pool.map((item) => {
                                        const originalIndex = items.indexOf(item);
                                        const imageUrl = itemImages?.[originalIndex];
                                        return (
                                            <motion.button
                                                key={item}
                                                layout
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                onClick={() => handleAddToSequence(item)}
                                                className="w-full relative group/item"
                                            >
                                                <div className="relative bg-[#5e4026] border-2 border-[#8b5a2b] p-3 flex justify-between items-center hover:-translate-y-1 transition-transform hover:bg-[#704d2e] shadow-md">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-[#2a1b15] border border-[#8b5a2b] flex items-center justify-center rounded-sm">
                                                            {/* Placeholder icon if no image */}
                                                            <div className="w-4 h-4 bg-[#a68a64] rotate-45"></div>
                                                        </div>
                                                        <span className="text-sm text-[#e6ccb2] font-serif tracking-wide">{item}</span>
                                                    </div>
                                                    <ArrowUp className="w-4 h-4 text-[#a68a64] group-hover/item:text-[#e6ccb2] rotate-90 transition-all" />
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </AnimatePresence>
                                {pool.length === 0 && (
                                    <div className="h-full flex items-center justify-center pt-20">
                                        <p className="text-[#5e4026] text-xs italic uppercase">Bench Empty</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Target Sequence (Blueprint) */}
                        <div className={`border-4 p-6 shadow-inner rounded-sm relative transition-colors duration-500 ${isCorrect === true ? 'bg-green-900/20 border-green-700/50' :
                                isCorrect === false ? 'bg-red-900/20 border-red-700/50' :
                                    'bg-[#e6ccb2] border-[#d6c0a0]'
                            }`}>
                            <div className="absolute -top-3 left-4 bg-[#8b5a2b] px-3 py-1 text-[10px] uppercase tracking-widest text-[#1a110d] font-bold border border-[#d6c0a0]">
                                Assembly
                            </div>

                            {/* Blueprint Lines Background */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none"
                                style={{ backgroundImage: 'linear-gradient(#8b5a2b 1px, transparent 1px), linear-gradient(90deg, #8b5a2b 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                            </div>

                            <div className="space-y-2 min-h-[300px] relative z-10 pt-4">
                                <AnimatePresence>
                                    {sequence.map((item, index) => (
                                        <motion.div
                                            key={`${item}-${index}`}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-[#8b5a2b] text-[#1a110d] font-bold text-xs flex items-center justify-center border border-[#5e4026]">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 bg-[#f5ebe0] border-2 border-[#8b5a2b] p-2 flex justify-between items-center shadow-sm">
                                                <span className="text-sm text-[#3d2b1f] font-serif font-bold">{item}</span>
                                                <button onClick={() => handleRemoveFromSequence(item)} className="text-[#8b5a2b] hover:text-red-600">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {sequence.length === 0 && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 pointer-events-none">
                                        <p className="text-[#8b5a2b] text-xs uppercase tracking-widest border-2 border-[#8b5a2b] p-2 px-4 rotate-12">Blueprint Empty</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-4 border-t-2 border-[#8b5a2b]/30">
                                <button
                                    onClick={handleSubmit}
                                    disabled={sequence.length === 0}
                                    className={`w-full py-3 text-sm uppercase tracking-[0.2em] font-bold transition-all border-b-4 active:border-b-0 active:translate-y-1 ${sequence.length > 0
                                        ? 'bg-[#8b5a2b] text-[#1a110d] border-[#5e4026] hover:bg-[#a67c52]'
                                        : 'bg-[#b08968] text-[#704d2e] border-[#5e4026] cursor-not-allowed'
                                        }`}
                                >
                                    {isCorrect === null ? 'Join Parts' : isCorrect ? 'Structure Sound' : 'Testing...'}
                                </button>
                            </div>

                            {isCorrect === false && (
                                <p className="text-red-700 font-bold text-xs text-center mt-2 animate-pulse uppercase">Structure Unstable!</p>
                            )}
                            {isCorrect === true && (
                                <p className="text-green-800 font-bold text-xs text-center mt-2 uppercase">Construction Complete</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 font-pixel">
            <div className="pixel-card p-8 mb-8 text-center border-amber-500/30">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <ArrowRightLeft className="w-12 h-12 text-amber-500" />
                    <h3 className="text-2xl text-amber-500 uppercase tracking-widest">Procedural Assembly</h3>
                </div>
                <p className="text-slate-400 text-sm mb-2">{question}</p>
                {instructions && <p className="text-xs text-slate-500 mb-1">INSTR: {instructions}</p>}
                {winningCondition && <p className="text-xs text-slate-500">GOAL: {winningCondition}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Source Items */}
                <div className="pixel-card p-6 bg-slate-900 shadow-inner">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-amber-500 text-xs uppercase tracking-wider">Components Inventory</h4>
                        <button onClick={handleReset} className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 uppercase">
                            <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                    </div>

                    <div className="space-y-3 min-h-[300px]">
                        <AnimatePresence>
                            {pool.map((item) => {
                                const originalIndex = items.indexOf(item);
                                const imageUrl = itemImages?.[originalIndex];
                                return (
                                    <motion.button
                                        key={item}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => handleAddToSequence(item)}
                                        className="w-full relative group"
                                    >
                                        <div className="absolute inset-0 bg-slate-800 border-2 border-slate-700 translate-y-1 rounded-sm"></div>
                                        <div className="relative bg-slate-800 border-2 border-slate-600 p-3 flex justify-between items-center hover:-translate-y-1 transition-transform hover:border-amber-500/50 hover:bg-slate-750">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-900 border border-slate-700 flex items-center justify-center">
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt={item} className="w-8 h-8 object-contain image-pixelated" />
                                                    ) : (
                                                        <span className="text-xs text-slate-600">?</span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-slate-300 font-mono tracking-wide">{item}</span>
                                            </div>
                                            <ArrowUp className="w-4 h-4 text-slate-600 group-hover:text-amber-500 group-hover:-rotate-90 transition-all" />
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                        {pool.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex items-center justify-center pt-20"
                            >
                                <p className="text-slate-700 text-xs italic">Inventory Depleted</p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Target Sequence */}
                <div className={`pixel-card p-6 border-4 transition-colors duration-500 ${isCorrect === true ? 'border-green-500/50 bg-green-900/10' :
                    isCorrect === false ? 'border-red-500/50 bg-red-900/10' :
                        'border-amber-500/20'
                    }`}>
                    <h4 className="text-amber-500 text-xs uppercase mb-6 text-center tracking-wider">Assembly Sequence</h4>

                    <div className="space-y-2 min-h-[300px] relative">
                        {/* Connection Line */}
                        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-800 -z-0"></div>

                        <AnimatePresence>
                            {sequence.map((item, index) => {
                                const originalIndex = items.indexOf(item);
                                const imageUrl = itemImages?.[originalIndex];
                                return (
                                    <motion.div
                                        key={`${item}-${index}`}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex items-center gap-4 relative z-10"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-mono shadow-lg shrink-0">
                                            {index + 1}
                                        </div>

                                        <div className="flex-1">
                                            <div className="bg-slate-800 border-2 border-slate-600 p-2 flex justify-between items-center group hover:border-slate-500 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    {imageUrl && (
                                                        <div className="w-8 h-8 opacity-80">
                                                            <img src={imageUrl} alt={item} className="w-full h-full object-contain image-pixelated" />
                                                        </div>
                                                    )}
                                                    <span className="text-xs text-amber-100 font-mono truncate max-w-[120px]">{item}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveFromSequence(item)}
                                                    className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {sequence.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50 pointer-events-none">
                                <div className="w-16 h-16 border-2 border-dashed border-slate-700 rounded-lg mb-2"></div>
                                <div className="w-16 h-16 border-2 border-dashed border-slate-700 rounded-lg mb-2 opacity-50"></div>
                                <div className="w-16 h-16 border-2 border-dashed border-slate-700 rounded-lg opacity-25"></div>
                                <p className="text-slate-600 text-[10px] mt-2 uppercase tracking-wide">Awaiting Input</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t-2 border-slate-800/50">
                        <button
                            onClick={handleSubmit}
                            disabled={sequence.length === 0}
                            className={`w-full py-4 text-sm uppercase tracking-[0.2em] font-bold transition-all transform active:scale-[0.98] ${sequence.length > 0
                                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_4px_0_#92400e] active:shadow-none active:translate-y-[4px]'
                                : 'bg-slate-800 text-slate-600 cursor-not-allowed border-2 border-slate-700'
                                }`}
                        >
                            {isCorrect === null ? 'Verify Sequence' : isCorrect ? 'Verified' : 'Verifying...'}
                        </button>
                    </div>

                    {isCorrect === false && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-900/20 border border-red-500/50 p-3 mt-4 text-center rounded"
                        >
                            <p className="text-red-400 text-xs font-bold animate-pulse uppercase tracking-wide">
                                Sequence Invalid. Reorder Required.
                            </p>
                        </motion.div>
                    )}

                    {isCorrect === true && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-900/20 border border-green-500/50 p-4 mt-4 text-center rounded flex flex-col items-center gap-2"
                        >
                            <CheckCircle className="w-8 h-8 text-green-500" />
                            <p className="text-green-400 text-xs font-bold uppercase tracking-wide">
                                Logic Validated. Proceed.
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
