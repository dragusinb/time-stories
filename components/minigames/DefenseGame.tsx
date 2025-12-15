import React, { useState, useEffect, useRef } from 'react';
import { Minigame } from '@/types';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface DefenseGameProps {
    minigame: Minigame;
    onComplete: (success: boolean) => void;
}

interface Ship {
    id: number;
    x: number; // %
    y: number; // %
    speed: number;
    isSunk: boolean;
    type: 'galley' | 'flagship';
}

export const DefenseGame: React.FC<DefenseGameProps> = ({ minigame, onComplete }) => {
    const [ships, setShips] = useState<Ship[]>([]);
    const [score, setScore] = useState(0);
    const [clawPos, setClawPos] = useState<{ x: number, y: number } | null>(null);
    const [shake, setShake] = useState(false);
    const [message, setMessage] = useState("TAP SHIPS TO DEPLOY CLAW");

    // Game loop refs
    const requestRef = useRef<number | null>(null);
    const lastSpawnRef = useRef(0);
    const scoreRef = useRef(0);

    const SPAWN_RATE = 1500;

    useEffect(() => {
        const animate = (time: number) => {
            if (scoreRef.current >= 5) return;

            // Spawn
            if (time - lastSpawnRef.current > SPAWN_RATE) {
                setShips(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        x: -15,
                        y: 55 + Math.random() * 25, // Lower in water
                        speed: 0.15 + Math.random() * 0.15,
                        isSunk: false,
                        type: Math.random() > 0.7 ? 'flagship' : 'galley'
                    }
                ]);
                lastSpawnRef.current = time;
            }

            // Move
            setShips(prev =>
                prev
                    .map(ship => ({
                        ...ship,
                        x: ship.isSunk ? ship.x : ship.x + ship.speed
                    }))
                    .filter(ship => ship.x < 110)
            );

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, []);

    const handleShipClick = (e: React.MouseEvent, ship: Ship) => {
        e.stopPropagation();
        if (ship.isSunk) return;

        // Visuals
        setClawPos({ x: ship.x, y: ship.y });
        setShake(true);
        setTimeout(() => setShake(false), 300);

        // Logic
        setShips(prev => prev.map(s => s.id === ship.id ? { ...s, isSunk: true } : s));
        const newScore = score + 1;
        setScore(newScore);
        scoreRef.current = newScore;

        if (newScore >= 5) {
            setMessage("VICTORY! THE HARBOR IS SAFE!");
            setTimeout(() => onComplete(true), 2500);
        } else {
            setMessage(`SUNK: ${newScore}/5`);
            setTimeout(() => setClawPos(null), 800);
        }
    };

    return (
        <div className={`flex flex-col items-center space-y-4 p-1 bg-[#1a110d] rounded-lg border-4 border-[#5e4026] shadow-2xl font-serif select-none transition-transform ${shake ? 'translate-x-[2px] translate-y-[2px]' : ''}`}>

            {/* Header / HUD */}
            <div className="flex w-full justify-between items-center px-4 py-2 bg-[#2c1e16] border-b border-[#5e4026] rounded-t">
                <div className="text-[#e6ccb2] font-bold tracking-widest text-sm">ARCHIMEDES' DEFENSE</div>
                <div className="text-[#8b5a2b] font-mono text-xs">{message}</div>
                <div className="text-amber-500 font-bold text-xl">{score}/5</div>
            </div>

            {/* Game Viewport */}
            <div className="relative w-full h-80 bg-[#87CEEB] overflow-hidden border-x-4 border-b-4 border-[#3e2723] shadow-inner group cursor-crosshair">

                {/* Sky & Atmosphere */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#aed9e7] to-[#4fa3d1] opacity-60"></div>
                <div className="absolute top-4 right-8 w-16 h-16 bg-yellow-200 rounded-full blur-xl opacity-60 animate-pulse"></div>

                {/* City Wall (Foreground Left) */}
                <div className="absolute bottom-0 left-0 w-24 h-full bg-[#5d4037] border-r-8 border-[#3e2723] z-40 shadow-2xl skew-x-2 origin-bottom">
                    <div className="w-full h-full opacity-40 bg-[url('https://www.transparenttextures.com/patterns/brick-wall.png')]"></div>
                    {/* Crane Base */}
                    <div className="absolute top-10 right-0 w-8 h-64 bg-[#271c19] border-l border-[#4e342e]"></div>
                </div>

                {/* Water Layers (Parallax) */}
                <div className="absolute bottom-0 w-[120%] -left-10 h-24 bg-[#4fa3d1] opacity-80 animate-wave-slow rounded-[100%] z-20 mix-blend-multiply"></div>
                <div className="absolute -bottom-4 w-[120%] -left-10 h-20 bg-[#2b7095] opacity-70 animate-wave-fast rounded-[100%] z-20"></div>

                {/* SHIPS */}
                <AnimatePresence>
                    {ships.map(ship => (
                        <motion.button
                            key={ship.id}
                            initial={{ opacity: 0, left: '-10%', top: `${ship.y}%` }}
                            animate={{ opacity: 1, left: `${ship.x}%`, top: `${ship.y}%` }}
                            exit={{ opacity: 0, scale: 0 }}
                            onClick={(e) => handleShipClick(e as any, ship)}
                            className={`absolute z-30 w-32 h-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out
                                ${ship.isSunk ? 'rotate-[160deg] translate-y-24 grayscale opacity-50' : 'hover:scale-105 hover:brightness-110'}
                            `}
                        >
                            {/* SVG ROMAN TRIREME */}
                            <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-lg">
                                {/* Sail */}
                                <path d="M40,10 Q60,10 70,30 L30,30 Z" fill="#e6e6e6" stroke="#bcaaa4" strokeWidth="1" />
                                <text x="45" y="25" fontSize="6" fill="#7f1d1d" fontWeight="bold">SPQR</text>
                                {/* Mast */}
                                <rect x="48" y="5" width="4" height="35" fill="#3e2723" />
                                {/* Hull */}
                                <path d="M10,35 Q50,60 90,30 L95,30 Q90,60 10,50 Z" fill="#5d4037" stroke="#3e2723" strokeWidth="2" />
                                {/* Shields */}
                                <circle cx="20" cy="38" r="3" fill="#b71c1c" stroke="#f59e0b" strokeWidth="1" />
                                <circle cx="35" cy="40" r="3" fill="#b71c1c" stroke="#f59e0b" strokeWidth="1" />
                                <circle cx="50" cy="41" r="3" fill="#b71c1c" stroke="#f59e0b" strokeWidth="1" />
                                <circle cx="65" cy="40" r="3" fill="#b71c1c" stroke="#f59e0b" strokeWidth="1" />
                                <circle cx="80" cy="38" r="3" fill="#b71c1c" stroke="#f59e0b" strokeWidth="1" />
                            </svg>

                            {/* SPLASH EFFECT ON SINK */}
                            {ship.isSunk && (
                                <motion.div
                                    initial={{ opacity: 1, scale: 0 }}
                                    animate={{ opacity: 0, scale: 2 }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                >
                                    <div className="w-full h-full bg-blue-200 rounded-full opacity-50 blur-sm"></div>
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </AnimatePresence>

                {/* THE CLAW */}
                <AnimatePresence>
                    {clawPos && (
                        <motion.div
                            initial={{ y: -400 }}
                            animate={{ y: 0 }}
                            exit={{ y: -400 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="absolute z-50 pointer-events-none"
                            style={{
                                left: `${clawPos.x}%`,
                                top: `${clawPos.y - 15}%`,
                                x: '-50%'
                            }}
                        >
                            {/* Chain */}
                            <div className="w-1 h-80 bg-stone-800 mx-auto border-x border-[#3e2723]"></div>
                            {/* Claw Mechanism (Bronze) */}
                            <div className="relative w-24 h-24 -mt-2">
                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                                    <defs>
                                        <linearGradient id="bronze" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#cd7f32" />
                                            <stop offset="50%" stopColor="#a0522d" />
                                            <stop offset="100%" stopColor="#8b4513" />
                                        </linearGradient>
                                    </defs>
                                    {/* Hub */}
                                    <circle cx="50" cy="20" r="10" fill="url(#bronze)" stroke="#3e2723" strokeWidth="2" />
                                    {/* Left Claw */}
                                    <path d="M40,25 Q10,50 30,80 L40,60" fill="url(#bronze)" stroke="#3e2723" strokeWidth="2" />
                                    {/* Right Claw */}
                                    <path d="M60,25 Q90,50 70,80 L60,60" fill="url(#bronze)" stroke="#3e2723" strokeWidth="2" />
                                </svg>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            <style jsx>{`
                @keyframes wave-slow { 0% { transform: translateX(0); } 100% { transform: translateX(-20px); } }
                @keyframes wave-fast { 0% { transform: translateX(0); } 100% { transform: translateX(-40px); } }
                .animate-wave-slow { animation: wave-slow 3s ease-in-out infinite alternate; }
                .animate-wave-fast { animation: wave-fast 2s ease-in-out infinite alternate; }
            `}</style>
        </div>
    );
};
