import { useQuery } from '@tanstack/react-query';
import { getLatestScreenshots } from './apiUseGetLatestScreenshots';

export const useGetLatestScreenshots = (limit = 3) => {
  return useQuery({
    queryKey: ['screenshots', limit],
    queryFn: () => getLatestScreenshots(limit),
    refetchOnWindowFocus: true,
  });
};
