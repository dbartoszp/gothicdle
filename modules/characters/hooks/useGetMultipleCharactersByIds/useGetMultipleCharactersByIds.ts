import { useQuery } from '@tanstack/react-query';
import { getMultipleCharactersByIds } from './apiUseGetMultipleCharactersByIds';

export const useGetMultipleCharactersByIds = (ids: number[]) => {
	return useQuery({
		queryKey: ['character', ids],
		queryFn: () => getMultipleCharactersByIds(ids),
		refetchOnWindowFocus: true,
	});
};
