import { useQuery } from '@tanstack/react-query';
import { getCharacterById } from './apiUseGetCharacterById';

export const useGetCharacterById = (id: number) => {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => getCharacterById(id),
    refetchOnWindowFocus: true,
  });
};
