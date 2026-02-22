import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ReadingHistory } from '../backend';

export function useGetReadingHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<ReadingHistory[]>({
    queryKey: ['readingHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReadingHistory();
    },
    enabled: !!actor && !isFetching,
  });
}
