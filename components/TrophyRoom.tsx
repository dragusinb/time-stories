import React from 'react';
import { useStore } from '@/lib/store';
import { Trophy } from 'lucide-react';

const TROPHIES = {
    'story-1': {
        id: 'story-1',
        name: 'The Eagle Has Landed',
        description: 'Awarded for completing the Apollo 11 Mission.',
        image: '/images/trophies/trophy-rocket.png',
        className: 'w-24 h-auto'
    },
    'story-2': {
        id: 'story-2',
        name: 'The Alchemist\'s Mask',
        description: 'Awarded for surviving the Black Plague.',
        image: '/images/trophies/trophy-mask.png',
        className: 'w-24 h-auto'
    },
    'story-3': {
        id: 'story-3',
        name: 'The Circles of Truth',
        description: 'Awarded for defending Syracuse with Archimedes.',
        image: '/images/trophies/trophy-circles.png',
        className: 'w-28 h-auto'
    }
};

export default function TrophyRoom() {
    const completedStories = useStore((state) => state.completedStories);

    // Filter trophies based on completion
    const unlockedTrophies = Object.keys(TROPHIES).filter(storyId => completedStories.includes(storyId));

    return (
        <div className="relative w-full h-full bg-[#1e140a] rounded-lg overflow-hidden flex flex-col items-center justify-center border-4 border-[#3e2723] shadow-inner">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
                style={{ backgroundImage: "url('/images/trophies/room_bg.png')" }}
            ></div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-4xl p-8 flex flex-col items-center">

                {/* Sign */}
                <div className="mb-12 bg-[#2c1e16] border-2 border-[#8b5a2b] px-8 py-4 rounded shadow-lg transform rotate-1">
                    <h2 className="text-3xl font-serif text-[#e6ccb2] tracking-widest uppercase text-center">
                        Curator's Collection
                    </h2>
                    <p className="text-[#8b5a2b] text-xs font-mono text-center mt-1">EST. 1987</p>
                </div>

                {/* Trophy Shelf */}
                <div className="w-full bg-gradient-to-b from-[#3e2723] to-[#2c1e16] h-4 rounded-full shadow-xl mb-0 relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/5 rounded-full"></div>
                </div>

                {/* Trophies Display Grid */}
                <div className="grid grid-cols-3 gap-16 -mt-32 pb-8 px-12 items-end min-h-[200px] w-full">
                    {Object.entries(TROPHIES).map(([storyId, trophy]) => {
                        const isUnlocked = completedStories.includes(storyId);

                        return (
                            <div key={storyId} className="flex flex-col items-center group relative">
                                {isUnlocked ? (
                                    <>
                                        {/* Glow Effect */}
                                        <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        {/* Trophy Image */}
                                        <img
                                            src={trophy.image}
                                            alt={trophy.name}
                                            className={`${trophy.className} drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300 z-20 cursor-pointer`}
                                        />

                                        {/* Label Card (Tooltip on hover) */}
                                        <div className="absolute top-28 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/90 border border-amber-900/50 p-3 rounded text-center w-48 z-30 pointer-events-none">
                                            <h4 className="text-amber-400 font-bold text-sm mb-1">{trophy.name}</h4>
                                            <p className="text-gray-400 text-xs">{trophy.description}</p>
                                        </div>
                                    </>
                                ) : (
                                    /* Locked Placeholder */
                                    <div className="w-24 h-32 flex flex-col items-center justify-end opacity-20 filter grayscale">
                                        <Trophy className="w-16 h-16 text-slate-500 mb-2" />
                                        <div className="w-16 h-2 bg-black/30 rounded-full blur-sm"></div>
                                    </div>
                                )}

                                {/* Shelf Shadow */}
                                <div className="w-20 h-2 bg-black/50 rounded-full blur-sm mt-2"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Shelf Front */}
                <div className="w-full h-8 bg-[#3e2723] rounded-sm shadow-lg border-t border-[#5d4037] flex items-center justify-around px-20">
                    <div className="w-2 h-2 rounded-full bg-[#1a110d]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#1a110d]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#1a110d]"></div>
                </div>

                {/* Empty State Message */}
                {completedStories.length === 0 && (
                    <div className="mt-16 text-center text-[#8d6e63] font-serif italic bg-black/40 p-4 rounded backdrop-blur-sm border border-[#3e2723]/50">
                        "The shelves are dusty. Go forth and make history."
                    </div>
                )}
            </div>
        </div>
    );
}
