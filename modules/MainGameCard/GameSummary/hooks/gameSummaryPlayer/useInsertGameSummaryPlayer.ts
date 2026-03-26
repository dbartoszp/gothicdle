import { useQuery } from '@tanstack/react-query';
import { insertGameSummaryPlayer } from './apiInsertGameSummaryPlayer';

type gameSummaryPlayerArg = {
  guesses: [number];
  totalScore: number;
  date: string;
};
export const useInsertGameSummaryPlayer = (
  gameSummaryPlayer: gameSummaryPlayerArg
) => {
  const query = useQuery({
    queryKey: ['gameSummaryPlayer'],
    queryFn: () => insertGameSummaryPlayer(gameSummaryPlayer),
    refetchOnWindowFocus: false,
  });

  return query;
};
