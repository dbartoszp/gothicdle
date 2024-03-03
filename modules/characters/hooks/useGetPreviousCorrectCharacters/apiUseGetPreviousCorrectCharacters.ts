import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { previousCorrectCharacterSchema } from '../previousCorrectCharacters.schema';

export const getPreviousCorrectCharacters = async () => {
  const supabase = createClientComponentClient();

  const { data } = await supabase
    .from('previousCorrectCharacters')
    .select('characterId');

  const characterIds = previousCorrectCharacterSchema.safeParse(data);
  if (characterIds.success) {
    return characterIds.data;
  }
  throw characterIds.error;
};
