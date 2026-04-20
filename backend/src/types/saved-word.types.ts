export interface SavedWord {
  id: number;
  userId: number;
  word: string;
  translation: string;
  contextSentence: string;
  createdAt: string;
}

export interface CreateSavedWordInput {
  word: string;
  translation: string;
  contextSentence: string;
}
