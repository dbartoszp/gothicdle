import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export type DailyStats = {
  avgTotal: number;
  avgGuesses: number[];
  allTotals: number[];
  allGuesses: number[][];
};

export const getDailyStats = async (date: string): Promise<DailyStats> => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase.rpc('get_daily_stats', {
    p_date: date,
  });

  if (error) {
    throw new Error(`Failed to fetch daily stats: ${error.message}`);
  }

  return data as DailyStats;
};
