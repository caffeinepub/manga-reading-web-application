import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import type { Manga } from '../backend';

interface MangaCardProps {
  manga: Manga;
}

export default function MangaCard({ manga }: MangaCardProps) {
  const coverUrl = manga.coverImage?.getDirectURL() || '/assets/generated/manga-cover-placeholder.dim_400x600.png';
  
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] border-border/50">
      <Link to="/manga/$id" params={{ id: String(manga.id) }}>
        <div className="aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={coverUrl}
            alt={manga.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            loading="lazy"
          />
        </div>
      </Link>
      
      <CardContent className="p-4 space-y-2">
        <CardTitle className="line-clamp-1 text-lg">{manga.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {manga.description}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link to="/manga/$id" params={{ id: String(manga.id) }} className="w-full">
          <Button className="w-full gap-2" variant="default">
            <BookOpen className="w-4 h-4" />
            Read Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
