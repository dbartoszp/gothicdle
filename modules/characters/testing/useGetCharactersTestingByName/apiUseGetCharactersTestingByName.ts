import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterArraySchema } from '../../hooks/characterSchema.schema';

export const getCharactersTestingByName = async (name: string) => {
  const supabase = createClientComponentClient();

  const { data } = await supabase
    .from('characterTesting')
    .select('*')
    .ilike('imie', `%${name}%`);

  const characters = characterArraySchema.safeParse(data);

  if (characters.success) {
    return characters.data;
  }
  throw characters.error;
};
