import React, { useState, useEffect } from 'react';
import { Minigame } from '@/types';
import { Button } from '@/components/ui/Button';

interface ScaleGameProps {
    minigame: Minigame;
    onComplete: (success: boolean) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

export const ScaleGame: React.FC<ScaleGameProps> = ({ minigame, onComplete, theme = 'medieval' }) => {
    const [leftWeight, setLeftWeight] = useState(0);
    const [rightWeight, setRightWeight] = useState(0); // Crown is fixed
    const [balanceAngle, setBalanceAngle] = useState(0);
    const [goldPieces, setGoldPieces] = useState(0);
    const [message, setMessage] = useState("Equilibrate the mechanism.");

    // Physics State
    const [velocity, setVelocity] = useState(0);

    useEffect(() => {
        // Crown weighs 5 units
        setRightWeight(5);
    }, []);

    // Physics Loop for Dampened Harmonic Motion
    useEffect(() => {
        let animationFrameId: number;

        const updatePhysics = () => {
            // Target angle based on weight difference
            // Positive diff (Right Heavier) -> Positive Angle (Rotate Right)
            const weightDiff = rightWeight - leftWeight;
            const targetAngle = Math.max(Math.min(weightDiff * 8, 45), -45);

            setBalanceAngle(prevAngle => {
                // Spring force towards target
                const k = 0.05; // Stiffness
                const damping = 0.92; // Friction

                const displacement = targetAngle - prevAngle;
                const acceleration = displacement * k;

                setVelocity(prevVel => (prevVel + acceleration) * damping);

                return prevAngle + velocity;
            });

            animationFrameId = requestAnimationFrame(updatePhysics);
        };

        animationFrameId = requestAnimationFrame(updatePhysics);
        return () => cancelAnimationFrame(animationFrameId);
    }, [leftWeight, rightWeight, velocity]);

    // Check Win Condition
    useEffect(() => {
        // We check if it's "close enough" to 0 and stable-ish, AND if the weights actually match
        if (leftWeight === rightWeight && leftWeight > 0) {
            if (Math.abs(balanceAngle) < 1 && Math.abs(velocity) < 0.1) {
                setMessage("EQUILIBRIUM ACHIEVED");
                setTimeout(() => onComplete(true), 1500);
            } else {
                setMessage("Stabilizing...");
            }
        } else if (rightWeight > leftWeight) {
            setMessage("Counterweight Insufficient");
        } else if (leftWeight > rightWeight) {
            setMessage("Mass Exceeds Target");
        }
    }, [leftWeight, rightWeight, balanceAngle, velocity, onComplete]);

    const addGold = () => {
        setLeftWeight(prev => prev + 1);
        setGoldPieces(prev => prev + 1);
        // Add a little impulse jitter
        setVelocity(prev => prev - 0.5);
    };

    const removeGold = () => {
        if (leftWeight > 0) {
            setLeftWeight(prev => prev - 1);
            setGoldPieces(prev => prev - 1);
            // Add a little impulse jitter
            setVelocity(prev => prev + 0.5);
        }
    };

    const isApollo = theme === 'apollo';
    const isAncient = theme === 'ancient';

    const getTitle = () => {
        if (isApollo) return 'EASEP LEVELING';
        if (isAncient) return 'The Balance';
        return 'The Scale';
    };

    return (
        <div className={`flex flex-col items-center space-y-8 p-8 rounded-lg border-4 shadow-2xl relative overflow-hidden transition-all
            ${isApollo
                ? 'bg-black border-green-900 font-mono'
                : isAncient
                    ? 'bg-[#1a110d] border-[#5e4026] font-serif'
                    : 'bg-slate-900 border-amber-900/50 font-pixel'}
        `}>
            {/* Background Texture */}
            {!isApollo && !isAncient && <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>}
            {isApollo && <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>}
            {isAncient && <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle,rgba(139,90,43,0.3)_1px,transparent_1px)] bg-[size:15px_15px]"></div>}

            <div className="text-center relative z-10">
                <h3 className={`text-xl mb-2 tracking-[0.3em] uppercase border-b pb-2 ${isApollo ? 'text-green-500 border-green-900' : isAncient ? 'text-[#e6ccb2] border-[#5e4026]' : 'text-amber-500 border-amber-500/30'}`}>
                    {getTitle()}
                </h3>
                <p className={`text-[10px] uppercase tracking-wider ${isApollo ? 'text-green-400 font-bold' : isAncient ? 'text-[#c9a66b]' : 'text-slate-400 font-mono'}`}>{minigame.instructions}</p>
            </div>

            {/* Visualization */}
            <div className="relative w-80 h-56">

                {isApollo ? (
                    // APOLLO: Bubble Level / Seismometer View
                    <div className="w-full h-full relative flex items-center justify-center">
                        {/* Frame */}
                        <div className="absolute w-64 h-64 border-2 border-green-900 rounded-full opacity-50"></div>
                        <div className="absolute w-48 h-48 border border-green-900/50 rounded-full opacity-30"></div>

                        {/* Crosshairs */}
                        <div className="absolute w-full h-[1px] bg-green-900/50"></div>
                        <div className="absolute h-full w-[1px] bg-green-900/50"></div>

                        {/* Center Target Zone (Green if balanced) */}
                        <div className={`absolute w-12 h-12 rounded-full border-2 transition-colors duration-300 ${Math.abs(balanceAngle) < 2 ? 'border-green-400 bg-green-900/20' : 'border-green-800'}`}></div>

                        {/* The "Bubble" (This moves based on balanceAngle) */}
                        {/* balanceAngle is roughly -45 to 45. We map it to X position. */}
                        <div
                            className={`absolute w-8 h-8 rounded-full bg-green-500/80 shadow-[0_0_10px_#4ade80] transition-transform duration-100 ease-linear`}
                            style={{
                                transform: `translate(${balanceAngle * 3}px, ${velocity * 2}px)` // Add velocity for jitter effect
                            }}
                        >
                            <div className="absolute top-1 left-2 w-2 h-2 bg-white/40 rounded-full"></div>
                        </div>

                        {/* Digital Readout */}
                        <div className="absolute bottom-[-40px] font-mono text-xs text-green-600">
                            TILT: {(balanceAngle).toFixed(2)}°
                        </div>
                    </div>
                ) : (
                    // MEDIEVAL: Scales
                    <>
                        {/* Base Stand */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-40 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 border-x-2 border-stone-950 shadow-lg">
                            {/* Decorative grooves */}
                            <div className="w-full h-full flex justify-between px-2 py-4">
                                <div className="w-1 h-full bg-black/20"></div>
                                <div className="w-1 h-full bg-black/20"></div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-6 bg-stone-900 rounded-t-lg border-t border-stone-700 shadow-xl"></div>

                        {/* The Beam Assembly */}
                        <div
                            className="absolute top-10 left-1/2 w-full h-full origin-[50%_10px]" // Pivot point near top center
                            style={{ transform: `translateX(-50%) rotate(${balanceAngle}deg)` }}
                        >
                            {/* Crossbeam */}
                            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-b from-amber-700 to-amber-900 border border-amber-950 rounded-full shadow-md z-20">
                                {/* Center Pivot Pin */}
                                <div className="absolute left-1/2 -top-1 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-500 border-2 border-amber-900 shadow-inner z-30"></div>
                            </div>

                            {/* Left Pan Chain */}
                            <div className="absolute left-2 top-2 origin-top" style={{ transform: `rotate(${-balanceAngle * 0.8}deg)` }}>
                                <div className="absolute top-0 left-0 w-full flex justify-center transition-transform duration-75" style={{ transform: `rotate(${-balanceAngle}deg)` }}>
                                    {/* Chains */}
                                    <div className="absolute top-0 left-[-10px] w-0.5 h-24 bg-amber-900/50 origin-top rotate-12"></div>
                                    <div className="absolute top-0 left-[10px] w-0.5 h-24 bg-amber-900/50 origin-top -rotate-12"></div>

                                    {/* Pan */}
                                    <div className="absolute top-24 -left-8 w-16 h-8 bg-gradient-to-b from-stone-400 to-stone-600 rounded-b-full border-t-0 border-2 border-stone-700 flex flex-col-reverse items-center justify-start pb-1 shadow-lg overflow-visible">
                                        {/* Gold Stack */}
                                        <div className="flex flex-wrap-reverse justify-center gap-0.5 px-2 mb-1 absolute bottom-1">
                                            {Array.from({ length: Math.min(goldPieces, 10) }).map((_, i) => (
                                                <div key={i} className="w-3 h-2 bg-yellow-400 border border-yellow-600 rounded-[1px] shadow-sm"></div>
                                            ))}
                                        </div>
                                        {goldPieces > 10 && (
                                            <div className="absolute -top-6 bg-yellow-900 text-yellow-100 text-[9px] px-1 rounded border border-yellow-500">
                                                +{goldPieces - 10}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Pan Chain */}
                            <div className="absolute right-2 top-2 origin-top" style={{ transform: `rotate(${-balanceAngle * 0.8}deg)` }}>
                                <div className="absolute top-0 right-0 w-full flex justify-center transition-transform duration-75" style={{ transform: `rotate(${-balanceAngle}deg)` }}>
                                    {/* Chains */}
                                    <div className="absolute top-0 right-[-10px] w-0.5 h-24 bg-amber-900/50 origin-top -rotate-12"></div>
                                    <div className="absolute top-0 right-[10px] w-0.5 h-24 bg-amber-900/50 origin-top rotate-12"></div>

                                    {/* Pan */}
                                    <div className="absolute top-24 -right-8 w-16 h-8 bg-gradient-to-b from-stone-400 to-stone-600 rounded-b-full border-t-0 border-2 border-stone-700 flex flex-col-reverse items-center justify-start pb-1 shadow-lg">
                                        {/* Crown */}
                                        <div className="absolute bottom-2 w-8 h-5">
                                            <div className="absolute bottom-0 w-full h-1/2 bg-yellow-500 border border-yellow-800"></div>
                                            <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-yellow-400 border border-yellow-800"></div>
                                            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-yellow-400 border border-yellow-800"></div>
                                            <div className="absolute top-1 left-1/3 w-1/3 h-1/2 bg-yellow-400 border border-yellow-800"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className={`h-6 font-bold font-mono text-xs uppercase tracking-widest ${Math.abs(leftWeight - rightWeight) === 0
                ? 'text-green-400 animate-pulse'
                : isApollo
                    ? 'text-green-700'
                    : isAncient
                        ? 'text-[#c9a66b]'
                        : 'text-amber-500'
                }`}>
                {message}
            </div>

            <div className="flex space-x-6 w-full max-w-sm z-20">
                <Button
                    onClick={removeGold}
                    disabled={goldPieces === 0}
                    className={`flex-1 font-mono text-xs py-3 rounded shadow-md active:translate-y-0.5 transition-all
                        ${isApollo
                            ? 'bg-red-900/40 hover:bg-red-900/60 border-2 border-red-800 text-red-200'
                            : isAncient
                                ? 'bg-[#3d2817] hover:bg-[#4d3827] border-2 border-[#5e4026] text-[#c9a66b]'
                                : 'bg-red-900/40 hover:bg-red-900/60 border-2 border-red-800 text-red-200'}
                    `}
                >
                    {isApollo ? 'LOWER LEFT' : 'REMOVE'}
                </Button>
                <div className="flex flex-col items-center justify-center">
                    <span className={`text-[10px] font-mono mb-1 ${isAncient ? 'text-[#8b6914]' : 'text-slate-500'}`}>{isApollo ? 'OFFSET' : isAncient ? 'BALLAST' : 'CURRENT'}</span>
                    <span className={`text-xl font-bold font-mono ${isApollo ? 'text-green-500' : isAncient ? 'text-[#e6ccb2]' : 'text-yellow-500'}`}>{goldPieces}</span>
                </div>
                <Button
                    onClick={addGold}
                    className={`flex-1 font-bold font-mono text-xs py-3 rounded shadow-lg active:translate-y-1 active:border-b-0 transition-all
                        ${isApollo
                            ? 'bg-green-600 hover:bg-green-500 border-b-4 border-green-800 text-green-100'
                            : isAncient
                                ? 'bg-[#5e4026] hover:bg-[#704d2e] border-b-4 border-[#3d2817] text-[#e6ccb2]'
                                : 'bg-amber-600 hover:bg-amber-500 border-b-4 border-amber-800 text-amber-100'}
                    `}
                >
                    {isApollo ? 'RAISE LEFT' : 'ADD'}
                </Button>
            </div>
        </div>
    );
};
