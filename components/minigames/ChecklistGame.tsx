'use client';

import React, { useState } from 'react';
import { Minigame } from '@/types';
import { Check, Square, CheckSquare, AlertTriangle, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChecklistGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

interface ChecklistItem {
    id: string;
    system: string;
    status: 'nominal' | 'caution' | 'warning';
    checked: boolean;
    fixed: boolean; // Whether caution item has been fixed
    description: string;
    cautionDescription?: string;
    fixAction?: string;
}

/**
 * ChecklistGame - Systems Verification (Redesigned)
 *
 * NEW CHALLENGE: Some systems randomly show CAUTION status.
 * You must IDENTIFY and FIX these issues before confirming.
 * Blindly clicking won't work - you need to pay attention!
 *
 * - Nominal items: Just verify (tap once)
 * - Caution items: Tap to see issue, then tap FIX button
 * - Must fix ALL cautions before confirming re-entry
 */
const ChecklistGame: React.FC<ChecklistGameProps> = ({ minigame, onComplete, theme = 'apollo' }) => {
    // Initialize with random caution items
    const [items, setItems] = useState<ChecklistItem[]>(() => {
        const baseItems: ChecklistItem[] = [
            { id: 'heatshield', system: 'Heat Shield', status: 'nominal', checked: false, fixed: false, description: 'Ablative shield temperature sensors normal', cautionDescription: 'Sensor 3 showing elevated temperature!', fixAction: 'Recalibrate sensor' },
            { id: 'chutes', system: 'Parachutes', status: 'nominal', checked: false, fixed: false, description: 'Drogue and main chute deployment armed', cautionDescription: 'Drogue release pyro shows low continuity!', fixAction: 'Switch to backup circuit' },
            { id: 'attitude', system: 'Attitude Control', status: 'nominal', checked: false, fixed: false, description: 'RCS thrusters pressurized and ready', cautionDescription: 'Roll thruster B pressure dropping!', fixAction: 'Isolate and compensate' },
            { id: 'comms', system: 'Communications', status: 'nominal', checked: false, fixed: false, description: 'S-band antenna configured for blackout recovery', cautionDescription: 'Antenna gimbal showing intermittent lock!', fixAction: 'Reset gimbal motor' },
            { id: 'power', system: 'Electrical Power', status: 'nominal', checked: false, fixed: false, description: 'Battery charge at 94%, sufficient for re-entry', cautionDescription: 'Battery C showing voltage fluctuation!', fixAction: 'Switch to battery redundancy' },
            { id: 'lifesupport', system: 'Life Support', status: 'nominal', checked: false, fixed: false, description: 'O2 and CO2 levels within parameters', cautionDescription: 'CO2 scrubber efficiency at 78%!', fixAction: 'Increase fan speed' },
        ];

        // Randomly set 1-2 items to caution
        const shuffled = [...baseItems].sort(() => Math.random() - 0.5);
        const numCautions = Math.random() > 0.5 ? 2 : 1;
        for (let i = 0; i < numCautions; i++) {
            shuffled[i].status = 'caution';
        }

        return baseItems; // Return in original order but with random cautions
    });

    const [isComplete, setIsComplete] = useState(false);
    const [allGo, setAllGo] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const isApollo = theme === 'apollo';
    const checkedCount = items.filter(i => i.checked).length;
    const allChecked = checkedCount === items.length;
    const cautionItems = items.filter(i => i.status === 'caution');
    const unfixedCautions = cautionItems.filter(i => !i.fixed);
    const allCautionsFixed = unfixedCautions.length === 0;

    const handleCheck = (itemId: string) => {
        if (isComplete) return;

        const item = items.find(i => i.id === itemId);
        if (!item) return;

        // If it's a caution item and not yet checked, show the warning first
        if (item.status === 'caution' && !item.checked) {
            setSelectedItem(itemId);
            setItems(prev => prev.map(i =>
                i.id === itemId ? { ...i, checked: true } : i
            ));
        } else if (item.status === 'nominal') {
            // Nominal items just get checked
            setItems(prev => prev.map(i =>
                i.id === itemId ? { ...i, checked: true } : i
            ));
        }
    };

    const handleFix = (itemId: string) => {
        if (isComplete) return;

        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, fixed: true, status: 'nominal' } : item
        ));
        setSelectedItem(null);
    };

    const handleConfirmAll = () => {
        if (!allChecked || isComplete) return;

        // Check if there are unfixed caution items
        if (!allCautionsFixed) {
            // Don't allow - need to fix cautions first
            return;
        }

        setAllGo(true);
        setIsComplete(true);
        // Score based on how quickly they fixed issues
        const score = 100;
        setTimeout(() => onComplete(score), 1500);
    };

    const getStatusColor = (status: string, checked: boolean) => {
        if (!checked) return isApollo ? 'text-slate-500' : 'text-slate-400';
        switch (status) {
            case 'nominal': return 'text-green-400';
            case 'caution': return 'text-amber-400';
            case 'warning': return 'text-red-400';
            default: return 'text-slate-400';
        }
    };

    const getStatusBg = (status: string, checked: boolean) => {
        if (!checked) return isApollo ? 'bg-slate-900' : 'bg-slate-800';
        switch (status) {
            case 'nominal': return 'bg-green-900/30';
            case 'caution': return 'bg-amber-900/30';
            case 'warning': return 'bg-red-900/30';
            default: return 'bg-slate-800';
        }
    };

    return (
        <div className={`
            flex flex-col items-center gap-4 p-4 md:p-6 rounded-xl border-2
            ${isApollo
                ? 'bg-slate-950 border-green-900/50'
                : 'bg-slate-900 border-slate-700'
            }
        `}>
            {/* Header */}
            <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">{minigame.question}</h3>
                <p className={`text-xs md:text-sm ${isApollo ? 'text-green-600' : 'text-slate-400'}`}>
                    Verify each system is GO for re-entry
                </p>
            </div>

            {/* Progress */}
            <div className={`
                w-full max-w-md px-4 py-2 rounded-lg border
                ${isApollo ? 'bg-black border-green-900' : 'bg-slate-800 border-slate-600'}
            `}>
                <div className="flex items-center justify-between text-sm">
                    <span className={isApollo ? 'text-green-600' : 'text-slate-400'}>
                        Systems Verified
                    </span>
                    <span className={`font-mono ${allChecked ? 'text-green-400' : isApollo ? 'text-green-500' : 'text-white'}`}>
                        {checkedCount}/{items.length}
                    </span>
                </div>
            </div>

            {/* Checklist */}
            <div className={`
                w-full max-w-md rounded-lg border overflow-hidden
                ${isApollo ? 'border-green-900 bg-black' : 'border-slate-700 bg-slate-800'}
            `}>
                {/* Header row */}
                <div className={`
                    px-4 py-2 border-b text-xs uppercase tracking-wider font-mono
                    ${isApollo ? 'bg-green-900/30 border-green-900 text-green-500' : 'bg-slate-700 border-slate-600 text-slate-400'}
                `}>
                    Re-Entry Systems Checklist
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-800">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className={`${getStatusBg(item.status, item.checked)}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <button
                                onClick={() => handleCheck(item.id)}
                                disabled={item.checked || isComplete}
                                className={`
                                    w-full px-4 py-3 flex items-start gap-3 text-left transition-all
                                    ${!item.checked && !isComplete ? 'hover:bg-green-900/20 cursor-pointer' : ''}
                                    disabled:cursor-default
                                `}
                            >
                                {/* Checkbox */}
                                <div className={`mt-0.5 ${getStatusColor(item.status, item.checked)}`}>
                                    {item.checked ? (
                                        <CheckSquare className="w-5 h-5" />
                                    ) : (
                                        <Square className="w-5 h-5" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className={`font-medium ${item.checked ? 'text-white' : isApollo ? 'text-green-300' : 'text-slate-300'}`}>
                                            {item.system}
                                        </span>
                                        {item.checked && (
                                            <span className={`
                                                text-xs font-mono px-2 py-0.5 rounded
                                                ${item.status === 'nominal'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : item.status === 'caution'
                                                        ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                                                        : 'bg-red-500/20 text-red-400'
                                                }
                                            `}>
                                                {item.status === 'nominal' ? 'GO' : item.fixed ? 'FIXED' : 'CAUTION'}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs mt-1 ${item.checked ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {item.checked
                                            ? item.status === 'caution' && !item.fixed
                                                ? item.cautionDescription
                                                : item.description
                                            : 'Tap to verify...'}
                                    </p>
                                </div>
                            </button>

                            {/* Fix Button for Caution Items */}
                            {item.checked && item.status === 'caution' && !item.fixed && !isComplete && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="px-4 pb-3"
                                >
                                    <button
                                        onClick={() => handleFix(item.id)}
                                        className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
                                    >
                                        <AlertTriangle className="w-4 h-4" />
                                        {item.fixAction || 'Apply Fix'}
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Status Summary */}
            <AnimatePresence>
                {allChecked && !isComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`
                            w-full max-w-md px-4 py-3 rounded-lg border text-center
                            ${allCautionsFixed
                                ? isApollo
                                    ? 'bg-green-900/30 border-green-600 text-green-400'
                                    : 'bg-green-900/30 border-green-600 text-green-400'
                                : 'bg-amber-900/30 border-amber-600 text-amber-400'
                            }
                        `}
                    >
                        {allCautionsFixed ? (
                            <>
                                <div className="font-bold uppercase tracking-wider">All Systems GO</div>
                                <div className="text-xs opacity-80 mt-1">Ready for re-entry confirmation</div>
                            </>
                        ) : (
                            <>
                                <div className="font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    {unfixedCautions.length} CAUTION{unfixedCautions.length > 1 ? 'S' : ''} DETECTED
                                </div>
                                <div className="text-xs opacity-80 mt-1">Fix all issues before confirming</div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirm Button */}
            <motion.button
                onClick={handleConfirmAll}
                disabled={!allChecked || !allCautionsFixed || isComplete}
                className={`
                    w-full max-w-md py-4 rounded-xl text-lg font-bold uppercase tracking-wider
                    flex items-center justify-center gap-2 transition-all
                    ${isComplete
                        ? 'bg-green-600 text-white'
                        : allChecked && allCautionsFixed
                            ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                            : allChecked && !allCautionsFixed
                                ? 'bg-amber-700 text-amber-200 cursor-not-allowed'
                                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }
                `}
                whileTap={allChecked && allCautionsFixed && !isComplete ? { scale: 0.95 } : {}}
            >
                {isComplete ? (
                    <>
                        <Check className="w-5 h-5" />
                        GO for Re-Entry!
                    </>
                ) : allChecked && allCautionsFixed ? (
                    <>
                        <Rocket className="w-5 h-5" />
                        Confirm All Systems GO
                    </>
                ) : allChecked && !allCautionsFixed ? (
                    <>
                        <AlertTriangle className="w-5 h-5" />
                        Fix Cautions First!
                    </>
                ) : (
                    <>
                        <AlertTriangle className="w-5 h-5" />
                        Verify All Systems
                    </>
                )}
            </motion.button>

            {/* Educational Tip */}
            <div className={`text-xs text-center max-w-xs ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>
                <strong>Did you know?</strong> Apollo astronauts used hundreds of checklist pages.
                The re-entry checklist was critical - at 25,000 mph, there was no room for error.
                The heat shield reached 5,000°F (2,760°C) during re-entry!
            </div>
        </div>
    );
};

export default ChecklistGame;
