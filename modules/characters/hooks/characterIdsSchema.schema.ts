import { z } from 'zod';

export const characterIdsSchema = z.array(
  z.object({
    id: z.number(),
  })
);
