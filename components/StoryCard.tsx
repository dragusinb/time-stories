import Link from 'next/link';
import { Story } from '@/types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Clock, MapPin, BookOpen } from 'lucide-react';

interface StoryCardProps {
    story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
    return (
        <Card className="group hover:border-amber-500/50 transition-colors overflow-hidden flex flex-col h-full">
            <div className="h-48 bg-slate-800 relative overflow-hidden rounded-t-lg -mx-6 -mt-6 mb-4">
                {/* Cover Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />

                {story.coverImage ? (
                    <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 bg-slate-800">
                        <span className="text-4xl">📜</span>
                    </div>
                )}

                <div className="absolute bottom-4 left-4 z-20">
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/20 backdrop-blur-md">
                        {story.period}
                    </span>
                </div>
            </div>

            <h3 className="text-xl font-serif font-bold text-slate-100 mb-2 group-hover:text-amber-400 transition-colors">
                {story.title}
            </h3>

            <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-3">
                {story.description}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
                <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {story.location}
                </div>
                <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {story.totalActs} Acts
                </div>
            </div>

            <Link href={`/story/${story.id}`} className="w-full">
                <Button className="w-full" variant="outline">
                    Start Adventure
                </Button>
            </Link>
        </Card>
    );
}
