import { useQuery } from '@tanstack/react-query';
import { getMultipleCharactersByIdsAndDatabase } from './apiUseGetMultipleCharactersByIdsAndDatabase';
type getMultipleCharactersByIdsAndDatabase = {
  ids: number[];
  database: string;
};
export const useGetMultipleCharactersByIdsAndDatabase = ({
  ids,
  database,
}: getMultipleCharactersByIdsAndDatabase) => {
  return useQuery({
    queryKey: ['character', ids, database],
    queryFn: () => getMultipleCharactersByIdsAndDatabase({ ids, database }),
    refetchOnWindowFocus: true,
  });
};
