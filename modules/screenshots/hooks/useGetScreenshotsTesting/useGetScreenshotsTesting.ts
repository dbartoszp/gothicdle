import { useQuery } from '@tanstack/react-query';
import { getFirstThreeScreenshots } from './apiUseGetScreenshotsTesting';

export const useGetScreenshotsTesting = () => {
  const query = useQuery({
    queryKey: ['screenshots', 'firstThree'],
    queryFn: getFirstThreeScreenshots,
    refetchOnWindowFocus: false,
  });

  return query;
};
