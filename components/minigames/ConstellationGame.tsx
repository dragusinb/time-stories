'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Minigame } from '@/types';
import { Star, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConstellationGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

interface StarPoint {
    id: number;
    x: number;
    y: number;
    name: string;
    isTarget: boolean;
}

/**
 * ConstellationGame - A kid-friendly star navigation game
 *
 * Educational concept: Apollo astronauts used stars to navigate in space.
 * They would align their spacecraft with specific bright stars.
 *
 * Gameplay: Tap all the highlighted (target) stars to complete navigation.
 * Order doesn't matter - just find and tap all the bright stars!
 */
const ConstellationGame: React.FC<ConstellationGameProps> = ({ minigame, onComplete, theme = 'apollo' }) => {
    // Star field - some are targets (navigation stars), others are background
    const [stars] = useState<StarPoint[]>([
        // Target stars (the ones to find)
        { id: 1, x: 25, y: 20, name: 'Polaris', isTarget: true },
        { id: 2, x: 50, y: 35, name: 'Vega', isTarget: true },
        { id: 3, x: 75, y: 25, name: 'Arcturus', isTarget: true },
        { id: 4, x: 40, y: 60, name: 'Sirius', isTarget: true },
        { id: 5, x: 65, y: 70, name: 'Canopus', isTarget: true },
        // Background stars (distractors)
        { id: 6, x: 15, y: 45, name: '', isTarget: false },
        { id: 7, x: 85, y: 50, name: '', isTarget: false },
        { id: 8, x: 30, y: 80, name: '', isTarget: false },
        { id: 9, x: 55, y: 15, name: '', isTarget: false },
        { id: 10, x: 80, y: 85, name: '', isTarget: false },
        { id: 11, x: 10, y: 70, name: '', isTarget: false },
        { id: 12, x: 90, y: 30, name: '', isTarget: false },
    ]);

    const [selectedStars, setSelectedStars] = useState<number[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [wrongClick, setWrongClick] = useState(false);

    const targetStars = stars.filter(s => s.isTarget);
    const targetsFound = selectedStars.filter(id => stars.find(s => s.id === id)?.isTarget).length;
    const totalTargets = targetStars.length;
    const progress = Math.round((targetsFound / totalTargets) * 100);

    const handleStarClick = (star: StarPoint) => {
        if (isComplete) return;

        if (star.isTarget) {
            // Correct - it's a navigation star
            if (!selectedStars.includes(star.id)) {
                const newSelected = [...selectedStars, star.id];
                setSelectedStars(newSelected);

                // Check if all targets found
                const foundTargets = newSelected.filter(id => stars.find(s => s.id === id)?.isTarget).length;
                if (foundTargets === totalTargets) {
                    setIsComplete(true);
                    setTimeout(() => onComplete(100), 1500);
                }
            }
        } else {
            // Wrong star - give feedback but don't penalize harshly
            setWrongClick(true);
            setTimeout(() => setWrongClick(false), 500);
        }
    };

    const handleReset = () => {
        setSelectedStars([]);
        setIsComplete(false);
    };

    const isApollo = theme === 'apollo';

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
                    Tap the bright navigation stars to align your spacecraft
                </p>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-4 w-full max-w-xs">
                <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                        <span className={isApollo ? 'text-green-600' : 'text-slate-400'}>Stars Found</span>
                        <span className={isApollo ? 'text-green-400' : 'text-white'}>{targetsFound}/{totalTargets}</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isApollo ? 'bg-black' : 'bg-slate-800'}`}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={`h-full ${isApollo ? 'bg-green-500' : 'bg-amber-500'}`}
                        />
                    </div>
                </div>
                <button
                    onClick={handleReset}
                    className={`p-2 rounded-lg ${isApollo ? 'bg-green-900/30 text-green-500 hover:bg-green-900/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            {/* Star Field */}
            <div
                className={`
                    relative w-full aspect-square max-w-sm rounded-xl overflow-hidden
                    ${isApollo ? 'bg-black' : 'bg-slate-900'}
                    ${wrongClick ? 'animate-pulse ring-2 ring-red-500' : ''}
                `}
            >
                {/* Background stars (tiny dots) */}
                {Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={`bg-${i}`}
                        className="absolute w-0.5 h-0.5 bg-white/30 rounded-full"
                        style={{
                            left: `${(i * 17 + 7) % 100}%`,
                            top: `${(i * 23 + 11) % 100}%`,
                        }}
                    />
                ))}

                {/* Connection lines between found stars */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {selectedStars.map((starId, index) => {
                        if (index === 0) return null;
                        const prevStar = stars.find(s => s.id === selectedStars[index - 1]);
                        const currStar = stars.find(s => s.id === starId);
                        if (!prevStar || !currStar || !prevStar.isTarget || !currStar.isTarget) return null;

                        return (
                            <motion.line
                                key={`line-${index}`}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                x1={`${prevStar.x}%`}
                                y1={`${prevStar.y}%`}
                                x2={`${currStar.x}%`}
                                y2={`${currStar.y}%`}
                                stroke={isApollo ? '#22c55e' : '#f59e0b'}
                                strokeWidth="2"
                                strokeLinecap="round"
                                opacity={0.6}
                            />
                        );
                    })}
                </svg>

                {/* Interactive stars */}
                {stars.map((star) => {
                    const isSelected = selectedStars.includes(star.id);
                    const isTargetStar = star.isTarget;

                    return (
                        <motion.button
                            key={star.id}
                            onClick={() => handleStarClick(star)}
                            disabled={isComplete}
                            className={`
                                absolute transform -translate-x-1/2 -translate-y-1/2
                                rounded-full flex items-center justify-center
                                transition-all
                                ${isTargetStar
                                    ? isSelected
                                        ? 'w-8 h-8 md:w-10 md:h-10 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]'
                                        : 'w-6 h-6 md:w-8 md:h-8 bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] hover:scale-125'
                                    : 'w-2 h-2 md:w-3 md:h-3 bg-white/40 hover:bg-white/60'
                                }
                            `}
                            style={{ left: `${star.x}%`, top: `${star.y}%` }}
                            whileHover={!isSelected ? { scale: 1.3 } : {}}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isTargetStar && isSelected && (
                                <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            )}
                            {isTargetStar && !isSelected && (
                                <Star className="w-3 h-3 md:w-4 md:h-4 text-amber-900" fill="currentColor" />
                            )}
                        </motion.button>
                    );
                })}

                {/* Star names (show when selected) */}
                <AnimatePresence>
                    {selectedStars.map(starId => {
                        const star = stars.find(s => s.id === starId);
                        if (!star || !star.name) return null;

                        return (
                            <motion.div
                                key={`name-${starId}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`
                                    absolute text-xs font-mono pointer-events-none
                                    ${isApollo ? 'text-green-400' : 'text-amber-400'}
                                `}
                                style={{
                                    left: `${star.x}%`,
                                    top: `${star.y + 8}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                {star.name}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Complete overlay */}
                <AnimatePresence>
                    {isComplete && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-green-900/50 flex items-center justify-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-center"
                            >
                                <Check className="w-16 h-16 text-green-400 mx-auto mb-2" />
                                <div className="text-green-400 font-bold text-lg">Navigation Locked!</div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
                    <span className={isApollo ? 'text-green-600' : 'text-slate-400'}>Navigation Star</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className={isApollo ? 'text-green-600' : 'text-slate-400'}>Found</span>
                </div>
            </div>

            {/* Educational Tip */}
            <div className={`text-xs text-center max-w-xs ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>
                <strong>Did you know?</strong> Apollo astronauts used 37 navigation stars to orient
                their spacecraft. Polaris (the North Star) was especially important!
            </div>
        </div>
    );
};

export default ConstellationGame;
