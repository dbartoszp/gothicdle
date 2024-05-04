import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { characterArraySchema } from '../characterSchema.schema';

export const getMultipleCharactersByIds = async (ids: number[]) => {
	const supabase = createClientComponentClient();

	const { data } = await supabase.from('character').select('*').in('id', ids);
	const characters = characterArraySchema.safeParse(data);
	if (characters.success) {
		return characters.data;
	}
	throw characters.error;
};
