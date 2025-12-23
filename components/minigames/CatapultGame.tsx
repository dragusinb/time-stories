import React, { useState } from 'react';
import { Minigame } from '@/types';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Target, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface CatapultGameProps {
    minigame: Minigame;
    onComplete: (success: boolean) => void;
}

export const CatapultGame: React.FC<CatapultGameProps> = ({ minigame, onComplete }) => {
    const [angle, setAngle] = useState(45);
    const [force, setForce] = useState(50);
    const [lastShot, setLastShot] = useState<{ angle: number; force: number } | null>(null);
    const [isFiring, setIsFiring] = useState(false);
    const [message, setMessage] = useState("Adjust Angle and Force to hit the Roman ship.");
    // Target distance is fixed for now, but could be randomized
    const [targetDistance] = useState(80); // 80% across the screen

    // Explosion state
    const [explosion, setExplosion] = useState<{ x: number, y: number } | null>(null);

    const fire = () => {
        if (isFiring) return;
        setIsFiring(true);
        setExplosion(null);
        setLastShot({ angle, force });

        // Physics Calculation
        // Standard projectile motion: Range = (v^2 * sin(2*theta)) / g
        // We'll simulate 'v' as a function of force (0-100) -> v (0-150)
        // We need '80%' to be 'hit'. Let's say screen width is 100 units.

        // Calibration:
        // Max Range needed ~100.
        // If Force=100, Angle=45 (optimal), Range should be ~100.
        // Range = k * F^2 * sin(2*theta).
        // 100 = k * 100^2 * 1.
        // k = 100 / 10000 = 0.01.
        const k = 0.012;
        const thetaRad = angle * (Math.PI / 180);
        const distance = k * Math.pow(force, 2) * Math.sin(2 * thetaRad);

        const duration = 1500; // ms

        setTimeout(() => {
            const hitZoneStart = targetDistance - 5;
            const hitZoneEnd = targetDistance + 5;
            const isHit = distance >= hitZoneStart && distance <= hitZoneEnd;

            if (isHit) {
                setMessage("DIRECT HIT! The hull is breached!");
                setExplosion({ x: distance, y: 0 });
                setTimeout(() => onComplete(true), 2000);
            } else if (distance < hitZoneStart) {
                setMessage("Shot fell SHORT. Increase Force or adjust Angle.");
                setExplosion({ x: distance, y: 0 });
            } else {
                setMessage("Shot OVERSHOT. Decrease Force or adjust Angle.");
                setExplosion({ x: distance, y: 0 });
            }
            setIsFiring(false);
        }, duration);
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-6 bg-[#1a110d] border-4 border-[#8b5a2b] shadow-2xl max-w-lg mx-auto select-none font-serif text-[#e6ccb2] rounded-lg relative overflow-hidden">
            {/* Header */}
            <div className="first-letter:text-center border-b border-[#5e4026] pb-4 w-full flex justify-between items-center z-10">
                <div>
                    <h3 className="text-xl text-[#e6ccb2] mb-1 tracking-[0.2em] uppercase">
                        {minigame.question}
                    </h3>
                    <p className="text-[#8b5a2b] text-xs font-mono">{minigame.instructions}</p>
                </div>
                {lastShot && (
                    <div className="text-[10px] font-mono text-[#8b5a2b] text-right">
                        LAST SHOT:<br />
                        A: {lastShot.angle}°<br />
                        F: {lastShot.force}%
                    </div>
                )}
            </div>

            {/* Game Canvas */}
            <div className="relative w-full h-64 bg-slate-900 border-4 border-[#3e2723] overflow-hidden rounded shadow-inner group cursor-crosshair">

                {/* 1. Sky Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#E0F7FA] to-[#81D4FA] opacity-80"></div>

                {/* 2. Background Scenery (Clouds, Sun) */}
                <div className="absolute top-4 right-8 w-12 h-12 bg-yellow-300 rounded-full blur-[2px] opacity-80 animate-pulse"></div>
                <motion.div
                    animate={{ x: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-8 left-10 opacity-60"
                >
                    <div className="w-16 h-6 bg-white rounded-full blur-sm"></div>
                </motion.div>

                {/* 3. Water (Parallax Waves) */}
                <div className="absolute bottom-0 w-full h-16 bg-[#0277bd] opacity-80 z-10 flex items-end">
                    <motion.div
                        animate={{ x: [-50, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        className="w-[200%] h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMjAgQzMwMCAwIDUwMCA1MCA4MDAgMjAgQzExMDAgLTEwIDEzMDAgNTAgMTYwMCAyMCBMVm9sIDEyMCBMMCAxMjAgWiIgZmlsbD0iIzgxZDRmYSIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+')]"
                    ></motion.div>
                </div>

                {/* 4. The Ballista (Player, Left) */}
                <div className="absolute bottom-12 left-4 z-20 w-16 h-16 origin-bottom-center">
                    {/* Pivot/Base */}
                    <div className="w-12 h-4 bg-[#5d4037] absolute bottom-0 left-2 border border-[#3e2723]"></div>
                    <div className="w-2 h-8 bg-[#3e2723] absolute bottom-2 left-7"></div>

                    {/* The Arm (Rotates with Angle) */}
                    <motion.div
                        className="absolute bottom-6 left-8 w-16 h-2 bg-[#8d6e63] border border-[#3e2723] origin-left"
                        animate={{ rotate: -angle }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        {/* Cup/Holder */}
                        <div className="absolute right-0 top-[-4px] w-3 h-4 bg-[#3e2723] rounded-sm"></div>
                        {/* Projectile (Visible when ready) */}
                        {!isFiring && (
                            <div className="absolute right-0.5 top-[-2px] w-2 h-2 bg-slate-800 rounded-full"></div>
                        )}
                    </motion.div>

                    {/* Wheel */}
                    <div className="absolute bottom-[-4px] left-2 w-6 h-6 bg-[#4e342e] rounded-full border-2 border-[#3e2723] flex items-center justify-center">
                        <div className="w-1 h-1 bg-[#1a110d] rounded-full"></div>
                    </div>
                </div>

                {/* 5. The Roman Ship (Target, Right) */}
                <div
                    className="absolute bottom-10 z-10 transition-all duration-500"
                    style={{ left: `${targetDistance}%`, transform: 'translateX(-50%)' }}
                >
                    {/* Sail */}
                    <div className="w-16 h-12 bg-[#f5f5f5] absolute bottom-8 left-2 skew-x-[-10deg] border border-slate-300 shadow-sm flex items-center justify-center overflow-hidden">
                        <div className="w-full h-1 bg-red-800 absolute top-2"></div>
                        <div className="w-full h-8 bg-red-800/10 rounded-full mt-4"></div>
                    </div>
                    {/* Mast */}
                    <div className="w-1 h-20 bg-[#3e2723] absolute bottom-4 left-8"></div>
                    {/* Hull */}
                    <div className="w-24 h-8 bg-[#5d4037] border-b-4 border-[#3e2723] rounded-bl-xl rounded-br-3xl flex items-center relative overflow-hidden">
                        <div className="flex gap-1 ml-4 mt-1">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1 bg-black rounded-full"></div>)}
                        </div>
                        <div className="absolute right-2 top-2 w-2 h-2 bg-white rounded-full border border-black"><div className="w-0.5 h-0.5 bg-black rounded-full ml-0.5 mt-0.5"></div></div>
                    </div>
                </div>

                {/* 6. Active Projectile Animation - USING FRAMER MOTION FOR RELIABILITY */}
                {isFiring && (
                    <motion.div
                        className="absolute w-3 h-3 bg-black rounded-full z-30 shadow-sm"
                        initial={{ left: '8%', bottom: '25%', opacity: 1 }}
                        animate={{
                            left: [`8%`, `${(targetDistance - 8) * 0.5}%`, `${targetDistance}%`],
                            bottom: ['25%', `${25 + (force * 1.5)}px`, '10%'], // Approximate Arc
                        }}
                        transition={{ duration: 1.5, ease: "linear" }}
                    />
                )}

                {/* 7. Splash/Explosion */}
                {explosion && (
                    <div
                        className="absolute bottom-12 z-30"
                        style={{ left: `${explosion.x}%`, transform: 'translateX(-50%)' }}
                    >
                        <div className="relative">
                            <div className="absolute w-8 h-8 bg-white/80 rounded-full animate-ping"></div>
                            <div className="absolute w-12 h-12 border-2 border-white/50 rounded-full animate-ping delay-75"></div>
                            <div className="w-1 h-2 bg-blue-200 absolute -top-4 left-0 animate-bounce"></div>
                            <div className="w-1 h-2 bg-blue-200 absolute -top-2 left-4 animate-bounce delay-75"></div>
                            <div className="w-1 h-2 bg-blue-200 absolute -top-3 -left-4 animate-bounce delay-100"></div>
                        </div>
                    </div>
                )}

            </div>

            {/* Controls */}
            <div className="w-full max-w-sm space-y-6 relative z-10 bg-[#1a110d]/80 p-4 rounded border border-[#5e4026]">
                <div className="space-y-3">
                    <div className="flex justify-between items-end text-xs text-[#8b5a2b] font-mono uppercase tracking-widest">
                        <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3" /> Elevation (Angle)</span>
                        <span className="text-[#e6ccb2] text-lg font-bold">{angle}°</span>
                    </div>
                    <Slider
                        value={[angle]}
                        onValueChange={(val) => setAngle(val[0])}
                        min={0}
                        max={90}
                        step={1}
                        className="w-full"
                    />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-end text-xs text-[#8b5a2b] font-mono uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Target className="w-3 h-3" /> Tension (Force)</span>
                        <span className="text-[#e6ccb2] text-lg font-bold">{force}%</span>
                    </div>
                    <Slider
                        value={[force]}
                        onValueChange={(val) => setForce(val[0])}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Status Message */}
            <div className={`
                h-10 flex items-center justify-center w-full rounded border font-mono text-xs uppercase tracking-widest transition-colors duration-300
                ${message.includes('HIT') ? 'bg-green-900/30 border-green-700 text-green-400' :
                    message.includes('SHORT') || message.includes('OVERSHOT') ? 'bg-red-900/30 border-red-700 text-red-400' :
                        'bg-[#2c1e16] border-[#3e2723] text-[#a68a64]'}
            `}>
                {message}
            </div>

            <Button
                onClick={fire}
                disabled={isFiring}
                className={`
                    w-full py-6 text-xl uppercase tracking-[0.25em] font-bold border-2 shadow-lg transition-all active:translate-y-1
                    ${isFiring
                        ? 'bg-[#2c1e16] border-[#3e2723] text-[#5d4037] cursor-wait'
                        : 'bg-gradient-to-r from-[#b71c1c] to-[#d32f2f] hover:from-[#c62828] hover:to-[#e53935] border-[#7f1d1d] text-white shadow-red-900/50'}
                `}
            >
                {isFiring ? 'TRAJECTORY PLOTTED...' : 'RELEASE'}
            </Button>
        </div>
    );
};
