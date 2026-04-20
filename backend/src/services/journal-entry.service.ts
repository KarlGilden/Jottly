import { createJournalEntrySchema, updateJournalEntrySchema } from "../schemas/journal-entry.schema.js";
import { JournalEntryRepository } from "../repositories/journal-entry.repository.js";
import { AudioRepository } from "../repositories/audio.repository.js";
import { splitIntoSentences } from "../utils/sentences.js";
import { resolveEntryTitle } from "../utils/title.js";
import { TranslationService } from "./translation.service.js";
import type { EntrySentencePair, JournalEntry, JournalEntryDetail, JournalEntryListItem } from "../types/journal-entry.types.js";

export class JournalEntryService {
  constructor(
    private journalEntryRepository: JournalEntryRepository,
    private audioRepository: AudioRepository,
    private translationService: TranslationService,
  ) {}

  async createEntry(userId: number, data: unknown): Promise<JournalEntry> {
    const parsed = createJournalEntrySchema.parse(data);
    const entry = await this.journalEntryRepository.create(userId, {
      ...parsed,
      title: resolveEntryTitle(parsed.title, parsed.content),
    });

    if (parsed.targetLanguages.length > 0) {
      await this.translationService.createMissingTranslations(userId, entry, [parsed.targetLanguages[0]]);
    }

    return entry;
  }

  async getEntries(userId: number): Promise<JournalEntryListItem[]> {
    return this.journalEntryRepository.findAll(userId);
  }

  async getEntryById(
    userId: number,
    id: number,
    selectedLanguage?: string,
  ): Promise<JournalEntryDetail> {
    const entryContent = await this.journalEntryRepository.findContentById(userId, id);

    if (!entryContent) {
      throw new Error("Journal entry not found");
    }

    if (selectedLanguage) {
      await this.translationService.ensureTranslationForLanguage(userId, entryContent, selectedLanguage);
    }

    const entry = await this.journalEntryRepository.findById(userId, id);

    if (!entry) {
      throw new Error("Journal entry not found");
    }

    const originalSentences = splitIntoSentences(entry.content);

    return {
      ...entry,
      translations: entry.translations.map((translation) => ({
        ...translation,
        sentences: this.buildSentencePairs(originalSentences, splitIntoSentences(translation.content)),
      })),
    };
  }

  async updateEntry(userId: number, id: number, data: unknown): Promise<JournalEntry> {
    const parsed = updateJournalEntrySchema.parse(data);
    const currentEntry = await this.journalEntryRepository.findContentById(userId, id);

    if (!currentEntry) {
      throw new Error("Journal entry not found");
    }

    const updatedEntry = await this.journalEntryRepository.update(userId, id, {
      ...parsed,
      title: resolveEntryTitle(parsed.title, parsed.content),
    });

    if (!updatedEntry) {
      throw new Error("Journal entry not found");
    }

    if (currentEntry.content !== parsed.content) {
      const translationIds = await this.translationService.updateExistingTranslations(userId, updatedEntry);
      await this.audioRepository.deleteByTranslationIds(userId, translationIds);
    }

    return updatedEntry;
  }

  private buildSentencePairs(originalSentences: string[], translatedSentences: string[]): EntrySentencePair[] {
    const longestLength = Math.max(originalSentences.length, translatedSentences.length);
    const pairs: EntrySentencePair[] = [];

    for (let index = 0; index < longestLength; index += 1) {
      pairs.push({
        originalSentence: originalSentences[index] ?? "",
        translatedSentence: translatedSentences[index] ?? "",
      });
    }

    return pairs.filter((pair) => pair.originalSentence || pair.translatedSentence);
  }
}
