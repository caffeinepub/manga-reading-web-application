import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Manga } from '../backend';

export function useGetBookmarks() {
  const { actor, isFetching } = useActor();

  return useQuery<Manga[]>({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookmarks();
    },
    enabled: !!actor && !isFetching,
  });
}
