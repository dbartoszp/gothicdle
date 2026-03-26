import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type gameSummaryGlobalArg = {
  guesses: number[];
  totalScore: number;
  date: string;
};

export const updateGameSummaryGlobal = async (
  gameSummaryGlobal: gameSummaryGlobalArg
) => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase.rpc('increment_total_score', {
    row_date: gameSummaryGlobal.date,
    increment_value: gameSummaryGlobal.totalScore,
  });

  return null;
};
