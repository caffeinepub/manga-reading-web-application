import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Manga } from '../backend';

export function useGetMangaList(page: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Manga[]>({
    queryKey: ['mangaList', page],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMangaList(BigInt(page));
    },
    enabled: !!actor && !isFetching,
  });
}
