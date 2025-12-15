import { Navbar } from '@/components/Navbar';
import { StoryCard } from '@/components/StoryCard';
import { stories } from '@/lib/data';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
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
      </div>
    </main>
  );
}
