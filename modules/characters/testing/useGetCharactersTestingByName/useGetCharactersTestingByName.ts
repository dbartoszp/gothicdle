import { useQuery } from '@tanstack/react-query';
import { getCharactersTestingByName } from './apiUseGetCharactersTestingByName';

export const useGetCharactersTestingByName = (name: string) => {
  return useQuery({
    queryKey: ['characterTesting', name],
    queryFn: () => getCharactersTestingByName(name),
    refetchOnWindowFocus: true,
  });
};
