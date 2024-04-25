import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterIdsSchema } from '../characterIdsSchema.schema';

export const setNextNewCurrentCorrectCharacter = async () => {
  const supabase = createClientComponentClient();

  const { data: currentData, error: currentError } = await supabase
    .from('currentCorrectCharacter')
    .select('characterId')
    .single();

  if (currentError) {
    throw currentError;
  }

  const { data: allCharacterIdsData } = await supabase
    .from('character')
    .select('id');

  const allCharacterIdsParsed =
    characterIdsSchema.safeParse(allCharacterIdsData);

  if (!allCharacterIdsParsed.success) {
    throw allCharacterIdsParsed.error;
  }

  const allCharacterIdsArray = allCharacterIdsParsed.data.map(
    (character) => character.id
  );
  const lastCharacterId = allCharacterIdsArray[allCharacterIdsArray.length - 1];

  let newCharacterId;

  if (currentData.characterId === lastCharacterId) {
    newCharacterId = 1;
  } else {
    newCharacterId = currentData.characterId + 1;
  }

  const { error: updateError } = await supabase
    .from('currentCorrectCharacter')
    .update({ characterId: newCharacterId })
    .eq('id', 1);

  if (updateError) {
    throw updateError;
  }
};
