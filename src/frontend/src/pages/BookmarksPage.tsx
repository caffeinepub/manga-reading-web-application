import { useGetBookmarks } from '../hooks/useGetBookmarks';
import MangaCard from '../components/MangaCard';
import { Loader2, BookMarked } from 'lucide-react';

export default function BookmarksPage() {
  const { data: bookmarks, isLoading } = useGetBookmarks();

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <BookMarked className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">My Bookmarks</h1>
        </div>
        <p className="text-muted-foreground">
          Your saved manga collection
        </p>
      </div>

      {bookmarks && bookmarks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {bookmarks.map((manga) => (
            <MangaCard key={Number(manga.id)} manga={manga} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            You haven't bookmarked any manga yet.
          </p>
        </div>
      )}
    </div>
  );
}
