import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { previousCharactersIdsSchema } from '../previousCorrectCharacters.schema';
import { characterIdsSchema } from '../characterIdsSchema.schema';

export const getCurrentCorrectCharacter = async () => {
  const supabase = createClientComponentClient();

  const { data: allCharacterIdsData } = await supabase
    .from('character')
    .select('id');

  const { data: previousCharactersIdData } = await supabase
    .from('previousCorrectCharacters')
    .select('characterId');

  const allCharacterIdsParsed =
    characterIdsSchema.safeParse(allCharacterIdsData);
  const previousCharactersIdsParsed = previousCharactersIdsSchema.safeParse(
    previousCharactersIdData
  );

  if (!allCharacterIdsParsed.success) {
    throw allCharacterIdsParsed.error;
  }
  if (!previousCharactersIdsParsed.success) {
    throw previousCharactersIdsParsed.error;
  }

  const allCharacterIdsArray = allCharacterIdsParsed.data.map(
    (character) => character.id
  );
  const previousCharactersIdsArray = previousCharactersIdsParsed.data.map(
    (character) => character.characterId
  );

  const availableCharacterIds = allCharacterIdsArray.filter(
    (id) => !previousCharactersIdsArray.includes(id)
  );

  const firstAvailableCharacter =
    availableCharacterIds.length > 0 ? availableCharacterIds.at(0) : 1;

  return firstAvailableCharacter;
};
