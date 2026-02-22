import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface RecordHistoryParams {
  mangaId: bigint;
  chapterNumber: bigint;
}

export function useRecordReadingHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mangaId, chapterNumber }: RecordHistoryParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordReadingHistory(mangaId, chapterNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingHistory'] });
    },
  });
}
