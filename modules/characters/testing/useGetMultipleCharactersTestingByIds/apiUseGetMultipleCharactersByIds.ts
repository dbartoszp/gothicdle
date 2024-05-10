import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterArraySchema } from '../../hooks/characterSchema.schema';

export const getMultipleCharactersTestingByIds = async (ids: number[]) => {
	const supabase = createClientComponentClient();

	const { data } = await supabase.from('characterTesting').select('*').in('id', ids);

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
