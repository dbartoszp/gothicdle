import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setNextNewCurrentCorrectCharacter } from './apiUseSetNextNewCurrentCorrectCharacter';

export const useSetNextNewCurrentCorrectCharacter = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => setNextNewCurrentCorrectCharacter(),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['currentCorrectCharacter'],
			});
		},
	});
};
