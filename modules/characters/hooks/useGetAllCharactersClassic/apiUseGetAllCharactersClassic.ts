import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterArraySchema } from '../characterSchema.schema';

export const getAllCharactersClassic = async () => {
  const supabase = createClientComponentClient();

  const { data } = await supabase.from('character').select('*');
  const characters = characterArraySchema.safeParse(data);
  if (characters.success) {
    return characters.data;
  }
  throw characters.error;
};
