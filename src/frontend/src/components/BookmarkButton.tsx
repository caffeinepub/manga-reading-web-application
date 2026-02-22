import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useAddBookmark } from '../hooks/useAddBookmark';
import { useRemoveBookmark } from '../hooks/useRemoveBookmark';
import { useGetBookmarks } from '../hooks/useGetBookmarks';
import { toast } from 'sonner';

interface BookmarkButtonProps {
  mangaId: bigint;
}

export default function BookmarkButton({ mangaId }: BookmarkButtonProps) {
  const { data: bookmarks } = useGetBookmarks();
  const { mutate: addBookmark, isPending: isAdding } = useAddBookmark();
  const { mutate: removeBookmark, isPending: isRemoving } = useRemoveBookmark();
  
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (bookmarks) {
      setIsBookmarked(bookmarks.some((manga) => manga.id === mangaId));
    }
  }, [bookmarks, mangaId]);

  const handleToggle = () => {
    if (isBookmarked) {
      removeBookmark(mangaId, {
        onSuccess: () => {
          toast.success('Bookmark removed');
        },
        onError: (error) => {
          toast.error(`Failed to remove bookmark: ${error.message}`);
        },
      });
    } else {
      addBookmark(mangaId, {
        onSuccess: () => {
          toast.success('Bookmark added');
        },
        onError: (error) => {
          toast.error(`Failed to add bookmark: ${error.message}`);
        },
      });
    }
  };

  const isPending = isAdding || isRemoving;

  return (
    <Button
      variant={isBookmarked ? 'default' : 'outline'}
      onClick={handleToggle}
      disabled={isPending}
      className="gap-2"
    >
      {isBookmarked ? (
        <>
          <BookmarkCheck className="w-4 h-4" />
          Bookmarked
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          Bookmark
        </>
      )}
    </Button>
  );
}
