'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Minigame } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Rat, Timer, Trophy } from 'lucide-react';

interface RatCatcherGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

interface RatEntity {
    id: number;
    delay: number;
    duration: number;
    y: number; // Vertical lane (10-90%)
    size: number;
}

export const RatCatcherGame: React.FC<RatCatcherGameProps> = ({ minigame, onComplete }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [activeRats, setActiveRats] = useState<RatEntity[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [clickFeedback, setClickFeedback] = useState<{ x: number, y: number, id: number }[]>([]);

    // Determine target score from props or default
    const TARGET_SCORE = 3;

    // Game Timer
    useEffect(() => {
        if (gameOver) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameOver(true);
                    onComplete(0); // Fail if time runs out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameOver, onComplete]);

    // Rat Spawner
    useEffect(() => {
        if (gameOver) return;

        // Spawn a burst of rats initially, then trickle
        const initialRats = Array.from({ length: 3 }).map((_, i) => createRat(i));
        setActiveRats(initialRats);

        const spawner = setInterval(() => {
            setActiveRats(prev => {
                if (prev.length >= 5) return prev; // Max rats onscreen
                return [...prev, createRat(Date.now())];
            });
        }, 1500);

        return () => clearInterval(spawner);
    }, [gameOver]);

    const createRat = (seed: number): RatEntity => ({
        id: seed,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 3, // 2-5s to cross screen
        y: 10 + Math.random() * 80,
        size: 0.8 + Math.random() * 0.4
    });

    const handleCatch = (e: React.MouseEvent, ratId: number) => {
        if (gameOver) return;
        e.stopPropagation();

        // Add feedback effect
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top; // Relative to click not ideal, let's use global or simplified

        setClickFeedback(prev => [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }]);

        // Remove rat
        setActiveRats(prev => prev.filter(r => r.id !== ratId));

        setScore(prev => {
            const newScore = prev + 1;
            if (newScore >= TARGET_SCORE) {
                setGameOver(true);
                setTimeout(() => onComplete(100), 1500);
            }
            return newScore;
        });
    };

    // Cleanup click feedback
    useEffect(() => {
        if (clickFeedback.length > 0) {
            const timer = setTimeout(() => {
                setClickFeedback(prev => prev.slice(1));
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [clickFeedback]);

    return (
        <div className="flex flex-col items-center space-y-6 p-6 bg-slate-900 border-4 border-amber-900/50 shadow-2xl font-pixel relative overflow-hidden min-h-[500px] select-none">
            {/* Header */}
            <div className="w-full flex justify-between items-center bg-slate-950/90 p-4 rounded border border-amber-900/30 z-20">
                <div className="flex items-center gap-3">
                    <Trophy className={`w-6 h-6 ${score >= TARGET_SCORE ? 'text-green-500' : 'text-amber-600'}`} />
                    <div className="text-amber-500 font-mono text-xl tracking-widest">
                        CAUGHT: <span className="text-white">{score}</span>/{TARGET_SCORE}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Timer className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
                    <div className={`font-mono text-xl ${timeLeft < 10 ? 'text-red-500' : 'text-slate-400'}`}>
                        {timeLeft}s
                    </div>
                </div>
            </div>

            {/* Game Area */}
            <div className="relative w-full flex-1 bg-slate-950 border-4 border-slate-800 rounded-lg shadow-inner overflow-hidden cursor-crosshair group">
                {/* Background Sewer Texture */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 50% 50%, #334155 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                ></div>

                {/* Lighting Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-10"></div>

                <AnimatePresence>
                    {activeRats.map(rat => (
                        <motion.div
                            key={rat.id}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: '500%', opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                                duration: rat.duration,
                                ease: "linear",
                                delay: rat.delay,
                                repeat: Infinity, // Loop them if not caught (optional, or just destroy)
                                repeatDelay: 1
                            }}
                            onAnimationComplete={() => {
                                // If it runs off screen, maybe remove it?
                                // For simplicity rely on React state updates or infinite scrolling
                            }}
                            className="absolute flex items-center justify-center p-2 rounded-full hover:bg-red-500/10 transition-colors"
                            style={{
                                top: `${rat.y}%`,
                                width: '64px',
                                height: '64px',
                            }}
                            onClick={(e) => handleCatch(e, rat.id)}
                        >
                            <Rat
                                className="text-stone-400 drop-shadow-lg"
                                style={{
                                    width: `${40 * rat.size}px`,
                                    height: `${40 * rat.size}px`,
                                    transform: 'scaleX(-1)' // Face right
                                }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Click Effects */}
                {clickFeedback.map(effect => (
                    <div
                        key={effect.id}
                        className="fixed w-8 h-8 rounded-full border-2 border-amber-500/50 animate-ping pointer-events-none z-50"
                        style={{ left: effect.x - 16, top: effect.y - 16 }}
                    ></div>
                ))}
            </div>

            {/* Status Text */}
            <div className="text-center z-20 h-8">
                {score >= TARGET_SCORE ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-green-400 font-bold tracking-widest text-lg"
                    >
                        SPECIMENS SECURED
                    </motion.div>
                ) : (
                    <p className="text-slate-500 text-sm uppercase tracking-wide">
                        Tap target to capture • Avoid contact with bite
                    </p>
                )}
            </div>
        </div>
    );
};
