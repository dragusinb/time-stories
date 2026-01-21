import React, { useState, useEffect, useRef } from 'react';
import { Minigame } from '@/types';
import { Button } from '@/components/ui/Button';
import { Flag } from 'lucide-react';

interface RatHerdingGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

// Simple vector types
type Vector = { x: number; y: number };

// Rat Entity
interface Rat {
    id: number;
    pos: Vector;
    vel: Vector;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;
const CAGE_RADIUS = 60;
const RAT_COUNT = 5;

export const RatCatcherGame: React.FC<RatHerdingGameProps> = ({ minigame, onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rats, setRats] = useState<Rat[]>([]);
    const [capturedCount, setCapturedCount] = useState(0);
    const [message, setMessage] = useState("Herd the rats into the ZONE!");
    const [gameState, setGameState] = useState<'playing' | 'won'>('playing');

    // Mouse Pos for "Repulsor"
    const mouseRef = useRef<Vector>({ x: -1000, y: -1000 });

    // Initialize Rats
    useEffect(() => {
        const initialRats = Array.from({ length: RAT_COUNT }).map((_, i) => ({
            id: i,
            pos: {
                x: Math.random() * GAME_WIDTH,
                y: Math.random() * GAME_HEIGHT * 0.5 // Start in top half 
            },
            vel: { x: 0, y: 0 }
        }));
        setRats(initialRats);
    }, []);

    // Game Loop
    useEffect(() => {
        if (gameState === 'won') return;

        let animationId: number;
        const ctx = canvasRef.current?.getContext('2d');

        const loop = () => {
            if (!ctx) return;

            // Clear
            ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

            // Draw Cage Zone (Bottom Center)
            const cageX = GAME_WIDTH / 2;
            const cageY = GAME_HEIGHT - 50;

            ctx.beginPath();
            ctx.fillStyle = 'rgba(50, 200, 50, 0.2)';
            ctx.strokeStyle = '#22c55e';
            ctx.arc(cageX, cageY, CAGE_RADIUS, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Update & Draw Rats
            setRats(prevRats => {
                let captured = 0;

                const nextRats = prevRats.map(rat => {
                    const dx = rat.pos.x - mouseRef.current.x;
                    const dy = rat.pos.y - mouseRef.current.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // 1. Repulsion from Mouse (Fear)
                    if (dist < 100) {
                        const force = (100 - dist) * 0.2;
                        rat.vel.x += (dx / dist) * force;
                        rat.vel.y += (dy / dist) * force;
                    }

                    // 2. Friction
                    rat.vel.x *= 0.95;
                    rat.vel.y *= 0.95;

                    // 3. Wall Bounds
                    if (rat.pos.x < 10) rat.vel.x += 1;
                    if (rat.pos.x > GAME_WIDTH - 10) rat.vel.x -= 1;
                    if (rat.pos.y < 10) rat.vel.y += 1;
                    if (rat.pos.y > GAME_HEIGHT - 10) rat.vel.y -= 1;

                    // Update Pos
                    rat.pos.x += rat.vel.x;
                    rat.pos.y += rat.vel.y;

                    // Check Capture
                    const distToCage = Math.sqrt(Math.pow(rat.pos.x - cageX, 2) + Math.pow(rat.pos.y - cageY, 2));
                    if (distToCage < CAGE_RADIUS) {
                        captured++;
                    }

                    return rat;
                });

                // Update captured UI state rarely to avoid flicker/perf issues? 
                // Actually React state update in loop is bad. Let's ref out captured count or throttle setCapturedCount.
                // For this simple game, we can just do it, or rely on a "checkWin" interval. 
                // Let's do checkWin outside.

                // Draw Rat
                nextRats.forEach(rat => {
                    ctx.save();
                    ctx.translate(rat.pos.x, rat.pos.y);
                    // Rotate based on velocity
                    const angle = Math.atan2(rat.vel.y, rat.vel.x);
                    ctx.rotate(angle);

                    // Simple Rat Body
                    ctx.fillStyle = '#a8a29e';
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Tail
                    ctx.strokeStyle = 'pink';
                    ctx.beginPath();
                    ctx.moveTo(-10, 0);
                    ctx.lineTo(-20, 0);
                    ctx.stroke();

                    ctx.restore();
                });

                return nextRats;
            });

            animationId = requestAnimationFrame(loop);
        };

        animationId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationId);
    }, [gameState]);

    // Win Check Loop (separate from render to save React updates)
    useEffect(() => {
        const interval = setInterval(() => {
            const cageX = GAME_WIDTH / 2;
            const cageY = GAME_HEIGHT - 50;
            let currentCaptured = 0;

            rats.forEach(rat => {
                const dist = Math.sqrt(Math.pow(rat.pos.x - cageX, 2) + Math.pow(rat.pos.y - cageY, 2));
                if (dist < CAGE_RADIUS) currentCaptured++;
            });

            setCapturedCount(currentCaptured);

            if (currentCaptured >= RAT_COUNT) {
                setGameState('won');
                setMessage("All Secured!");
                setTimeout(() => onComplete(100), 1000);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [rats, onComplete]);


    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-6 bg-slate-900 border-4 border-amber-900 shadow-xl max-w-lg mx-auto select-none font-pixel">
            <div className="text-center">
                <h3 className="text-xl text-amber-500 tracking-widest uppercase">Rat Roundup</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">{message}</p>
                <div className="text-green-400 font-bold mt-2">SECURED: {capturedCount} / {RAT_COUNT}</div>
            </div>

            <canvas
                ref={canvasRef}
                width={GAME_WIDTH}
                height={GAME_HEIGHT}
                onMouseMove={handleMouseMove}
                className="bg-slate-800 rounded border-2 border-slate-700 cursor-none touch-none"
                style={{ width: '100%', maxWidth: '400px', aspectRatio: '1/1' }}
            />

            <p className="text-[10px] text-slate-500 font-mono text-center">
                Move your mouse near rats to scare them away.
            </p>
        </div>
    );
};
