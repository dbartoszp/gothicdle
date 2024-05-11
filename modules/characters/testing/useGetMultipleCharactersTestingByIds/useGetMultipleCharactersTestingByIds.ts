import { useQuery } from '@tanstack/react-query';
import { getMultipleCharactersTestingByIds } from './apiUseGetMultipleCharactersByIds';

export const useGetMultipleCharactersTestingByIds = (ids: number[]) => {
	return useQuery({
		queryKey: ['characterTesting', ids],
		queryFn: () => getMultipleCharactersTestingByIds(ids),
		refetchOnWindowFocus: true,
	});
};
