import { useQuery } from '@tanstack/react-query';
import { getCharacterTestingById } from './apiUseGetCharacterById';

export const useGetCharacterTestingById = (id: number) => {
  return useQuery({
    queryKey: ['characterTesting', id],
    queryFn: () => getCharacterTestingById(id),
    refetchOnWindowFocus: true,
  });
};
