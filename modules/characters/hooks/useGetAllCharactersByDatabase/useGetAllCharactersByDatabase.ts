import { useQuery } from '@tanstack/react-query';
import { getAllCharactersByDatabase } from './apiUseGetAllCharactersByDatabase';

export const useGetAllCharactersByDatabase = (database: string) => {
  return useQuery({
    queryKey: ['character', database],
    queryFn: () => getAllCharactersByDatabase(database),
    refetchOnWindowFocus: true,
  });
};
