import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Manga } from '../backend';

export function useGetMangaById(mangaId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Manga>({
    queryKey: ['manga', mangaId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMangaById(mangaId);
    },
    enabled: !!actor && !isFetching,
  });
}
