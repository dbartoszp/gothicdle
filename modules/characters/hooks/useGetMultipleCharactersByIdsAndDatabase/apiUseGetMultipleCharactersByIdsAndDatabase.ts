import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterArraySchema } from '../characterSchema.schema';

type getMultipleCharactersByIdsAndDatabase = {
  ids: number[];
  database: string;
};

export const getMultipleCharactersByIdsAndDatabase = async ({
  ids,
  database,
}: getMultipleCharactersByIdsAndDatabase) => {
  const supabase = createClientComponentClient();
  console.log(database, ids);
  const { data } = await supabase
    .from(`character${database}`)
    .select('*')
    .in('id', ids);

  const characters = characterArraySchema.safeParse(data);

  if (characters.success) {
    const charactersMap = new Map();
    characters.data.forEach((character) => {
      charactersMap.set(character.id, character);
    });

    const orderedCharacters = ids.reverse().map((id) => {
      return charactersMap.get(id);
    });

    return orderedCharacters;
  }
  throw characters.error;
};
