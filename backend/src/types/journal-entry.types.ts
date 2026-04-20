export interface JournalEntry {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface JournalEntryListItem extends JournalEntry {
  languages: string[];
}

export interface JournalEntryDetail extends JournalEntry {
  translations: TranslationWithAudio[];
}

export interface CreateJournalEntryInput {
  title: string;
  content: string;
  targetLanguages: string[];
}

export interface UpdateJournalEntryInput {
  title: string;
  content: string;
  targetLanguages: string[];
}

export interface EntrySentencePair {
  originalSentence: string;
  translatedSentence: string;
}

export interface TranslationWithAudio {
  id: number;
  entryId: number;
  userId: number;
  language: string;
  content: string;
  audioUrl: string | null;
  sentences: EntrySentencePair[];
}
