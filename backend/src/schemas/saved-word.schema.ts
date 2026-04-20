import { z } from "zod";

export const createSavedWordSchema = z.object({
  word: z.string().trim().min(1),
  translation: z.string().trim().min(1),
  contextSentence: z.string().trim().min(1),
});
