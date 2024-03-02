import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterArraySchema } from '../characterSchema.schema';

export const getCharactersByName = async (name: string) => {
  const supabase = createClientComponentClient();

  const { data } = await supabase
    .from('character')
    .select('*')
    .ilike('imie', `%${name}%`);

  const characters = characterArraySchema.safeParse(data);

  if (characters.success) {
    return characters.data;
  }
  throw characters.error;
};
