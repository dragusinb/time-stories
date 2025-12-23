'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { StoryCard } from '@/components/StoryCard';
import { stories } from '@/lib/data';
import VillageMap from '@/components/VillageMap';
import { Map, BookOpen } from 'lucide-react';

export default function Home() {
  const [viewMode, setViewMode] = useState<'stories' | 'village'>('stories');

  return (
    <main className="min-h-screen bg-slate-950 pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900 p-1 rounded-lg border border-slate-700 flex">
            <button
              onClick={() => setViewMode('stories')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${viewMode === 'stories' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <BookOpen size={18} />
              <span>Story Mode</span>
            </button>
            <button
              onClick={() => setViewMode('village')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${viewMode === 'village' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Map size={18} />
              <span>Village Map</span>
            </button>
          </div>
        </div>

        {viewMode === 'stories' ? (
          <>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-100 mb-4">
                Travel Through <span className="text-amber-500">Time</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Immerse yourself in interactive historical dramas. Solve mysteries, change history, and survive the past.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </>
        ) : (
          <div className="h-[80vh] w-full border border-slate-700 rounded-lg overflow-hidden bg-slate-900 shadow-2xl">
            <VillageMap />
          </div>
        )}
      </div>
    </main>
  );
}
