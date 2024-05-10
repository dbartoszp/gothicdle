import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterIdSchema } from '../../hooks/characterIdSchema.schema';

export const getCurrentCorrectCharacterTesting = async () => {
  const supabase = createClientComponentClient();

  const { data } = await supabase
    .from('currentCorrectCharacterTesting')
    .select('characterId')
    .single();
  console.log(data);
  const characterId = characterIdSchema.safeParse(data);
  if (characterId.success) {
    console.log(characterId.data);
    return characterId.data;
  }
  throw characterId.error;
};
