import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Manga } from '../backend';

export function useSearchManga(term: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Manga[]>({
    queryKey: ['searchManga', term],
    queryFn: async () => {
      if (!actor) return [];
      if (!term.trim()) return [];
      return actor.searchManga(term);
    },
    enabled: !!actor && !isFetching && term.trim().length > 0,
  });
}
