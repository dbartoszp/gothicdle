import { useQuery } from '@tanstack/react-query';
import { getCharactersByDatabaseAndName } from './apiUseGetCharactersByDatabaseAndName';

type getCharactersByDatabaseAndNameParams = {
  name: string;
  database: string;
};
export const useGetCharactersByDatabaseAndName = ({
  name,
  database,
}: getCharactersByDatabaseAndNameParams) => {
  return useQuery({
    queryKey: ['character', name, database],
    queryFn: () => getCharactersByDatabaseAndName({ name, database }),
    refetchOnWindowFocus: true,
  });
};
