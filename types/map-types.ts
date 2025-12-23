export type TerrainType = 'grass' | 'water' | 'mountain' | 'forest' | 'sand' | 'void';

export interface TileMetadata {
    id: string; // unique identifier for the tile type, e.g., 'grass_variant_1'
    name: string;
    description: string;
    terrain: TerrainType;
    isBuildable: boolean;
    isWalkable: boolean;
    cost?: number; // Resource cost to place/unlock
    texturePath: string; // Path to the pixel art asset
}

export interface MapTile {
    x: number;
    y: number;
    typeId: string; // References TileMetadata.id
    variant?: number; // For visual variety of the same type
    placedAt?: number; // Timestamp
    ownerId?: string; // For future multiplayer or NPC ownership
    structureId?: string; // If a building is placed here
}

export interface MapChunk {
    x: number; // Chunk coordinate X
    y: number; // Chunk coordinate Y
    size: number; // e.g., 16 for 16x16 tiles
    tiles: MapTile[];
}

export interface VillageState {
    chunks: Record<string, MapChunk>; // Key is "x,y" of the chunk
    unlockedChunks: string[];
    resources: {
        wood: number;
        stone: number;
        gold: number;
    };
}
