import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

interface AddChapterParams {
  mangaId: bigint;
  title: string;
  images: ExternalBlob[];
}

export function useAddChapter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mangaId, title, images }: AddChapterParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addChapter(mangaId, title, images);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['manga', variables.mangaId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['allManga'] });
    },
  });
}
