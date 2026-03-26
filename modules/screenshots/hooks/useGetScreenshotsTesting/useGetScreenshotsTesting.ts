import { useQuery } from '@tanstack/react-query';
import { getScreenshots } from './apiUseGetScreenshotsTesting';

export const useGetScreenshotsTesting = () => {
  const query = useQuery({
    queryKey: ['screenshots'],
    queryFn: getScreenshots,
    refetchOnWindowFocus: false,
  });

  return query;
};
