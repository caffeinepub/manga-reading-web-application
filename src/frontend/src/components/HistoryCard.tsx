import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import type { Manga } from '../backend';

interface HistoryCardProps {
  manga: Manga;
  lastChapter: number;
}

export default function HistoryCard({ manga, lastChapter }: HistoryCardProps) {
  const coverUrl = manga.coverImage?.getDirectURL() || '/assets/generated/manga-cover-placeholder.dim_400x600.png';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      <div className="flex gap-4 p-4">
        <Link to="/manga/$id" params={{ id: String(manga.id) }} className="flex-shrink-0">
          <img
            src={coverUrl}
            alt={manga.title}
            className="w-24 h-36 object-cover rounded"
            loading="lazy"
          />
        </Link>
        
        <CardContent className="flex-1 p-0 flex flex-col justify-between">
          <div>
            <Link to="/manga/$id" params={{ id: String(manga.id) }}>
              <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                {manga.title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Last read: Chapter {lastChapter}
            </p>
          </div>
          
          <Link to="/manga/$id/chapter/$chapterNumber" params={{ id: String(manga.id), chapterNumber: String(lastChapter) }}>
            <Button className="gap-2 mt-4">
              <PlayCircle className="w-4 h-4" />
              Continue Reading
            </Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
}
