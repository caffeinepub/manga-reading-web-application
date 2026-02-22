import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import type { Chapter } from '../backend';

interface ChapterListProps {
  mangaId: bigint;
  chapters: Chapter[];
}

export default function ChapterList({ mangaId, chapters }: ChapterListProps) {
  const sortedChapters = [...chapters].sort((a, b) => Number(a.chapterNumber) - Number(b.chapterNumber));

  return (
    <div className="space-y-2">
      {sortedChapters.map((chapter) => (
        <Card key={Number(chapter.chapterNumber)} className="p-4 hover:bg-accent transition-colors">
          <Link
            to="/manga/$id/chapter/$chapterNumber"
            params={{ id: String(mangaId), chapterNumber: String(chapter.chapterNumber) }}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex-1">
              <h3 className="font-medium">Chapter {Number(chapter.chapterNumber)}</h3>
              <p className="text-sm text-muted-foreground">{chapter.title}</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Read
            </Button>
          </Link>
        </Card>
      ))}
    </div>
  );
}
