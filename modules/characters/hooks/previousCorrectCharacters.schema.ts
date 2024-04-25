import { z } from 'zod';

export const previousCharactersIdsSchema = z.array(
  z.object({
    characterId: z.number(),
  })
);
