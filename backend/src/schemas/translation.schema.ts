import { z } from "zod";

export const createTranslationsSchema = z.object({
  entryId: z.number().int().positive(),
  targetLanguages: z.array(z.string().trim().min(2)).min(1),
});
