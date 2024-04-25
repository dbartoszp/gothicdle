import { useQuery } from '@tanstack/react-query';
import { getCurrentCorrectCharacter } from './apiUseGetCurrentCorrectCharacter';

export const useGetCurrentCorrectCharacter = () => {
  return useQuery({
    queryKey: ['character', 'previousCorrectCharacters'],
    queryFn: () => getCurrentCorrectCharacter(),
    refetchOnWindowFocus: true,
  });
};
