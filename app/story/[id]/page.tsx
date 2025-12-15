import { Navbar } from '@/components/Navbar';
import { getStory } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, MapPin, BookOpen } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function StoryPage({ params }: PageProps) {
    const { id } = await params;
    const story = getStory(id);

    if (!story) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-950 pb-20">
            <Navbar />

            <div className="relative h-[50vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-slate-900" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="container mx-auto">
                        <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-bold rounded-full border border-amber-500/20 backdrop-blur-md mb-4">
                            {story.period}
                        </span>
                        <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-4 max-w-4xl">
                            {story.title}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-slate-300 text-lg">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-amber-500" />
                                {story.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-amber-500" />
                                {story.totalActs} Acts
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <p className="text-xl text-slate-300 leading-relaxed mb-12">
                        {story.description}
                    </p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-2xl font-serif font-bold text-white mb-6">Your Journey Begins</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4 text-slate-400">
                                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">1</div>
                                <p>First 15 acts are free to play</p>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">2</div>
                                <p>Solve minigames to progress</p>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">3</div>
                                <p>Unlock premium acts with coins</p>
                            </div>
                        </div>

                        <Link href={`/story/${id}/read`} className="block">
                            <Button size="lg" className="w-full text-xl py-6">
                                Start Reading
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
