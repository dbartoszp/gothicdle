import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterArraySchema } from '../characterSchema.schema';

export const getAllCharactersByDatabase = async (database: string) => {
  const supabase = createClientComponentClient();

  const { data } = await supabase.from(`character${database}`).select('*');
  const characters = characterArraySchema.safeParse(data);
  if (characters.success) {
    return characters.data;
  }
  throw characters.error;
};
