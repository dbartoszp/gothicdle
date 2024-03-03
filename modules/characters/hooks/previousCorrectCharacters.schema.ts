import { z } from 'zod';

export const previousCorrectCharacterSchema = z.array(
  z.object({
    characterId: z.number(),
  })
);
