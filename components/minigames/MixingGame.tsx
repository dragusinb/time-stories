'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Flame,
    Droplets,
    Thermometer,
    FlaskConical,
    RefreshCcw,
    Check,
    X,
    Beaker,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MixingGameProps {
    question: string;
    instructions?: string;
    winningCondition?: string;
    ingredients: string[];
    ingredientImages?: string[];
    correctCombination: string[];
    onComplete: (success: boolean) => void;
    theme?: 'medieval' | 'apollo' | 'ancient';
}

const ASSET_MAP: Record<string, string> = {
    'Water': '/images/minigames/alchemy/water_bucket.png',
    'Salt': '/images/minigames/alchemy/salt_box.png',
    'Vinegar': '/images/minigames/alchemy/flasks.png',
    'Garlic': '/images/minigames/alchemy/garlic.png',
    'Wormwood': '/images/minigames/alchemy/herbs_bundle.png',
    'Mercury': '/images/minigames/alchemy/mercury.png',
    'Lead': '/images/minigames/alchemy/lead.png',
    'Leeches': '/images/minigames/alchemy/leeches.png',
    'Prayer': '/images/minigames/alchemy/prayer.png',
};

export function MixingGame({ instructions, ingredients, correctCombination, onComplete, theme = 'medieval' }: MixingGameProps) {
    const [contents, setContents] = useState<string[]>([]);
    const [temperature, setTemperature] = useState(20);
    const [isHeating, setIsHeating] = useState(false);
    const [status, setStatus] = useState<'idle' | 'brewing' | 'success' | 'failure'>('idle');
    const [log, setLog] = useState<string[]>(['The cauldron is empty.']);

    // Physics Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHeating) {
            interval = setInterval(() => setTemperature(t => Math.min(t + 2, 120)), 50);
        } else {
            interval = setInterval(() => setTemperature(t => Math.max(t - 1, 20)), 50);
        }
        return () => clearInterval(interval);
    }, [isHeating]);

    const itemsRef = useRef<HTMLDivElement>(null);

    const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 3));

    const handleAdd = (item: string) => {
        if (status !== 'idle' && status !== 'brewing') return;
        if (contents.includes(item)) {
            addLog(`You already added ${item}.`);
            return;
        }
        setContents(prev => [...prev, item]);
        addLog(`Added ${item} to the mix.`);
        setStatus('brewing');
    };

    const handleBrew = () => {
        setIsHeating(false);
        const isBoiling = temperature >= 100;
        const correctIngredients =
            contents.length === correctCombination.filter(i => i !== 'Boil').length &&
            contents.every(i => correctCombination.includes(i));

        if (correctIngredients && isBoiling) {
            setStatus('success');
            onComplete(true);
        } else {
            setStatus('failure');
            addLog(isBoiling ? "The mixture is ruined!" : "It's not hot enough!");
            setTimeout(() => {
                setStatus('idle');
                setContents([]);
                setTemperature(20);
                addLog('Cauldron reset.');
            }, 2000);
        }
    };

    // Calculate liquid color
    const getLiquidHsl = () => {
        if (contents.length === 0) return '210, 80%, 20%'; // Blue dark

        const has = (i: string) => contents.includes(i);
        let h = 210, s = 70, l = 40;

        if (has('Salt')) { s = 20; l = 80; }
        if (has('Wormwood')) { h = 120; }
        if (has('Vinegar')) { h = 330; }
        if (has('Leeches')) { h = 0; s = 50; l = 20; }
        if (has('Mercury')) { s = 0; l = 60; }

        // Intensity based on count
        l = Math.max(20, Math.min(80, l));

        return `${h}, ${s}%, ${l}%`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-zinc-950 text-zinc-100 font-sans rounded-2xl shadow-2xl border border-zinc-900 select-none">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-zinc-100">
                        <Beaker className="w-6 h-6 text-indigo-500" />
                        Alchemy Station
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1 max-w-md italic">{instructions}</p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-4 bg-zinc-900 rounded-full px-4 py-2 border border-zinc-800">
                    <div className="flex items-center gap-2">
                        <Thermometer className={`w-4 h-4 ${temperature > 90 ? 'text-red-500' : 'text-zinc-500'}`} />
                        <span className="font-mono text-sm">{Math.round(temperature)}°C</span>
                    </div>
                    <div className="w-px h-4 bg-zinc-700"></div>
                    <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="font-mono text-sm">{contents.length} Items</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* LEFT: The Crucible */}
                <div className="relative h-80 bg-zinc-900/50 rounded-xl border border-zinc-800 flex flex-col items-center justify-center overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #3f3f46 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                    {/* The Pot Visual */}
                    <div className="relative w-48 h-48">
                        {/* Pot Body */}
                        <div className="absolute inset-0 border-4 border-zinc-700 rounded-b-[4rem] rounded-t-lg bg-zinc-950 overflow-hidden z-10 shadow-inner">
                            {/* Liquid */}
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 w-full transition-colors duration-700"
                                style={{
                                    backgroundColor: `hsl(${getLiquidHsl()})`,
                                    boxShadow: `0 0 40px hsl(${getLiquidHsl()}) inset`
                                }}
                                animate={{ height: `${Math.min(10 + contents.length * 15, 90)}%` }}
                            >
                                {/* Bubbles if hot */}
                                {temperature >= 95 && (
                                    <div className="absolute inset-0">
                                        {[...Array(6)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute bg-white/30 rounded-full w-2 h-2"
                                                animate={{ y: [-100, 0], opacity: [0, 1, 0] }}
                                                transition={{ repeat: Infinity, duration: 1 + Math.random(), delay: Math.random() }}
                                                style={{ left: `${Math.random() * 100}%`, bottom: 0 }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Fire */}
                        <AnimatePresence>
                            {isHeating && (
                                <motion.div
                                    className="absolute -bottom-16 left-0 right-0 flex justify-center z-0"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="relative w-32 h-32">
                                        <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse"></div>
                                        <Flame className="w-full h-full text-orange-500 animate-bounce" style={{ filter: 'blur(2px)' }} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-20">
                        <button
                            onClick={() => setIsHeating(!isHeating)}
                            disabled={status === 'success' || status === 'failure'}
                            className={`p-3 rounded-full border transition-all ${isHeating
                                    ? 'bg-orange-500/20 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                                }`}
                        >
                            <Flame className="w-6 h-6" />
                        </button>

                        <button
                            onClick={handleBrew}
                            disabled={status === 'success'}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {status === 'success' ? <Check className="w-5 h-5" /> : 'BREW'}
                        </button>
                    </div>
                </div>


                {/* RIGHT: Ingredients */}
                <div className="flex flex-col gap-4">
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 flex-1">
                        <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Inventory</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {ingredients.filter(i => i !== 'Boil').map((item) => (
                                <button
                                    key={item}
                                    onClick={() => handleAdd(item)}
                                    disabled={status === 'success' || status === 'failure'}
                                    className="aspect-square bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col items-center justify-center hover:border-zinc-600 hover:bg-zinc-900 transition-all group relative overflow-hidden"
                                >
                                    {/* Icon Container */}
                                    <div className="w-12 h-12 flex items-center justify-center bg-zinc-900 rounded-md group-hover:scale-110 transition-transform">
                                        <img
                                            src={ASSET_MAP[item]}
                                            alt={item}
                                            className="w-10 h-10 object-contain pixelated rendering-pixelated"
                                        />
                                    </div>
                                    <span className="text-[10px] text-zinc-500 mt-2 font-medium group-hover:text-zinc-300">{item}</span>

                                    {/* Selected Indicator */}
                                    {contents.includes(item) && (
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_5px_rgba(99,102,241,1)]"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Log Console */}
                    <div className="h-24 bg-black/40 rounded-lg p-3 font-mono text-xs text-zinc-500 overflow-hidden flex flex-col justify-end border-t border-zinc-800">
                        {log.map((entry, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-1 last:text-zinc-300 last:font-bold"
                            >
                                &gt; {entry}
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <div className="bg-zinc-900 border border-indigo-500/50 p-8 rounded-2xl max-w-sm text-center shadow-[0_0_50px_rgba(79,70,229,0.2)]">
                            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Masterpiece!</h2>
                            <p className="text-zinc-400 mb-6">The mixture is perfect. You have proven your skill.</p>
                            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Continuing...</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
