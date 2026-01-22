'use client';

import React from 'react';

// Base skeleton with shimmer animation
const SkeletonBase: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div
        className={`animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%] rounded ${className}`}
        style={{
            animation: 'shimmer 1.5s ease-in-out infinite',
        }}
    />
);

// Story card skeleton
export const StoryCardSkeleton: React.FC = () => (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
        {/* Cover image */}
        <SkeletonBase className="aspect-[3/2] w-full" />

        <div className="p-4 space-y-3">
            {/* Title */}
            <SkeletonBase className="h-6 w-3/4" />

            {/* Description */}
            <SkeletonBase className="h-4 w-full" />
            <SkeletonBase className="h-4 w-5/6" />

            {/* Meta info */}
            <div className="flex gap-2 pt-2">
                <SkeletonBase className="h-6 w-20 rounded-full" />
                <SkeletonBase className="h-6 w-24 rounded-full" />
            </div>

            {/* Button */}
            <SkeletonBase className="h-10 w-full mt-4" />
        </div>
    </div>
);

// Story list skeleton (3 cards)
export const StoryListSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StoryCardSkeleton />
        <StoryCardSkeleton />
        <StoryCardSkeleton />
    </div>
);

// Act content skeleton
export const ActSkeleton: React.FC = () => (
    <div className="space-y-4 p-4">
        {/* Title */}
        <SkeletonBase className="h-8 w-1/2 mx-auto" />

        {/* Content paragraphs */}
        <div className="space-y-2">
            <SkeletonBase className="h-4 w-full" />
            <SkeletonBase className="h-4 w-full" />
            <SkeletonBase className="h-4 w-4/5" />
            <SkeletonBase className="h-4 w-full" />
            <SkeletonBase className="h-4 w-3/4" />
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4 mt-8">
            <SkeletonBase className="h-12 flex-1" />
            <SkeletonBase className="h-12 flex-1" />
        </div>
    </div>
);

// Minigame skeleton
export const MinigameSkeleton: React.FC = () => (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 space-y-4">
        {/* Title */}
        <SkeletonBase className="h-6 w-2/3 mx-auto" />

        {/* Instructions */}
        <SkeletonBase className="h-4 w-1/2 mx-auto" />

        {/* Game area */}
        <SkeletonBase className="h-64 w-full rounded-lg" />

        {/* Button */}
        <SkeletonBase className="h-12 w-full" />
    </div>
);

// Trophy room skeleton
export const TrophyRoomSkeleton: React.FC = () => (
    <div className="p-4 space-y-6">
        {/* Header */}
        <SkeletonBase className="h-8 w-48 mx-auto" />

        {/* Trophy grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <SkeletonBase className="w-16 h-16 rounded-lg" />
                    <SkeletonBase className="h-3 w-12" />
                </div>
            ))}
        </div>
    </div>
);

// Lab skeleton
export const LabSkeleton: React.FC = () => (
    <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
            <SkeletonBase className="h-8 w-32" />
            <SkeletonBase className="h-8 w-48 rounded-full" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBase key={i} className="h-24 rounded-lg" />
            ))}
        </div>

        {/* Main content */}
        <SkeletonBase className="h-64 w-full rounded-lg" />
    </div>
);

// Full page loading skeleton
export const PageLoadingSkeleton: React.FC = () => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400">Loading...</p>
        </div>
    </div>
);

// Add shimmer keyframe to globals.css if not present
// @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

export default SkeletonBase;
