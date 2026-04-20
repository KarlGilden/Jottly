export interface Translation {
  id: number;
  entryId: number;
  userId: number;
  language: string;
  content: string;
}

export interface CreateTranslationsInput {
  entryId: number;
  targetLanguages: string[];
}
