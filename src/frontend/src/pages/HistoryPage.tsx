import { useGetReadingHistory } from '../hooks/useGetReadingHistory';
import { useGetAllManga } from '../hooks/useGetAllManga';
import HistoryCard from '../components/HistoryCard';
import { Loader2, History } from 'lucide-react';

export default function HistoryPage() {
  const { data: history, isLoading: historyLoading } = useGetReadingHistory();
  const { data: allManga, isLoading: mangaLoading } = useGetAllManga();

  const isLoading = historyLoading || mangaLoading;

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const historyWithManga = history
    ?.map((entry) => {
      const manga = allManga?.find((m) => m.id === entry.mangaId);
      return manga ? { manga, lastChapter: Number(entry.chapterNumber) } : null;
    })
    .filter((item): item is { manga: any; lastChapter: number } => item !== null)
    .sort((a, b) => {
      const aEntry = history?.find((h) => h.mangaId === a.manga.id);
      const bEntry = history?.find((h) => h.mangaId === b.manga.id);
      return Number(bEntry?.timestamp || 0) - Number(aEntry?.timestamp || 0);
    });

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <History className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Reading History</h1>
        </div>
        <p className="text-muted-foreground">
          Continue where you left off
        </p>
      </div>

      {historyWithManga && historyWithManga.length > 0 ? (
        <div className="max-w-3xl mx-auto space-y-4">
          {historyWithManga.map((item) => (
            <HistoryCard
              key={Number(item.manga.id)}
              manga={item.manga}
              lastChapter={item.lastChapter}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            You haven't read any manga yet.
          </p>
        </div>
      )}
    </div>
  );
}
