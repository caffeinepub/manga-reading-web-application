import { useParams, Link } from '@tanstack/react-router';
import { useGetMangaById } from '../hooks/useGetMangaById';
import ChapterList from '../components/ChapterList';
import BookmarkButton from '../components/BookmarkButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function MangaDetailsPage() {
  const { id } = useParams({ from: '/manga/$id' });
  const { data: manga, isLoading } = useGetMangaById(BigInt(id));

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Manga not found</p>
      </div>
    );
  }

  const coverUrl = manga.coverImage?.getDirectURL() || '/assets/generated/manga-cover-placeholder.dim_400x600.png';

  return (
    <div className="container py-8 space-y-8">
      <Link to="/">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Button>
      </Link>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-4">
          <img
            src={coverUrl}
            alt={manga.title}
            className="w-full rounded-lg shadow-lg"
          />
          <BookmarkButton mangaId={manga.id} />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{manga.title}</h1>
            <p className="text-muted-foreground">{manga.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Chapters</h2>
            {manga.chapters.length > 0 ? (
              <ChapterList mangaId={manga.id} chapters={manga.chapters} />
            ) : (
              <p className="text-muted-foreground">No chapters available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
