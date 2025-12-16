import React, { useState, useEffect, useRef } from 'react';
import { Minigame } from '@/types';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship as ShipIcon, Waves, Anchor, Hammer } from 'lucide-react';

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
                        y: 60 + Math.random() * 20, // Water level variation
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
        <div className="relative w-full h-[500px] bg-[#87CEEB] overflow-hidden rounded-lg shadow-2xl border-4 border-[#5e4026] select-none">
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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                {/* Rope */}
                <motion.div
                    className="w-1 bg-[#4a3728] mx-auto"
                    initial={{ height: 20 }}
                    animate={{
                        height: clawState !== 'idle' && clawTarget ? `${clawTarget.y}%` : 40,
                        rotate: clawState !== 'idle' && clawTarget ? (clawTarget.x - 50) * 0.2 : 0
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />

                {/* The Claw Hand */}
                <motion.div
                    className="relative -ml-6"
                    initial={{ y: 20 }}
                    animate={{
                        y: clawState !== 'idle' && clawTarget ? window.innerHeight * (clawTarget.y / 100) * 0.5 : 20, // Simplified relative movement
                        x: clawState !== 'idle' && clawTarget ? (clawTarget.x - 50) * 5 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                    <div className={`
                        w-12 h-12 border-4 border-[#5e4026] rounded-b-xl flex items-center justify-center bg-[#8b5a2b] shadow-xl
                        ${clawState === 'grabbing' ? 'scale-90' : 'scale-100'}
                        transition-transform duration-200
                     `}>
                        <Anchor className={`w-8 h-8 text-[#2c1e16] ${clawState === 'grabbing' ? 'rotate-180' : ''} transition-transform`} />
                    </div>
                    {/* Grabbers */}
                    <motion.div
                        animate={{ rotate: clawState === 'grabbing' ? -45 : 0 }}
                        className="absolute -left-2 bottom-0 w-4 h-8 bg-[#4a3728] rounded-bl-full origin-top-right"
                    />
                    <motion.div
                        animate={{ rotate: clawState === 'grabbing' ? 45 : 0 }}
                        className="absolute -right-2 bottom-0 w-4 h-8 bg-[#4a3728] rounded-br-full origin-top-left"
                    />
                </motion.div>
            </div>

            {/* Ships Layer */}
            <div className="absolute inset-0 z-10">
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
                                rotate: ship.isSunk ? 45 : 0,
                                y: ship.isSunk ? 100 : 0,
                                opacity: ship.isSunk ? 0 : 1
                            }}
                            transition={ship.isSunk ? { duration: 1.5 } : { duration: 0 }}
                            onClick={() => handleShipClick(ship)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className={`relative ${ship.type === 'flagship' ? 'scale-125' : 'scale-100'}`}>
                                <ShipIcon
                                    className={`w-16 h-16 ${ship.type === 'flagship' ? 'text-red-800' : 'text-[#5e4026]'} fill-current drop-shadow-lg`}
                                />
                                {ship.type === 'flagship' && (
                                    <div className="absolute -top-2 left-6 text-red-600 font-bold text-xs bg-white px-1 rounded border border-red-800">CMD</div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Water Layers (Foreground) */}
            <div className="absolute bottom-0 w-full h-32 bg-[#4FC3F7] opacity-90 z-10 flex items-end overflow-hidden">
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
            <div className="absolute bottom-0 w-full h-20 bg-[#0288D1] opacity-80 z-20 flex items-end overflow-hidden">
                <motion.div
                    animate={{ x: [0, -50] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-[200%] flex text-[#01579B]"
                >
                    {Array.from({ length: 20 }).map((_, i) => (
                        <Waves key={i} className="w-24 h-24 -mb-12 scale-150" />
                    ))}
                </motion.div>
            </div>

            {/* HUD */}
            <div className="absolute top-4 left-4 z-30 bg-[#1a110d]/90 px-4 py-2 rounded border-2 border-[#8b5a2b] text-[#e6ccb2] font-serif shadow-lg">
                <div className="text-sm tracking-widest uppercase mb-1">Defense Status</div>
                <div className="text-2xl font-bold">{message}</div>
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
                className="absolute top-4 right-4 z-30 opacity-50 hover:opacity-100 text-[#2c1e16]"
            >
                Reset
            </Button>
        </div>
    );
};


