import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Trophy, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TROPHIES = {
    'story-1': {
        id: 'story-1',
        name: 'The Eagle Has Landed',
        description: 'Awarded for completing the Apollo 11 Mission. A symbol of humanity\'s greatest leap.',
        shortDesc: 'Apollo 11 Mission Complete',
        image: '/images/trophies/trophy-rocket.png',
        className: 'w-24 h-auto',
        animation: {
            y: [0, -20, -20, 0],
            rotate: [0, -5, 5, 0],
            transition: { duration: 2, times: [0, 0.2, 0.8, 1] }
        }
    },
    'story-2': {
        id: 'story-2',
        name: 'The Alchemist\'s Mask',
        description: 'Awarded for surviving the Black Plague. Used by the first "Beak Doctors" of Florence.',
        shortDesc: 'Alchemist\'s Apprentice Complete',
        image: '/images/trophies/trophy-mask.png',
        className: 'w-24 h-auto',
        animation: {
            scale: [1, 1.1, 1],
            filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
            transition: { duration: 2 }
        }
    },
    'story-3': {
        id: 'story-3',
        name: 'The Circles of Truth',
        description: 'Awarded for defending Syracuse with Archimedes. "Noli turbare circulos meos."',
        shortDesc: 'Archimedes\' Sidekick Complete',
        image: '/images/trophies/trophy-circles.png',
        className: 'w-28 h-auto',
        animation: {
            rotate: [0, 360],
            transition: { duration: 3, ease: "linear" }
        }
    }
};

export default function TrophyRoom() {
    const completedStories = useStore((state) => state.completedStories);
    const [selectedTrophy, setSelectedTrophy] = useState<string | null>(null);

    // Calculate core power level (0-3)
    const powerLevel = completedStories.length;
    const maxPower = Object.keys(TROPHIES).length;

    return (
        <div className="relative w-full h-full bg-[#0a0503] rounded-lg overflow-hidden flex flex-col items-center justify-center border-4 border-[#3e2723] shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]">

            {/* Ambient Particles/Fog (CSS Overlay) */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            {/* Background Image (Dark Vault) */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30 z-0 mix-blend-overlay"
                style={{ backgroundImage: "url('/images/trophies/room_bg.png')" }}
            ></div>

            {/* Content Container */}
            <div className="relative z-10 w-full h-full p-8 flex flex-col items-center justify-between">

                {/* Header / Vault Status */}
                <div className="w-full flex justify-between items-start">
                    <div className="bg-[#1a110d]/80 border border-[#8b5a2b] px-6 py-3 rounded backdrop-blur-md">
                        <h2 className="text-xl font-serif text-[#e6ccb2] tracking-widest uppercase flex items-center gap-2">
                            <span className="text-amber-500">❖</span> The Time Vault
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="text-[#8b5a2b] text-xs font-mono uppercase">Timeline Stability:</div>
                            <div className="w-24 h-2 bg-black rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(powerLevel / maxPower) * 100}%` }}
                                    className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                                ></motion.div>
                            </div>
                            <div className="text-blue-400 text-xs font-mono">{Math.round((powerLevel / maxPower) * 100)}%</div>
                        </div>
                    </div>
                </div>

                {/* Central Time Core */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 flex flex-col items-center justify-center pointer-events-none group">
                    {/* Cables connecting to trophies (Visual only) */}
                    <svg className="absolute w-[800px] h-[400px] opacity-30" style={{ strokeDasharray: 10 }}>
                        {/* Left Line */}
                        <motion.path
                            d="M 400 200 L 150 350"
                            stroke={completedStories.includes('story-1') ? "#3b82f6" : "#333"}
                            strokeWidth="4"
                            fill="none"
                            animate={completedStories.includes('story-1') ? { strokeDashoffset: [0, -20] } : {}}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Right Line */}
                        <motion.path
                            d="M 400 200 L 650 350"
                            stroke={completedStories.includes('story-3') ? "#3b82f6" : "#333"}
                            strokeWidth="4"
                            fill="none"
                            animate={completedStories.includes('story-3') ? { strokeDashoffset: [0, -20] } : {}}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Center Line */}
                        <motion.path
                            d="M 400 200 L 400 350"
                            stroke={completedStories.includes('story-2') ? "#3b82f6" : "#333"}
                            strokeWidth="4"
                            fill="none"
                            animate={completedStories.includes('story-2') ? { strokeDashoffset: [0, -20] } : {}}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </svg>

                    <div className="relative">
                        <motion.div
                            animate={{
                                scale: [1, 1.02, 1],
                                opacity: [0.8, 1, 0.8]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="relative z-10"
                        >
                            {/* Core Image */}
                            <img
                                src="/images/trophies/time-core.png"
                                alt="Time Core"
                                className={`w-64 h-64 object-contain transition-all duration-1000 mix-blend-screen ${powerLevel > 0 ? 'filter-none' : 'grayscale opacity-50'}`}
                            />

                            {/* Inner Glow Pulse based on power level */}
                            {powerLevel > 0 && (
                                <div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500 rounded-full blur-[50px] mix-blend-screen"
                                    style={{ opacity: powerLevel * 0.3 }}
                                ></div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Trophies Display Grid (Bottom) */}
                <div className="grid grid-cols-3 gap-20 items-end w-full px-12 pb-12 relative z-20">
                    {/* Story 1 (Left) */}
                    <TrophyPedestal
                        storyId="story-1"
                        trophy={TROPHIES['story-1']}
                        isUnlocked={completedStories.includes('story-1')}
                        onClick={() => setSelectedTrophy('story-1')}
                    />

                    {/* Story 2 (Center) */}
                    <TrophyPedestal
                        storyId="story-2"
                        trophy={TROPHIES['story-2']}
                        isUnlocked={completedStories.includes('story-2')}
                        onClick={() => setSelectedTrophy('story-2')}
                    />

                    {/* Story 3 (Right) */}
                    <TrophyPedestal
                        storyId="story-3"
                        trophy={TROPHIES['story-3']}
                        isUnlocked={completedStories.includes('story-3')}
                        onClick={() => setSelectedTrophy('story-3')}
                    />
                </div>

                {/* Selected Trophy Modal / Overlay */}
                <AnimatePresence>
                    {selectedTrophy && TROPHIES[selectedTrophy as keyof typeof TROPHIES] && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-32 bg-black/90 border border-amber-500/50 p-6 rounded-lg shadow-2xl max-w-md z-50 backdrop-blur-xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-amber-900/20 rounded-full border border-amber-700/50">
                                    <img
                                        src={TROPHIES[selectedTrophy as keyof typeof TROPHIES].image}
                                        className="w-16 h-16 object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-amber-500 mb-1">{TROPHIES[selectedTrophy as keyof typeof TROPHIES].name}</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">{TROPHIES[selectedTrophy as keyof typeof TROPHIES].description}</p>
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() => setSelectedTrophy(null)}
                                            className="px-3 py-1 text-xs uppercase tracking-widest border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

function TrophyPedestal({ storyId, trophy, isUnlocked, onClick }: { storyId: string, trophy: any, isUnlocked: boolean, onClick: () => void }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="flex flex-col items-center group relative cursor-pointer h-64 justify-end"
            onClick={isUnlocked ? onClick : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isUnlocked ? (
                <>
                    {/* Hover Glow */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Trophy Image with Interaction */}
                    <motion.img
                        src={trophy.image}
                        alt={trophy.name}
                        className={`${trophy.className} drop-shadow-2xl z-20 relative mix-blend-screen`}
                        animate={isHovered ? trophy.animation : {}}
                    />

                    {/* Connection Node */}
                    <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] mt-4 z-20 border-2 border-black"></div>
                </>
            ) : (
                /* Locked Placeholder */
                <div className="opacity-30 filter grayscale flex flex-col items-center justify-end h-full">
                    <Trophy className="w-16 h-16 text-slate-500 mb-4" />
                    <div className="w-16 h-2 bg-black/30 rounded-full blur-sm"></div>
                    {/* Connection Node (Off) */}
                    <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-black mt-4"></div>
                </div>
            )}

            {/* Pedestal Base */}
            <div className={`
                w-32 h-16 mt-[-8px] relative z-10
                bg-gradient-to-b from-[#2c1e16] to-[#1a110d]
                border-x-2 border-t border-[#3e2723]
                flex items-center justify-center
                group-hover:shadow-[0_0_20px_rgba(251,191,36,0.1)] transition-shadow duration-300
                ${isUnlocked ? 'opacity-100' : 'opacity-50'}
            `}>
                <div className="text-[10px] text-[#8b5a2b] font-mono tracking-widest uppercase opacity-70 mt-4">
                    {isUnlocked ? 'SECURE' : 'LOCKED'}
                </div>
            </div>

        </div>
    );
}
