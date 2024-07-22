import { useQuery } from '@tanstack/react-query';
import { getCurrentCorrectCharacterByDatabase } from './apiUseGetCurrentCorrectCharacterByDatabase';

export const useGetCurrentCorrectCharacterByDatabase = (database: string) => {
  return useQuery({
    queryKey: ['currentCorrectCharacter', database],
    queryFn: () => getCurrentCorrectCharacterByDatabase(database),
    refetchOnWindowFocus: true,
    staleTime: Infinity,
  });
};
