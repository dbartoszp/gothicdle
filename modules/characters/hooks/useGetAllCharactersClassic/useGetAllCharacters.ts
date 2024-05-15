import { useQuery } from '@tanstack/react-query';
import { getAllCharactersClassic } from './apiUseGetAllCharactersClassic';

export const useGetAllCharactersClassic = () => {
  return useQuery({
    queryKey: ['character'],
    queryFn: () => getAllCharactersClassic(),
    refetchOnWindowFocus: true,
  });
};
