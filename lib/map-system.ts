import { MapChunk, MapTile, TileMetadata, TerrainType } from '@/types/map-types';

// Constants
export const CHUNK_SIZE = 16;
export const TILE_SIZE = 32; // Pixels (assuming for now)

// Mock Tile Dictionary - Eventually this could be loaded from a JSON or DB
export const TILE_DICTIONARY: Record<string, TileMetadata> = {
    'void': {
        id: 'void',
        name: 'Empty Void',
        description: 'Nothing exists here yet.',
        terrain: 'void',
        isBuildable: false,
        isWalkable: false,
        texturePath: '/images/tiles/void.png'
    },
    'grass': {
        id: 'grass',
        name: 'Grassland',
        description: 'Green, lush grass.',
        terrain: 'grass',
        isBuildable: true,
        isWalkable: true,
        texturePath: '/images/tiles/grass.png'
    },
    'water': {
        id: 'water',
        name: 'Deep Water',
        description: 'Impassable jagged water.',
        terrain: 'water',
        isBuildable: false,
        isWalkable: false,
        texturePath: '/images/tiles/water.png'
    },
    'mountain': {
        id: 'mountain',
        name: 'Rocky Peaks',
        description: 'High altitude rocks.',
        terrain: 'mountain',
        isBuildable: false,
        isWalkable: false,
        texturePath: '/images/tiles/mountain.png'
    }
};

/**
 * Generates an empty chunk filled with 'void' or a default terrain
 */
export const generateChunk = (chunkX: number, chunkY: number, defaultType: string = 'grass'): MapChunk => {
    const tiles: MapTile[] = [];

    // Simple procedural generation placeholder (Perlin noise would go here later)
    for (let x = 0; x < CHUNK_SIZE; x++) {
        for (let y = 0; y < CHUNK_SIZE; y++) {
            const worldX = chunkX * CHUNK_SIZE + x;
            const worldY = chunkY * CHUNK_SIZE + y;

            // Simple logic to add some variation for demo purposes
            let typeId = defaultType;
            if (Math.random() > 0.9) typeId = 'mountain';
            if (Math.random() > 0.95) typeId = 'water';

            tiles.push({
                x: worldX,
                y: worldY,
                typeId: typeId,
                variant: Math.floor(Math.random() * 4) // Assuming 4 visual variants
            });
        }
    }

    return {
        x: chunkX,
        y: chunkY,
        size: CHUNK_SIZE,
        tiles
    };
};

/**
 * Helper to get a unique key for chunk storage
 */
export const getChunkKey = (x: number, y: number): string => `${x},${y}`;
