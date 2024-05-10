import { useQuery } from '@tanstack/react-query';
import { getCurrentCorrectCharacterTesting } from './apiUseGetCurrentCharacterTesting';

export const useGetCurrentCorrectCharacterTesting = () => {
  return useQuery({
    queryKey: ['currentCorrectCharacterTesting'],
    queryFn: () => getCurrentCorrectCharacterTesting(),
    refetchOnWindowFocus: true,
  });
};
