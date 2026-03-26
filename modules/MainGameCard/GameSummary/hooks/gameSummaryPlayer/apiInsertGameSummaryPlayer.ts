import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type gameSummaryPlayerArg = {
  guesses: number[];
  totalScore: number;
  date: string;
};

export const insertGameSummaryPlayer = async (
  gameSummaryPlayer: gameSummaryPlayerArg
) => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from('gameSummaryPlayer')
    .insert([
      {
        guesses: gameSummaryPlayer.guesses,
        totalScore: gameSummaryPlayer.totalScore,
        date: gameSummaryPlayer.date,
      },
    ])
    .select();

  return null;
};
