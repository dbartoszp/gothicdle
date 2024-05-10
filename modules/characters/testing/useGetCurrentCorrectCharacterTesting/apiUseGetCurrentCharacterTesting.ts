import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterIdSchema } from '../../hooks/characterIdSchema.schema';

export const getCurrentCorrectCharacterTesting = async () => {
	const supabase = createClientComponentClient();

	const { data } = await supabase
		.from('currentCorrectCharacterTesting')
		.select('characterId')
		.single();

	const characterId = characterIdSchema.safeParse(data);
	if (characterId.success) {
		return characterId.data;
	}
	throw characterId.error;
};
