'use client';

import { useState, useEffect } from 'react';
import { MinigameType } from '@/types'; // Basic import

interface CipherGameProps {
    question: string;
    instructions?: string;
    winningCondition?: string;
    encrypted: string;
    decrypted: string;
    theme?: 'sci-fi' | 'ancient';
    onComplete: (success: boolean) => void;
}

export function CipherGame({ question, instructions, winningCondition, encrypted, decrypted, theme = 'sci-fi', onComplete }: CipherGameProps) {
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);
    const [options, setOptions] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // Initial Setup for Options (Sci-Fi Theme)
    useEffect(() => {
        if (theme === 'sci-fi') {
            const distractors = [
                "SYSTEM PURGE", "MANUAL REBOOT", "CACHE CLEAR",
                "BUFFER FLUSH", "SIGNAL LOCK", "VECTOR ALIGN",
                "ABORT SEQUENCE", "POWER CYCLE"
            ];
            // Filter out if decrypted happens to be in distractors (unlikely but safe)
            const cleanDistractors = distractors.filter(d => d !== decrypted);
            // Pick 3 random distractors
            const selected = cleanDistractors.sort(() => 0.5 - Math.random()).slice(0, 3);
            selected.push(decrypted);
            setOptions(selected.sort(() => 0.5 - Math.random()));
        }
    }, [theme, decrypted]);



    const handleOptionClick = (option: string) => {
        setInput(option);
        // Auto-submit after a brief delay for effect
        setSubmitting(true);
        setTimeout(() => {
            if (option === decrypted) {
                onComplete(true);
            } else {
                setError(true);
                setSubmitting(false);
                setTimeout(() => setError(false), 1000);
            }
        }, 500);
    };

    const handleSubmit = () => {
        if (input.toUpperCase().trim() === decrypted.toUpperCase()) {
            onComplete(true);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    // --- ANCIENT THEME (Story 3) ---
    if (theme === 'ancient') {
        return (
            <div className="max-w-2xl mx-auto py-8 font-serif select-none">
                <div className="relative bg-[#2a1b15] border-[8px] border-[#8b5a2b] rounded-lg p-1 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden">
                    {/* Texture overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none"></div>

                    {/* Header Plate */}
                    <div className="bg-[#1a110d] p-4 md:p-6 border-b-4 border-[#8b5a2b] flex justify-between items-center">
                        <h3 className="text-xl text-[#cdb4db] font-serif tracking-[0.2em] uppercase text-amber-500/80">Archimedes' Lock</h3>
                        <div className="text-[#8b5a2b] text-xs uppercase tracking-widest">Syracuse Mechanism</div>
                    </div>

                    <div className="p-4 md:p-8 flex flex-col items-center gap-8 relative z-10">
                        {/* Prompt Scroll */}
                        <div className="bg-[#e6ccb2] text-[#3d2b1f] p-4 rounded shadow-inner w-full text-center border-2 border-[#b08968]">
                            <p className="text-sm font-bold uppercase tracking-wide mb-2 border-b border-[#3d2b1f]/20 pb-1">{question}</p>
                            <p className="text-xs italic opacity-80">{instructions}</p>
                        </div>

                        {/* The "Encrypted" Cymbols */}
                        <div className="flex gap-4 p-6 bg-[#1a110d] rounded-lg border border-[#8b5a2b]/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                            <div className="text-4xl md:text-6xl text-amber-500 font-serif tracking-[0.5em] drop-shadow-lg">
                                {encrypted}
                            </div>
                        </div>

                        {/* Input Area (Stone Tablet style) */}
                        <div className="relative group w-full max-w-md">
                            <label className="block text-center text-[#8b5a2b] text-xs uppercase tracking-[0.3em] mb-2">Inscription</label>
                            <div className="flex items-center justify-center bg-[#1a110d] border-4 border-[#5e4026] p-4 shadow-inner relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value.toUpperCase())}
                                    className="bg-transparent border-none text-center text-amber-100 text-3xl tracking-[0.5em] w-full outline-none font-serif uppercase placeholder-[#3d2b1f]"
                                    autoFocus
                                    placeholder="____"
                                    maxLength={decrypted.length}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-400 font-serif text-sm tracking-widest animate-pulse">
                                MECHANISM JAMMED. INCORRECT SEQUENCE.
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            className="mt-4 px-12 py-3 bg-[#8b5a2b] hover:bg-[#a67c52] text-[#1a110d] font-bold border-t-2 border-[#d6c0a0] border-b-4 border-[#5e4026] active:border-b-0 active:translate-y-1 transition-all uppercase tracking-widest shadow-lg rounded"
                        >
                            Unlock Seal
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- SCI-FI THEME (Default / Story 1) - Redesigned as typing puzzle ---
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(0);

    // Parse the code to create hints
    // "EXE-OVER-FLOW" -> hint shows partial letters
    const getHintText = () => {
        // Show first letter of each word
        const words = decrypted.split(' ');
        return words.map(w => w[0] + '_'.repeat(w.length - 1)).join(' ');
    };

    const handleTypedSubmit = () => {
        const normalizedInput = input.toUpperCase().trim();
        const normalizedAnswer = decrypted.toUpperCase().trim();

        setAttempts(prev => prev + 1);

        if (normalizedInput === normalizedAnswer) {
            setSubmitting(true);
            setTimeout(() => onComplete(true), 500);
        } else {
            setError(true);
            // Show hint after 2 failed attempts
            if (attempts >= 1) {
                setShowHint(true);
            }
            setTimeout(() => setError(false), 1500);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="relative bg-[#0d1619] border-[6px] border-slate-700 rounded-lg p-2 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* CRT Screen Effects */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-20"></div>
                <div className="absolute inset-0 bg-green-500/5 animate-pulse pointer-events-none z-10"></div>
                <div className="absolute top-0 w-full h-1 bg-white/10 animate-[scan_6s_linear_infinite] pointer-events-none z-20"></div>

                {/* Monitor Content */}
                <div className="bg-[#0a0f0f] p-4 md:p-8 rounded border border-green-900/50 min-h-[400px] flex flex-col font-mono relative z-0">
                    {/* Header */}
                    <div className="flex justify-between items-end border-b-2 border-green-800 pb-4 mb-6">
                        <div>
                            <h3 className="text-xl text-green-500 font-bold tracking-[0.2em] uppercase glow-text">APOLLO GUIDANCE COMPUTER</h3>
                            <p className="text-green-700 text-xs mt-1">V. 1202.4_CHECK</p>
                        </div>
                        <div className="text-red-500 text-xs animate-pulse font-bold">1202_ALARM</div>
                    </div>

                    {/* Terminal Text */}
                    <div className="space-y-4 flex-grow">
                        <div className="text-green-400 text-sm">
                            <span className="opacity-50">&gt; ERROR:</span> Computer overloaded with landing radar data<br />
                            <span className="opacity-50">&gt; CAUSE:</span> Executive overflow - too many tasks queued<br />
                            <span className="opacity-50">&gt; ACTION:</span> Enter override code to clear buffer
                        </div>

                        {/* Encoded message display */}
                        <div className="border border-green-500/30 p-4 bg-green-900/10 relative overflow-hidden">
                            <div className="text-xs text-green-700 mb-2">ABBREVIATED_CODE:</div>
                            <p className="text-3xl md:text-4xl tracking-[0.2em] text-green-400 font-bold glow-text text-center">
                                {encrypted}
                            </p>
                            <div className="text-xs text-green-700 mt-3 text-center">
                                Decode: EXE = ? | OVER = ? | FLOW = ?
                            </div>
                        </div>

                        {/* Hint display */}
                        {showHint && (
                            <div className="border border-amber-500/30 p-3 bg-amber-900/10 text-amber-400 text-sm">
                                <span className="text-amber-600">&gt; HINT:</span> Full form starts with: <span className="font-bold">{getHintText()}</span>
                            </div>
                        )}

                        {/* Input area */}
                        <div className="mt-4">
                            <div className="text-xs text-green-700 mb-2">&gt; ENTER_FULL_OVERRIDE_CODE:</div>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value.toUpperCase())}
                                onKeyDown={(e) => e.key === 'Enter' && handleTypedSubmit()}
                                placeholder="TYPE FULL CODE..."
                                className={`
                                    w-full p-4 bg-black border-2 text-green-400 text-xl tracking-wider
                                    placeholder-green-900 outline-none uppercase font-mono
                                    ${error ? 'border-red-500 animate-shake' : 'border-green-700 focus:border-green-500'}
                                `}
                                disabled={submitting}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm animate-pulse">
                                &gt; ERROR: Invalid override sequence. {!showHint && 'Try again.'}
                            </div>
                        )}

                        <button
                            onClick={handleTypedSubmit}
                            disabled={!input.trim() || submitting}
                            className={`
                                w-full mt-4 p-4 border-2 text-lg font-bold tracking-widest uppercase transition-all
                                ${submitting
                                    ? 'bg-green-500 text-black border-green-500'
                                    : input.trim()
                                        ? 'bg-green-900/40 border-green-600 text-green-400 hover:bg-green-800/60'
                                        : 'bg-green-900/20 border-green-900 text-green-800 cursor-not-allowed'
                                }
                            `}
                        >
                            {submitting ? 'BUFFER CLEARED...' : 'SUBMIT OVERRIDE'}
                        </button>
                    </div>

                    <div className="mt-4 text-center text-xs text-green-800">
                        Decode the abbreviated error code and type the full phrase
                    </div>
                </div>
            </div>

            <style jsx>{`
                .glow-text {
                    text-shadow: 0 0 10px rgba(74, 222, 128, 0.7), 0 0 20px rgba(74, 222, 128, 0.5);
                }
                @keyframes scan {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
}
