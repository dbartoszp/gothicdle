import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterSchema } from '../characterSchema.schema';

type getCharacterByIdAndDatabaseParams = {
  id: number;
  database: string;
};

export const getCharacterByIdAndDatabase = async ({
  id,
  database,
}: getCharacterByIdAndDatabaseParams) => {
  const supabase = createClientComponentClient();

  const { data } = await supabase
    .from(`character${database}`)
    .select('*')
    .eq('id', id)
    .single();
  const character = characterSchema.safeParse(data);
  if (character.success) {
    return character.data;
  }
  throw character.error;
};
