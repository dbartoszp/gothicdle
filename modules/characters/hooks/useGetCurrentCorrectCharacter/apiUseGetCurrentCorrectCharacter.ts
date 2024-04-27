import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterIdSchema } from '../characterIdSchema.schema';

export const getCurrentCorrectCharacter = async () => {
	const supabase = createClientComponentClient();

	const { data } = await supabase
		.from('currentCorrectCharacter')
		.select('characterId')
		.single();

	const characterId = characterIdSchema.safeParse(data);
	if (characterId.success) {
		return characterId.data;
	}
	throw characterId.error;
};
