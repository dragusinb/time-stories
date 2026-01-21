'use client';

import React, { useState, useRef } from 'react';
import { Minigame } from '@/types';
import { Star, RotateCcw, Check, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConstellationGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

interface StarPoint {
    id: string;
    x: number;
    y: number;
    name: string;
    order: number; // 0 = not part of pattern, 1+ = order in pattern
}

interface Line {
    from: string;
    to: string;
}

/**
 * ConstellationGame - Draw the Navigation Pattern
 *
 * Gameplay: Tap stars in the correct sequence to trace the navigation pattern.
 * The stars glow when hovered, and you must find the RIGHT stars in the RIGHT order.
 * Wrong star? Start over from the last correct one.
 *
 * Skill: Pattern recognition and memory. Which stars connect to form Orion's belt?
 */
const ConstellationGame: React.FC<ConstellationGameProps> = ({ minigame, onComplete, theme = 'apollo' }) => {
    // Orion-like constellation pattern (simplified for kids)
    const [stars] = useState<StarPoint[]>([
        // The pattern stars (numbered in connection order)
        { id: 'betelgeuse', x: 25, y: 20, name: 'Betelgeuse', order: 1 },
        { id: 'bellatrix', x: 55, y: 22, name: 'Bellatrix', order: 2 },
        { id: 'mintaka', x: 32, y: 45, name: 'Mintaka', order: 3 },
        { id: 'alnilam', x: 42, y: 47, name: 'Alnilam', order: 4 },
        { id: 'alnitak', x: 52, y: 49, name: 'Alnitak', order: 5 },
        { id: 'saiph', x: 28, y: 75, name: 'Saiph', order: 6 },
        { id: 'rigel', x: 58, y: 78, name: 'Rigel', order: 7 },
        // Distractor stars (order: 0)
        { id: 'd1', x: 15, y: 35, name: '', order: 0 },
        { id: 'd2', x: 75, y: 40, name: '', order: 0 },
        { id: 'd3', x: 85, y: 20, name: '', order: 0 },
        { id: 'd4', x: 10, y: 60, name: '', order: 0 },
        { id: 'd5', x: 80, y: 65, name: '', order: 0 },
        { id: 'd6', x: 45, y: 12, name: '', order: 0 },
        { id: 'd7', x: 70, y: 85, name: '', order: 0 },
        { id: 'd8', x: 20, y: 90, name: '', order: 0 },
    ]);

    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [lines, setLines] = useState<Line[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [shake, setShake] = useState(false);
    const [hintShown, setHintShown] = useState(false);
    const [mistakes, setMistakes] = useState(0);

    const patternStars = stars.filter(s => s.order > 0).sort((a, b) => a.order - b.order);
    const currentStep = selectedStars.length;
    const nextStar = patternStars[currentStep];

    const isApollo = theme === 'apollo';

    const handleStarClick = (star: StarPoint) => {
        if (isComplete) return;

        // Check if this is the next correct star
        if (star.id === nextStar?.id) {
            // Correct!
            const newSelected = [...selectedStars, star.id];
            setSelectedStars(newSelected);

            // Add connecting line if not the first star
            if (selectedStars.length > 0) {
                const prevStarId = selectedStars[selectedStars.length - 1];
                setLines(prev => [...prev, { from: prevStarId, to: star.id }]);
            }

            // Check for completion
            if (newSelected.length === patternStars.length) {
                setIsComplete(true);
                const score = Math.max(60, 100 - mistakes * 10);
                setTimeout(() => onComplete(score), 2000);
            }
        } else {
            // Wrong star!
            setShake(true);
            setMistakes(prev => prev + 1);
            setTimeout(() => setShake(false), 500);

            // Show hint after 3 mistakes
            if (mistakes >= 2 && !hintShown) {
                setHintShown(true);
            }
        }
    };

    const handleReset = () => {
        setSelectedStars([]);
        setLines([]);
        setIsComplete(false);
        setShake(false);
    };

    const getStarById = (id: string) => stars.find(s => s.id === id);

    // Is this star the next one in sequence?
    const isNextStar = (star: StarPoint) => star.id === nextStar?.id;
    // Is this star already selected?
    const isSelected = (star: StarPoint) => selectedStars.includes(star.id);
    // Is this star part of the pattern?
    const isPatternStar = (star: StarPoint) => star.order > 0;

    return (
        <div className={`
            flex flex-col items-center gap-3 p-4 md:p-6 rounded-xl border-2
            ${isApollo
                ? 'bg-slate-950 border-green-900/50'
                : 'bg-slate-900 border-slate-700'
            }
        `}>
            {/* Header */}
            <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">{minigame.question}</h3>
                <p className={`text-xs md:text-sm ${isApollo ? 'text-green-600' : 'text-slate-400'}`}>
                    Tap the bright stars in order to trace the navigation pattern
                </p>
            </div>

            {/* Progress & Controls */}
            <div className="flex items-center justify-between w-full max-w-sm">
                <div className="flex items-center gap-2">
                    <Compass className={`w-4 h-4 ${isApollo ? 'text-green-500' : 'text-amber-500'}`} />
                    <span className={`text-sm font-mono ${isApollo ? 'text-green-400' : 'text-white'}`}>
                        {currentStep}/{patternStars.length} stars
                    </span>
                </div>
                <button
                    onClick={handleReset}
                    disabled={isComplete}
                    className={`
                        p-2 rounded-lg transition-colors
                        ${isApollo
                            ? 'bg-green-900/30 text-green-500 hover:bg-green-900/50'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }
                        disabled:opacity-50
                    `}
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            {/* Star Field */}
            <div
                className={`
                    relative w-full aspect-square max-w-sm rounded-xl overflow-hidden
                    ${isApollo ? 'bg-black' : 'bg-slate-900'}
                    ${shake ? 'animate-shake' : ''}
                `}
                style={{
                    animation: shake ? 'shake 0.3s ease-in-out' : undefined,
                }}
            >
                {/* Tiny background stars */}
                {Array.from({ length: 80 }).map((_, i) => (
                    <div
                        key={`bg-${i}`}
                        className="absolute rounded-full bg-white/20"
                        style={{
                            width: Math.random() > 0.7 ? '2px' : '1px',
                            height: Math.random() > 0.7 ? '2px' : '1px',
                            left: `${(i * 17 + Math.random() * 10) % 100}%`,
                            top: `${(i * 23 + Math.random() * 10) % 100}%`,
                            opacity: 0.3 + Math.random() * 0.3,
                        }}
                    />
                ))}

                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    {lines.map((line, i) => {
                        const fromStar = getStarById(line.from);
                        const toStar = getStarById(line.to);
                        if (!fromStar || !toStar) return null;

                        return (
                            <motion.line
                                key={`line-${i}`}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                x1={`${fromStar.x}%`}
                                y1={`${fromStar.y}%`}
                                x2={`${toStar.x}%`}
                                y2={`${toStar.y}%`}
                                stroke={isComplete ? '#22c55e' : isApollo ? '#4ade80' : '#fbbf24'}
                                strokeWidth="2"
                                strokeLinecap="round"
                                filter="url(#glow)"
                            />
                        );
                    })}
                </svg>

                {/* Interactive stars */}
                {stars.map((star) => {
                    const selected = isSelected(star);
                    const isPattern = isPatternStar(star);
                    const isNext = isNextStar(star);

                    return (
                        <motion.button
                            key={star.id}
                            onClick={() => handleStarClick(star)}
                            disabled={isComplete || selected}
                            className={`
                                absolute transform -translate-x-1/2 -translate-y-1/2
                                rounded-full flex items-center justify-center
                                transition-all duration-200
                                ${isPattern
                                    ? selected
                                        ? 'w-7 h-7 md:w-9 md:h-9 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]'
                                        : isNext && hintShown
                                            ? 'w-6 h-6 md:w-8 md:h-8 bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse'
                                            : 'w-5 h-5 md:w-7 md:h-7 bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.5)] hover:scale-125 hover:shadow-[0_0_20px_rgba(251,191,36,0.8)]'
                                    : 'w-2 h-2 md:w-2.5 md:h-2.5 bg-white/30 hover:bg-white/50'
                                }
                            `}
                            style={{ left: `${star.x}%`, top: `${star.y}%` }}
                            whileHover={!selected && isPattern ? { scale: 1.3 } : {}}
                            whileTap={{ scale: 0.9 }}
                            animate={selected ? { scale: [1, 1.3, 1] } : {}}
                        >
                            {isPattern && selected && (
                                <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                            )}
                            {isPattern && !selected && (
                                <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-800" fill="currentColor" />
                            )}
                        </motion.button>
                    );
                })}

                {/* Star names appear when selected */}
                <AnimatePresence>
                    {selectedStars.map(starId => {
                        const star = getStarById(starId);
                        if (!star || !star.name) return null;

                        return (
                            <motion.div
                                key={`name-${starId}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`
                                    absolute text-[10px] md:text-xs font-mono pointer-events-none whitespace-nowrap
                                    ${isApollo ? 'text-green-400' : 'text-amber-300'}
                                `}
                                style={{
                                    left: `${star.x}%`,
                                    top: `${star.y + 5}%`,
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                {star.name}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Completion overlay */}
                <AnimatePresence>
                    {isComplete && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-green-900/40 flex items-center justify-center"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', damping: 15 }}
                                className="text-center"
                            >
                                <Compass className="w-16 h-16 text-green-400 mx-auto mb-2" />
                                <div className="text-green-400 font-bold text-lg">Navigation Locked!</div>
                                <div className="text-green-600 text-sm">Course plotted successfully</div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Hint text */}
            <div className={`text-xs text-center ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>
                {hintShown ? (
                    <span className="text-amber-400">Hint: Look for the brightest pulsing star!</span>
                ) : currentStep === 0 ? (
                    <span>Start with the brightest star in the top-left area</span>
                ) : (
                    <span>Find the next navigation star to continue the pattern</span>
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                    <span className={isApollo ? 'text-green-600' : 'text-slate-400'}>Navigation Star</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className={isApollo ? 'text-green-600' : 'text-slate-400'}>Locked</span>
                </div>
            </div>

            {/* Educational Tip */}
            <div className={`text-xs text-center max-w-xs ${isApollo ? 'text-green-700' : 'text-slate-500'}`}>
                <strong>Did you know?</strong> Apollo astronauts memorized 37 navigation stars.
                They used a sextant to align with these stars and calculate their position in space!
            </div>

            {/* CSS for shake animation */}
            <style jsx>{`
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
};

export default ConstellationGame;
