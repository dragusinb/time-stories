import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';
import { HeartPulse, User, Coins, Cross, Box, Camera, Footprints, AlertTriangle } from 'lucide-react';

interface TriageGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

/**
 * TriageGame - Weight Management Challenge (Redesigned)
 *
 * NEW CHALLENGE: You must select items to JETTISON to reduce weight.
 * Each item has a weight. You need to jettison enough to get under the limit.
 * But be careful - some items are more valuable than others!
 *
 * - Must jettison at least 25 lbs to launch safely
 * - Moon rocks should NEVER be jettisoned (instant fail)
 * - Score based on what you keep vs. what you throw away
 */
const TriageGame: React.FC<TriageGameProps> = ({ minigame, onComplete, theme = 'medieval' }) => {
    const [jettisoned, setJettisoned] = useState<Set<number>>(new Set());
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState(theme === 'apollo'
        ? "OVERWEIGHT BY 25 LBS. Select items to jettison."
        : "One dose left. Choose wisely.");

    const isApollo = theme === 'apollo';

    // Medieval Patients (unchanged)
    const patients = [
        { id: 0, name: "Merchant", desc: "Offers gold. Funds the hospital.", status: "Critical", weight: 0 },
        { id: 1, name: "Baker", desc: "Young. Feeds the poor.", status: "Critical", weight: 0 },
        { id: 2, name: "Priest", desc: "Old. Comforts the dying.", status: "Stable", weight: 0 },
        { id: 3, name: "Yourself", desc: "Exhausted. Essential to save others.", status: "Stable", weight: 0 }
    ];

    // Apollo Cargo - redesigned with weights and values
    // Must jettison 25+ lbs. Moon rocks = mission failure if jettisoned
    const cargo = [
        { id: 0, name: "PLSS Backpack", desc: "Life support. Empty. 21 lbs.", status: "10 lbs", weight: 21, isCritical: false },
        { id: 1, name: "Lunar Overshoes", desc: "Contaminated boots. 4 lbs each.", status: "8 lbs", weight: 8, isCritical: false },
        { id: 2, name: "Hasselblad Camera", desc: "Film removed. Body only. 5 lbs.", status: "5 lbs", weight: 5, isCritical: false },
        { id: 3, name: "Food Packs", desc: "Emergency rations. 3 days worth.", status: "6 lbs", weight: 6, isCritical: false },
        { id: 4, name: "Urine Collection", desc: "Full bags. Gross but heavy.", status: "11 lbs", weight: 11, isCritical: false },
        { id: 5, name: "Moon Rock Box", desc: "47.5 lbs of lunar samples.", status: "47 lbs", weight: 47, isCritical: true },
    ];

    const items = isApollo ? cargo : patients;
    const WEIGHT_TO_LOSE = 25;

    const jettisonedWeight = isApollo
        ? Array.from(jettisoned).reduce((sum, id) => sum + (cargo.find(c => c.id === id)?.weight || 0), 0)
        : 0;

    const isEnoughJettisoned = jettisonedWeight >= WEIGHT_TO_LOSE;
    const hasCriticalJettisoned = isApollo && Array.from(jettisoned).some(id => cargo.find(c => c.id === id)?.isCritical);

    const toggleJettison = (id: number) => {
        if (submitted) return;
        const newSet = new Set(jettisoned);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setJettisoned(newSet);
    };

    const handleSubmit = () => {
        if (isApollo) {
            if (!isEnoughJettisoned) return;
            setSubmitted(true);

            if (hasCriticalJettisoned) {
                setMessage("MISSION FAILURE: You jettisoned the moon rocks!");
                setTimeout(() => onComplete(0), 2000);
            } else {
                // Score based on how close to minimum jettison (less wasted = better)
                const wastedWeight = jettisonedWeight - WEIGHT_TO_LOSE;
                const score = Math.max(60, 100 - wastedWeight * 2);
                setMessage(`Launch weight achieved! Jettisoned ${jettisonedWeight} lbs.`);
                setTimeout(() => onComplete(score), 2000);
            }
        } else {
            // Medieval logic unchanged
            const selected = Array.from(jettisoned)[0];
            setSubmitted(true);
            if (selected === 1) {
                setMessage("Ethical choice made. The Baker survives.");
                setTimeout(() => onComplete(100), 2000);
            } else {
                setMessage("Choice recorded. Consequences unknown.");
                setTimeout(() => onComplete(50), 2000);
            }
        }
    };

    const apolloEmojis: Record<number, string> = { 0: '🎒', 1: '👢', 2: '📷', 3: '🥫', 4: '💧', 5: '🪨' };
    const medievalEmojis: Record<number, string> = { 0: '💰', 1: '🍞', 2: '✝️', 3: '💔' };

    return (
        <div className={`flex flex-col items-center space-y-4 p-6 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] ${isApollo ? 'bg-black border-green-900 text-green-500' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>
            <div className="text-center">
                <h3 className={`text-xl font-serif mb-2 tracking-widest uppercase ${isApollo ? 'text-green-500 font-mono' : 'text-red-400'}`}>{minigame.question}</h3>
                <p className={`text-xs font-mono ${isApollo ? 'text-green-700' : 'text-slate-400'}`}>
                    {isApollo ? 'Tap items to mark for jettison. Must lose 25+ lbs.' : minigame.instructions}
                </p>
            </div>

            {/* Weight Progress (Apollo only) */}
            {isApollo && (
                <div className={`w-full max-w-md px-4 py-2 rounded border ${
                    hasCriticalJettisoned
                        ? 'bg-red-900/30 border-red-600'
                        : isEnoughJettisoned
                            ? 'bg-green-900/30 border-green-600'
                            : 'bg-slate-900 border-green-900'
                }`}>
                    <div className="flex justify-between items-center text-sm font-mono">
                        <span>Jettison Weight:</span>
                        <span className={`font-bold ${
                            hasCriticalJettisoned ? 'text-red-400' : isEnoughJettisoned ? 'text-green-400' : 'text-amber-400'
                        }`}>
                            {jettisonedWeight} / {WEIGHT_TO_LOSE} lbs
                        </span>
                    </div>
                    {hasCriticalJettisoned && (
                        <div className="text-red-400 text-xs mt-1 animate-pulse">
                            WARNING: Moon rocks marked for jettison!
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 gap-3 w-full max-w-md font-pixel">
                {items.map((p) => {
                    const isJettisoned = jettisoned.has(p.id);
                    const isCriticalItem = isApollo && (p as typeof cargo[0]).isCritical;

                    return (
                        <button
                            key={p.id}
                            onClick={() => toggleJettison(p.id)}
                            disabled={submitted}
                            className={`
                                flex items-center gap-4 p-3 border-2 transition-all relative
                                ${isJettisoned
                                    ? isCriticalItem
                                        ? 'bg-red-900/40 border-red-500'
                                        : 'bg-amber-900/40 border-amber-500 opacity-60'
                                    : isApollo
                                        ? 'bg-black border-green-900 hover:bg-green-900/20'
                                        : 'bg-slate-900 border-slate-700 hover:bg-slate-800'
                                }
                                ${submitted && !isJettisoned ? 'opacity-50' : ''}
                            `}
                        >
                            {/* Jettison indicator */}
                            {isJettisoned && (
                                <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                                    JETTISON
                                </div>
                            )}

                            <div className={`w-10 h-10 flex items-center justify-center border-2 ${
                                isApollo ? 'bg-black border-green-900' : 'bg-slate-800 border-slate-600'
                            } ${isJettisoned ? 'grayscale' : ''}`}>
                                <span className="text-xl">
                                    {isApollo ? apolloEmojis[p.id] : medievalEmojis[p.id]}
                                </span>
                            </div>
                            <div className="text-left flex-1">
                                <div className="flex justify-between">
                                    <span className={`font-bold text-sm ${
                                        isJettisoned
                                            ? 'text-slate-500 line-through'
                                            : isApollo ? 'text-green-400 font-mono' : 'text-slate-200'
                                    }`}>{p.name}</span>
                                    <span className={`text-xs font-mono ${
                                        isCriticalItem ? 'text-red-400 animate-pulse' : 'text-green-700'
                                    }`}>
                                        {p.status}
                                    </span>
                                </div>
                                <p className={`text-xs ${isApollo ? 'text-green-700 font-mono' : 'text-slate-500'}`}>{p.desc}</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className={`min-h-8 font-bold font-mono text-sm text-center ${
                hasCriticalJettisoned ? 'text-red-400' : isApollo ? 'text-green-600' : 'text-slate-300'
            }`}>
                {message}
            </div>

            <Button
                onClick={handleSubmit}
                disabled={isApollo ? (!isEnoughJettisoned || submitted) : (jettisoned.size === 0 || submitted)}
                className={`w-full py-4 text-lg border-b-4 border-r-4 active:border-0 active:translate-y-1 active:translate-x-1 outline-none transition-none
                    ${isApollo
                        ? hasCriticalJettisoned
                            ? 'bg-red-600 text-white border-red-900 hover:bg-red-500 font-mono'
                            : 'bg-green-600 text-black border-green-900 hover:bg-green-500 font-mono disabled:opacity-50 disabled:bg-green-900 disabled:text-green-700'
                        : 'pixel-btn-primary'
                    }`}
            >
                {submitted
                    ? (isApollo ? 'JETTISONING...' : 'ADMINISTERING...')
                    : isApollo
                        ? isEnoughJettisoned
                            ? 'CONFIRM JETTISON'
                            : `NEED ${WEIGHT_TO_LOSE - jettisonedWeight} MORE LBS`
                        : 'CONFIRM TRIAGE'}
            </Button>
        </div>
    );
};

export default TriageGame;
