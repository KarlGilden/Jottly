import { z } from "zod";

export const createAudioSchema = z.object({
  translationId: z.number().int().positive(),
});

export const audioParamsSchema = z.object({
  translationId: z.coerce.number().int().positive(),
});
