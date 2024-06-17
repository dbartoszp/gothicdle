import { z } from 'zod';

export const characterSchema = z.object({
  imie: z.string(),
  przynaleznosc: z.array(z.string()),
  wystepowanie: z.array(z.string()),
  bron: z.array(z.string()),
  zbroja: z.array(z.string()),
  zdjecie: z.string().nullable(),
  id: z.number(),
});

export const characterArraySchema = z.array(characterSchema);
