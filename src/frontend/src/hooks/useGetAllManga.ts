import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Manga } from '../backend';

export function useGetAllManga() {
  const { actor, isFetching } = useActor();

  return useQuery<Manga[]>({
    queryKey: ['allManga'],
    queryFn: async () => {
      if (!actor) return [];
      const allManga: Manga[] = [];
      let page = 0;
      let hasMore = true;

      while (hasMore) {
        const batch = await actor.getMangaList(BigInt(page));
        if (batch.length === 0) {
          hasMore = false;
        } else {
          allManga.push(...batch);
          page++;
        }
      }

      return allManga;
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}
