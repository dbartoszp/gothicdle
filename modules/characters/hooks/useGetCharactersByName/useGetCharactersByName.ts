import { useQuery } from '@tanstack/react-query';
import { getCharactersByName } from './apiUseGetCharactersByName';

export const useGetCharactersByName = (name: string) => {
  return useQuery({
    queryKey: ['character', name],
    queryFn: () => getCharactersByName(name),
    refetchOnWindowFocus: true,
  });
};
