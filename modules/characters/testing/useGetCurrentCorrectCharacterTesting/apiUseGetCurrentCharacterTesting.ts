import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterIdSchema } from '../../hooks/characterIdSchema.schema';
import { characterSchema } from '../../hooks/characterSchema.schema';

export const getCurrentCorrectCharacterTesting = async () => {
  const supabase = createClientComponentClient();

  const { data } = await supabase
    .from('currentCorrectCharacterTesting')
    .select('characterId')
    .single();
  const characterId = characterIdSchema.safeParse(data);
  if (characterId.success) {
    const { data: characterData } = await supabase
      .from('characterTesting')
      .select('*')
      .eq('id', characterId.data.characterId)
      .single();
    const character = characterSchema.safeParse(characterData);
    if (character.success) {
      return character.data;
    }
    throw character.error;
  }
  throw characterId.error;
};
