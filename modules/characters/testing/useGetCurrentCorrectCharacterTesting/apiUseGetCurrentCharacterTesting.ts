import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterIdSchema } from '../../hooks/characterIdSchema.schema';
import { characterSchema } from '../../hooks/characterSchema.schema';

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

		const { data: characterData } = await supabase
			.from('characterTesting')
			.select('*')
			.eq('id', characterId.data.characterId)
			.single();
		console.log(characterData);
		const character = characterSchema.safeParse(characterData);
		if (character.success) {
			console.log(character.data);
			return character.data;
		}
		throw character.error;
	}
	throw characterId.error;
};
