import React, { useState, useRef, useEffect } from 'react';
import { Minigame } from '@/types';
import { Button } from '@/components/ui/Button';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface CircleGameProps {
    minigame: Minigame;
    onComplete: (score: number) => void;
}

export const CircleGame: React.FC<CircleGameProps> = ({ minigame, onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
    const [score, setScore] = useState<number | null>(null);
    const [message, setMessage] = useState("Draw a perfect circle in the sand.");
    const [center, setCenter] = useState<{ x: number; y: number } | null>(null);

    // Canvas Setup
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // High DPI scaling
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(dpr, dpr);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#d4b483'; // Sand light color
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 2;
            ctx.lineWidth = 4;
        }
    }, []);

    // Drawing Handlers
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (score !== null) return; // Game over
        setIsDrawing(true);
        setPoints([]);
        setScore(null);
        setCenter(null);
        setMessage("Drawing...");

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Get coordinates
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Add point
        const newPoints = [...points, { x, y }];
        setPoints(newPoints);

        // Draw visual
        const ctx = canvas.getContext('2d');
        if (ctx && newPoints.length > 1) {
            ctx.beginPath();
            ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        calculateScore();
    };

    const calculateScore = () => {
        if (points.length < 20) {
            setMessage("Too small! Draw a bigger circle.");
            return;
        }

        // 1. Calculate Centroid (Center)
        let sumX = 0, sumY = 0;
        points.forEach(p => { sumX += p.x; sumY += p.y; });
        const centerX = sumX / points.length;
        const centerY = sumY / points.length;
        setCenter({ x: centerX, y: centerY });

        // 2. Calculate Average Radius
        let totalRadius = 0;
        points.forEach(p => {
            totalRadius += Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2));
        });
        const avgRadius = totalRadius / points.length;

        // 3. Calculate Variance/Error
        let totalError = 0;
        points.forEach(p => {
            const r = Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2));
            totalError += Math.abs(r - avgRadius);
        });

        // Normalize Error (Average deviation as percentage of radius)
        const avgError = totalError / points.length;
        const errorPercent = avgError / avgRadius;

        // 4. Calculate Closure (Did start meet end?)
        const start = points[0];
        const end = points[points.length - 1];
        const gap = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
        const gapPenalty = Math.min(1, gap / (avgRadius * 0.5)); // Penalty if gap is > 50% of radius

        // Final Score (100 - error - gap)
        // A perfect circle has 0 error. We want to be lenient.
        // Multiplier helps scale difficulty.
        const accuracy = Math.max(0, 100 - (errorPercent * 500) - (gapPenalty * 20));
        const finalScore = Math.round(accuracy);

        setScore(finalScore);

        if (finalScore >= 80) {
            setMessage(`Excellent! ${finalScore}% Perfect.`);
            setTimeout(() => onComplete(100), 1000);
        } else {
            setMessage(`Not quite round enough (${finalScore}%). Try again!`);
        }

        // Draw debug visuals (Perfect circle overlay)
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(50, 200, 50, 0.3)';
            ctx.lineWidth = 2;
            ctx.arc(centerX, centerY, avgRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
    };

    const reset = () => {
        setPoints([]);
        setScore(null);
        setCenter(null);
        setMessage("Draw a perfect circle in the sand.");
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-6 bg-slate-900 border-4 border-amber-800 shadow-xl max-w-lg mx-auto select-none">
            <div className="text-center">
                <h3 className="text-lg font-serif text-amber-500 tracking-widest uppercase">The Perfect Circle</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">{message}</p>
            </div>

            <div className="relative w-full aspect-square max-w-[300px] bg-[#c2a47c] border-4 border-[#8c6b3f] shadow-inner rounded-sm overflow-hidden cursor-crosshair touch-none">
                {/* Sand Texture / Noise Background */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-amber-900"></div>

                <canvas
                    ref={canvasRef}
                    className="w-full h-full relative z-10"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />

                {center && score !== null && (
                    <div
                        className="absolute w-2 h-2 bg-red-500 rounded-full z-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: center.x, top: center.y }}
                    ></div>
                )}
            </div>

            <div className="flex justify-between w-full max-w-[300px] items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-slate-500">History's Record: 96%</span>
                </div>

                {score !== null && score < 80 && (
                    <Button onClick={reset} className="bg-amber-700 hover:bg-amber-600 text-white text-xs px-4 py-2 border-amber-900">
                        <RefreshCw className="w-3 h-3 mr-2" /> Smoother...
                    </Button>
                )}
                {score !== null && score >= 80 && (
                    <div className="text-green-500 font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> PASSED
                    </div>
                )}
            </div>

            <p className="text-[10px] text-slate-600 font-mono text-center max-w-xs">
                Archimedes says: "A circle is the locus of points equidistant from a center."
                <br />Try to keep your hand steady!
            </p>
        </div>
    );
};
