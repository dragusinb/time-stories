'use client';
import React, { useState, useEffect } from 'react';
import { generateChunk, getChunkKey, CHUNK_SIZE, TILE_SIZE, TILE_DICTIONARY } from '@/lib/map-system';
import { MapChunk, MapTile } from '@/types/map-types';
import { motion } from 'framer-motion';

const VillageMap: React.FC = () => {
    const [chunks, setChunks] = useState<Record<string, MapChunk>>({});
    const [centerChunk, setCenterChunk] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Initial load: generate 3x3 chunks around 0,0
        const initialChunks: Record<string, MapChunk> = {};
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                initialChunks[getChunkKey(x, y)] = generateChunk(x, y);
            }
        }
        setChunks(initialChunks);
    }, []);

    const renderTile = (tile: MapTile) => {
        const metadata = TILE_DICTIONARY[tile.typeId] || TILE_DICTIONARY['void'];
        // Quick visual fallback if no images yet
        const getBgColor = (type: string) => {
            switch (type) {
                case 'grass': return 'bg-green-600';
                case 'water': return 'bg-blue-600';
                case 'mountain': return 'bg-stone-600';
                case 'void': return 'bg-black';
                default: return 'bg-pink-500';
            }
        };

        return (
            <motion.div
                key={`${tile.x},${tile.y}`}
                className={`absolute ${getBgColor(tile.typeId)} border-[0.5px] border-white/10 hover:border-white/50 cursor-pointer`}
                style={{
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    left: tile.x * TILE_SIZE,
                    top: tile.y * TILE_SIZE
                }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                title={`${metadata.name} (${tile.x}, ${tile.y})`}
            />
        );
    };

    return (
        <div className="w-full h-screen bg-slate-900 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-50 bg-slate-800 p-4 border-2 border-slate-600 rounded shadow-lg text-white">
                <h2 className="text-xl font-bold mb-2">Village Map</h2>
                <p className="text-xs text-slate-400">WASD to pan (Not Implemented yet)</p>
                <div className="mt-2 text-xs font-mono">
                    Chunks Loaded: {Object.keys(chunks).length}
                </div>
            </div>

            {/* Viewport Container - Centered implementation simplified for now */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-0 h-0"> {/* Anchor point for the world */}
                    {Object.values(chunks).map(chunk => (
                        <div key={`${chunk.x},${chunk.y}`}>
                            {chunk.tiles.map(tile => renderTile(tile))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VillageMap;
