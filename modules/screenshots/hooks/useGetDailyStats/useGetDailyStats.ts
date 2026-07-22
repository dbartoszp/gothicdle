import { useQuery } from '@tanstack/react-query';
import { getDailyStats } from './apiUseGetDailyStats';

export const useGetDailyStats = (date: string) => {
  return useQuery({
    queryKey: ['dailyStats', date],
    queryFn: () => getDailyStats(date),
    refetchOnWindowFocus: false,
  });
};
