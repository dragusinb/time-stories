import { Navbar } from '@/components/Navbar';
import { StoryReader } from '@/components/StoryReader';
import { getStory, stories } from '@/lib/data';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return stories.map((story) => ({
        id: story.id,
    }));
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ReadPage({ params }: PageProps) {
    const { id } = await params;
    const story = getStory(id);

    if (!story) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-950">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <StoryReader story={story} />
            </div>
        </main>
    );
}
