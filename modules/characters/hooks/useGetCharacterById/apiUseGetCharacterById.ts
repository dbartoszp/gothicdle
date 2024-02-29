import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterSchema } from '../characterSchema.schema';

export const getCharacterById = async (id: number) => {
  const supabase = createClientComponentClient();

  const { data } = await supabase
    .from('character')
    .select('*')
    .eq('id', id)
    .single();
  const character = characterSchema.safeParse(data);
  if (character.success) {
    return character.data;
  }
  throw character.error;
};
