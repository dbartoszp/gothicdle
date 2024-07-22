import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterArraySchema } from '../characterSchema.schema';

type getCharactersByDatabaseAndNameParams = {
  name: string;
  database: string;
};

export const getCharactersByDatabaseAndName = async ({
  name,
  database,
}: getCharactersByDatabaseAndNameParams) => {
  const supabase = createClientComponentClient();

  const { data } = await supabase
    .from(`character${database}`)
    .select('*')
    .ilike('imie', `%${name}%`);

  const characters = characterArraySchema.safeParse(data);

  if (characters.success) {
    return characters.data;
  }
  throw characters.error;
};
