import { useQuery } from '@tanstack/react-query';
import { getCurrentCorrectCharacter } from './apiUseGetCurrentCorrectCharacter';

export const useGetCurrentCorrectCharacter = () => {
  return useQuery({
    queryKey: ['currentCorrectCharacter'],
    queryFn: () => getCurrentCorrectCharacter(),
    refetchOnWindowFocus: true,
    staleTime: Infinity,
  });
};
