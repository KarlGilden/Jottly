import { z } from "zod";

import { DEFAULT_TARGET_LANGUAGES } from "../utils/constants.js";
import { ENTRY_TITLE_MAX_LENGTH } from "../utils/title.js";

export const createJournalEntrySchema = z.object({
  title: z.string().trim().max(ENTRY_TITLE_MAX_LENGTH).default(""),
  content: z.string().trim().min(1),
  targetLanguages: z.array(z.string().trim().min(2)).min(1).default(DEFAULT_TARGET_LANGUAGES),
});

export const updateJournalEntrySchema = z.object({
  title: z.string().trim().max(ENTRY_TITLE_MAX_LENGTH).default(""),
  content: z.string().trim().min(1),
  targetLanguages: z.array(z.string().trim().min(2)).min(1).default(DEFAULT_TARGET_LANGUAGES),
});

export const entryIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
