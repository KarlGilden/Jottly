import { z } from "zod";

export const setLingqApiKeySchema = z.object({
  apiKey: z.string().trim().min(1),
});

export const createLingqLessonSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
});
