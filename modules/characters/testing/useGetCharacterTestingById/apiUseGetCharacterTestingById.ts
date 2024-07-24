import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterSchema } from '../../hooks/characterSchema.schema';

export const getCharacterTestingById = async (id: number) => {
  const supabase = createClientComponentClient();

  const { data } = await supabase
    .from('characterTesting')
    .select('*')
    .eq('id', id)
    .single();
  const character = characterSchema.safeParse(data);
  if (character.success) {
    return character.data;
  }
  throw character.error;
};
