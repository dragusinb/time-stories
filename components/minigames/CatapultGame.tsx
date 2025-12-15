import React, { useState, useEffect } from 'react';
import { Minigame } from '@/types';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';

interface CatapultGameProps {
    minigame: Minigame;
    onComplete: (success: boolean) => void;
}

export const CatapultGame: React.FC<CatapultGameProps> = ({ minigame, onComplete }) => {
    const [angle, setAngle] = useState(45);
    const [force, setForce] = useState(50);
    const [projectilePath, setProjectilePath] = useState<{ x: number, y: number }[]>([]);
    const [isFiring, setIsFiring] = useState(false);
    const [message, setMessage] = useState("Adjust Angle and Force to hit the Roman ship.");
    const [targetDistance] = useState(80); // Target is at 80% of the field

    const fire = () => {
        if (isFiring) return;
        setIsFiring(true);

        // Simulate physics
        // Distance = (v^2 * sin(2*theta)) / g
        // We'll normalize so max distance is ~100
        const v = force / 10;
        const theta = angle * (Math.PI / 180);
        const g = 9.8;
        const distance = (Math.pow(v, 2) * Math.sin(2 * theta)) * 5; // Scale factor

        // Generate path points for animation
        const points = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const x = distance * t;
            // y = x * tan(theta) - (g * x^2) / (2 * v^2 * cos^2(theta))
            // Simplified parabolic arc for visual
            const y = 4 * 20 * t * (1 - t); // Fake arc height
            points.push({ x, y });
        }
        setProjectilePath(points);

        setTimeout(() => {
            setIsFiring(false);
            if (Math.abs(distance - targetDistance) < 10) {
                setMessage("Direct Hit! The ship is sinking!");
                setTimeout(() => onComplete(true), 1500);
            } else if (distance < targetDistance) {
                setMessage("Too short! Increase force or adjust angle.");
            } else {
                setMessage("Overshot! Decrease force or adjust angle.");
            }
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-6 bg-slate-900 border-4 border-amber-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="text-center">
                <h3 className="text-xl font-serif text-amber-500 mb-2 tracking-widest uppercase">{minigame.question}</h3>
                <p className="text-slate-400 text-xs font-mono">{minigame.instructions}</p>
            </div>

            {/* Game Field */}
            <div className="relative w-full h-48 bg-[#1a4480] border-4 border-slate-700 overflow-hidden pixelated">
                {/* Sun (Pixel Art) */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-400 border-2 border-yellow-600 animate-pulse"></div>

                {/* Clouds (Pixel Art) */}
                <div className="absolute top-8 left-10 w-12 h-4 bg-white/20"></div>
                <div className="absolute top-12 left-20 w-8 h-4 bg-white/10"></div>

                {/* Ground/Sea */}
                <div className="absolute bottom-0 w-full h-8 bg-[#0069aa] border-t-4 border-[#0099db]"></div>

                {/* Catapult Base */}
                <div className="absolute bottom-8 left-4 w-8 h-8 bg-[#5d4037] border-2 border-black"></div>
                <div className="absolute bottom-12 left-6 w-2 h-8 bg-[#8d6e63] border-x border-black rotate-45 origin-bottom"></div>

                {/* Target Ship */}
                <div
                    className="absolute bottom-6 w-12 h-12 flex flex-col items-center justify-end transition-all duration-500"
                    style={{ left: `${targetDistance}%` }}
                >
                    <div className="w-1 h-8 bg-[#3e2723]"></div>
                    <div className="w-8 h-6 bg-white border border-slate-400 -mt-8 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-red-600"></div>
                    </div>
                    <div className="w-12 h-4 bg-[#5d4037] border-2 border-black"></div>
                    <span className="text-[8px] text-red-300 mt-1 uppercase font-bold font-pixel">Target</span>
                </div>

                {/* Projectile Animation */}
                {isFiring && (
                    <div
                        className="absolute w-3 h-3 bg-slate-300 border-2 border-black"
                        style={{
                            left: '4%',
                            bottom: '32px',
                            animation: 'fly 1s linear forwards'
                        }}
                    >
                        <style jsx>{`
                            @keyframes fly {
                                0% { transform: translate(0, 0); }
                                50% { transform: translate(${targetDistance * 2}px, -100px); }
                                100% { transform: translate(${targetDistance * 4}px, 0); }
                            }
                        `}</style>
                    </div>
                )}
            </div>

            <div className="h-8 text-amber-400 font-bold font-mono text-sm uppercase tracking-wider">{message}</div>

            <div className="w-full max-w-xs space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400 font-mono uppercase">
                        <span>Angle</span>
                        <span>{angle}°</span>
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
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400 font-mono uppercase">
                        <span>Force</span>
                        <span>{force}%</span>
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

            <Button
                onClick={fire}
                disabled={isFiring}
                className={`w-full py-4 text-lg uppercase tracking-widest ${isFiring ? 'bg-slate-700 cursor-not-allowed' : 'pixel-btn-primary'}`}
            >
                {isFiring ? 'FIRING...' : 'FIRE CATAPULT'}
            </Button>
        </div>
    );
};
