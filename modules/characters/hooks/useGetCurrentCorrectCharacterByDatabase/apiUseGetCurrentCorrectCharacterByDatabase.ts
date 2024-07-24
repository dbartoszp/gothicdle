import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterIdSchema } from '../characterIdSchema.schema';
import { characterSchema } from '../characterSchema.schema';

export const getCurrentCorrectCharacterByDatabase = async (
  database: string
) => {
  const supabase = createClientComponentClient();

  const { data } = await supabase
    .from(`currentCorrectCharacter${database}`)
    .select('characterId')
    .single();

  const characterId = characterIdSchema.safeParse(data);
  if (characterId.success) {
    const { data: characterData } = await supabase
      .from(`character${database}`)
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
