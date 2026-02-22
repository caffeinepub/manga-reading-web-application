import { useEffect } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useGetMangaById } from '../hooks/useGetMangaById';
import { useRecordReadingHistory } from '../hooks/useRecordReadingHistory';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function ReaderPage() {
  const { id, chapterNumber } = useParams({ from: '/manga/$id/chapter/$chapterNumber' });
  const navigate = useNavigate();
  const { data: manga, isLoading } = useGetMangaById(BigInt(id));
  const { mutate: recordHistory } = useRecordReadingHistory();

  const currentChapterNum = Number(chapterNumber);
  const currentChapter = manga?.chapters.find(ch => Number(ch.chapterNumber) === currentChapterNum);

  useEffect(() => {
    if (manga && currentChapter) {
      recordHistory({ mangaId: manga.id, chapterNumber: BigInt(currentChapterNum) });
    }
  }, [manga, currentChapter, currentChapterNum, recordHistory]);

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!manga || !currentChapter) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Chapter not found</p>
      </div>
    );
  }

  const hasPrevious = currentChapterNum > 1;
  const hasNext = currentChapterNum < manga.chapters.length;

  const goToPrevious = () => {
    if (hasPrevious) {
      navigate({ to: '/manga/$id/chapter/$chapterNumber', params: { id, chapterNumber: String(currentChapterNum - 1) } });
    }
  };

  const goToNext = () => {
    if (hasNext) {
      navigate({ to: '/manga/$id/chapter/$chapterNumber', params: { id, chapterNumber: String(currentChapterNum + 1) } });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/manga/$id" params={{ id }}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Details
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="font-semibold">{manga.title}</h1>
            <p className="text-sm text-muted-foreground">
              Chapter {currentChapterNum}: {currentChapter.title}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              disabled={!hasPrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              disabled={!hasNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {currentChapter.images.map((image, index) => (
          <img
            key={index}
            src={image.getDirectURL()}
            alt={`Page ${index + 1}`}
            className="w-full"
            loading={index < 3 ? 'eager' : 'lazy'}
          />
        ))}
      </div>

      <div className="container py-8 flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={!hasPrevious}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Chapter
        </Button>
        <Button
          variant="outline"
          onClick={goToNext}
          disabled={!hasNext}
          className="gap-2"
        >
          Next Chapter
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
