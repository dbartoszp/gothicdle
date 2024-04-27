import { z } from 'zod';

export const characterIdSchema = z.object({
	characterId: z.number(),
});
