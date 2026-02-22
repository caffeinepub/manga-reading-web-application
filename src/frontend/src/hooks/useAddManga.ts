import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

interface AddMangaParams {
  title: string;
  description: string;
  coverImage: ExternalBlob;
}

export function useAddManga() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, coverImage }: AddMangaParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addManga(title, description, coverImage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mangaList'] });
      queryClient.invalidateQueries({ queryKey: ['allManga'] });
    },
  });
}
