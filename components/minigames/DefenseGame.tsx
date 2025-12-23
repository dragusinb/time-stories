import React, { useState, useEffect, useRef } from 'react';
import { Minigame } from '@/types';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves } from 'lucide-react';

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

const RomanShipSVG = ({ type }: { type: 'galley' | 'flagship' }) => (
    <svg viewBox="0 0 100 40" className={`w-24 h-10 drop-shadow-md transition-transform ${type === 'flagship' ? 'scale-125' : 'scale-100'}`}>
        {/* Hull */}
        <path d="M10,10 Q50,40 90,10 L85,5 L15,5 Z" fill="#5d4037" stroke="#3e2723" strokeWidth="1" />
        {/* Oars */}
        <g stroke="#8d6e63" strokeWidth="2">
            {[20, 30, 40, 50, 60, 70, 80].map(x => (
                <line key={x} x1={x} y1="10" x2={x} y2="25" />
            ))}
        </g>
        {/* Deck Detail */}
        <rect x="20" y="5" width="60" height="5" fill="#3e2723" />
        {/* Sail/Mast (Top Down view - simplified as a bundled rect or cross) */}
        <rect x="45" y="2" width="10" height="8" fill="#e0e0e0" stroke="#bdbdbd" />
        {type === 'flagship' && (
            <circle cx="50" cy="6" r="3" fill="#c62828" />
        )}
    </svg>
);

const IronClawSVG = ({ isOpen }: { isOpen: boolean }) => (
    <svg viewBox="0 0 60 60" className="w-16 h-16 pointer-events-none">
        {/* Central Hub */}
        <circle cx="30" cy="10" r="6" fill="#4a3728" stroke="#2c1e16" strokeWidth="2" />
        {/* Left Claw */}
        <path
            d="M24,10 Q10,30 20,50 L25,45 Q18,30 28,14 Z"
            fill="#8b5a2b" stroke="#4a3728"
            transform={isOpen ? "rotate(15, 30, 10)" : "rotate(-10, 30, 10)"}
            className="transition-transform duration-300 origin-[30px_10px]"
        />
        {/* Right Claw */}
        <path
            d="M36,10 Q50,30 40,50 L35,45 Q42,30 32,14 Z"
            fill="#8b5a2b" stroke="#4a3728"
            transform={isOpen ? "rotate(-15, 30, 10)" : "rotate(10, 30, 10)"}
            className="transition-transform duration-300 origin-[30px_10px]"
        />
    </svg>
);

export const DefenseGame: React.FC<DefenseGameProps> = ({ minigame, onComplete }) => {
    const [ships, setShips] = useState<Ship[]>([]);
    const [score, setScore] = useState(0);
    const [clawState, setClawState] = useState<'idle' | 'dropping' | 'grabbing' | 'retracting'>('idle');
    const [clawTarget, setClawTarget] = useState<{ x: number, y: number } | null>(null);
    const [message, setMessage] = useState("TAP SHIPS TO DEPLOY CLAW");

    // Refs for loop
    const requestRef = useRef<number | null>(null);
    const lastSpawnRef = useRef(0);
    const scoreRef = useRef(0);

    const WIN_SCORE = 5;
    const SPAWN_RATE = 1800;

    // Game Loop
    useEffect(() => {
        const animate = (time: number) => {
            if (scoreRef.current >= WIN_SCORE) return;

            // Spawn Logic
            if (time - lastSpawnRef.current > SPAWN_RATE) {
                setShips(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        x: -15, // Start off-screen left
                        y: 40 + Math.random() * 40, // Water level variation (higher up is further away visually)
                        speed: 0.08 + Math.random() * 0.05,
                        isSunk: false,
                        type: Math.random() > 0.8 ? 'flagship' : 'galley'
                    }
                ]);
                lastSpawnRef.current = time;
            }

            // Move Ships
            setShips(prev =>
                prev
                    .map(ship => ({
                        ...ship,
                        x: ship.isSunk ? ship.x : ship.x + ship.speed
                    }))
                    .filter(ship => ship.x < 110) // Remove when off-screen right
            );

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, []);

    // Interaction Handler
    const handleShipClick = (ship: Ship) => {
        if (clawState !== 'idle' || ship.isSunk || scoreRef.current >= WIN_SCORE) return;

        // Start Attack Sequence
        setClawState('dropping');
        setClawTarget({ x: ship.x, y: ship.y });

        // 1. Drop & Grab (Visual only first)
        setTimeout(() => {
            setClawState('grabbing');

            // 2. Resolve Hit
            setShips(prev => prev.map(s => s.id === ship.id ? { ...s, isSunk: true } : s));
            const newScore = score + 1;
            setScore(newScore);
            scoreRef.current = newScore;

            // 3. Victory Check
            if (newScore >= WIN_SCORE) {
                setMessage("VICTORY! THE HARBOR IS SAFE!");
                setTimeout(() => onComplete(true), 2500);
            } else {
                setMessage(`SHIPS SUNK: ${newScore}/${WIN_SCORE}`);
            }

            // 4. Retract
            setTimeout(() => {
                setClawState('retracting');
                setTimeout(() => {
                    setClawState('idle');
                    setClawTarget(null);
                }, 600);
            }, 500);

        }, 600); // Drop duration
    };

    return (
        <div className="relative w-full h-[500px] bg-[#87CEEB] overflow-hidden rounded-lg shadow-2xl border-4 border-[#5e4026] select-none cursor-crosshair">
            {/* Sky / Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#E0F7FA] opacity-80"></div>

            {/* City Wall (Background) */}
            <div className="absolute right-0 bottom-32 w-48 h-64 bg-[#d4c5a3] border-l-4 border-[#8b7355]">
                <div className="w-full h-8 bg-[#8b7355] mb-2"></div>
                <div className="w-full h-4 bg-[#8b7355] mt-8 opacity-50"></div>
            </div>

            {/* Clouds */}
            <motion.div
                animate={{ x: [0, 100, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-10 left-10 opacity-60"
            >
                <div className="w-24 h-8 bg-white rounded-full blur-md"></div>
            </motion.div>

            {/* The Claw Mechanism (Top) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                {/* Rope */}
                <motion.div
                    className="w-1 bg-[#4a3728] mx-auto origin-top"
                    initial={{ height: 20 }}
                    animate={{
                        height: clawState !== 'idle' && clawTarget ? `${clawTarget.y}%` : 60,
                        rotate: clawState !== 'idle' && clawTarget ? (clawTarget.x - 50) * 0.4 : 0
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />

                {/* The Claw Hand */}
                <motion.div
                    className="relative -ml-8 -mt-2"
                    initial={{ y: 20 }}
                    animate={{
                        y: clawState !== 'idle' && clawTarget ? 500 * (clawTarget.y / 100) * 0.4 : 40,
                        x: clawState !== 'idle' && clawTarget ? (clawTarget.x - 50) * 5 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                    <IronClawSVG isOpen={clawState !== 'grabbing'} />
                </motion.div>
            </div>

            {/* Ships Layer */}
            <div className="absolute inset-0 z-20">
                <AnimatePresence>
                    {ships.map(ship => (
                        <motion.div
                            key={ship.id}
                            className="absolute cursor-pointer"
                            style={{
                                left: `${ship.x}%`,
                                top: `${ship.y}%`,
                            }}
                            animate={{
                                rotate: ship.isSunk ? 25 : 0,
                                y: ship.isSunk ? 50 : 0,
                                opacity: ship.isSunk ? 0 : 1,
                                scale: ship.isSunk ? 0.8 : 1
                            }}
                            transition={ship.isSunk ? { duration: 1.5 } : { duration: 0 }}
                            onClick={() => handleShipClick(ship)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <RomanShipSVG type={ship.type} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Water Layers (Foreground) */}
            <div className="absolute bottom-0 w-full h-32 bg-[#4FC3F7] opacity-60 z-10 flex items-end overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ x: [-50, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-[200%] flex text-[#0288D1]"
                >
                    {Array.from({ length: 20 }).map((_, i) => (
                        <Waves key={i} className="w-24 h-24 -mb-10 scale-150" />
                    ))}
                </motion.div>
            </div>


            {/* HUD */}
            <div className="absolute top-4 left-4 z-40 bg-[#1a110d]/90 px-4 py-2 rounded border-2 border-[#8b5a2b] text-[#e6ccb2] font-serif shadow-lg">
                <div className="text-sm tracking-widest uppercase mb-1">Defense Status</div>
                <div className="text-xl font-bold">{message}</div>
                <div className="flex gap-1 mt-2">
                    {Array.from({ length: WIN_SCORE }).map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full ${i < score ? 'bg-green-500' : 'bg-[#4a3728]'}`} />
                    ))}
                </div>
            </div>

            {/* Debug/Reset Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => { setScore(0); setShips([]); scoreRef.current = 0; }}
                className="absolute top-4 right-4 z-40 opacity-50 hover:opacity-100 text-[#2c1e16]"
            >
                Reset
            </Button>
        </div>
    );
};
