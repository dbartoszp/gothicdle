import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setNextNewCurrentCorrectCharacter } from './apiUseSetNextNewCurrentCorrectCharacter';

export const useSetNextNewCurrentCorrectCharacter = () => {
  return useMutation({
    mutationFn: () => setNextNewCurrentCorrectCharacter(),
  });
};
