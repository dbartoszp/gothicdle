import { z } from 'zod';

export const characterSchema = z.object({
  imie: z.string(),
  przynaleznosc: z.array(z.string()),
  wystepowanie: z.array(z.string()),
  bron: z.array(z.string()),
  zbroja: z.array(z.string()),
  zdjecie: z.string(),
});

export const characterArraySchema = z.array(characterSchema);
// import { z } from 'zod';

// export const characterSchema = z.object({
//   imie: z.string().nullable(),
//   przynaleznosc: z.array(z.string().nullable()),
//   wystepowanie: z.array(z.string().nullable()),
//   bron: z.array(z.string().nullable()),
//   zbroja: z.array(z.string().nullable()),
//   zdjecie: z.string().nullable(),
// });

// export const characterArraySchema = z.array(characterSchema);
