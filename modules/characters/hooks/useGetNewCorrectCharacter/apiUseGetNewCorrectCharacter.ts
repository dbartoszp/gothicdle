// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import { characterSchema } from '../characterSchema.schema';
// import { previousCorrectCharacterSchema } from '../previousCorrectCharacters.schema';

// type getNewCorrectCharacterProps = {
//   previousCorrectCharactersIds: number[];
// };

// export const getNewCorrectCharacter = async ({
//   previousCorrectCharactersIds,
// }: getNewCorrectCharacterProps) => {
//   const supabase = createClientComponentClient();

//   const { data: allCharacterIdsData } = await supabase
//     .from('character')
//     .select('id');
//   const allCharacterIds =
//     previousCorrectCharacterSchema.safeParse(allCharacterIdsData);

//   if (allCharacterIds.success) {
//     const availableCharacterIds = allCharacterIds?.data.filter(
//       (character) =>
//         !previousCorrectCharactersIds.includes(character.characterId)
//     );

//     let newCorrectCharacterId;

//     if (availableCharacterIds.length === 0) {
//       newCorrectCharacterId = 1;
//     } else {
//       newCorrectCharacterId = availableCharacterIds.at(0);
//     }

//     const { data } = await supabase
//       .from('character')
//       .select('*')
//       .eq('id', newCorrectCharacterId)
//       .single();
//     const character = characterSchema.safeParse(data);
//     if (character.success) {
//       return character.data;
//     }
//     throw character.error;
//   }
// };
