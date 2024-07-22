import { useQuery } from '@tanstack/react-query';
import { getCharacterByIdAndDatabase } from './apiUseGetCharacterByIdAndDatabase';

type getCharacterByIdAndDatabaseParams = {
  id: number;
  database: string;
};
export const useGetCharacterByIdAndDatabase = ({
  id,
  database,
}: getCharacterByIdAndDatabaseParams) => {
  return useQuery({
    queryKey: ['character', id, database],
    queryFn: () => getCharacterByIdAndDatabase({ id, database }),
    refetchOnWindowFocus: true,
  });
};
