import { useQuery } from '@tanstack/react-query';
import { getFirstScreenshotTesting } from './apiUseGetScreenshotTesting';

export const useGetScreenshotTesting = () => {
  return useQuery({
    queryKey: ['screenshot', 'first'],
    queryFn: getFirstScreenshotTesting,
    refetchOnWindowFocus: true,
  });
};
