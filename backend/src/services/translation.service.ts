import { createTranslationsSchema } from "../schemas/translation.schema.js";
import type { JournalEntry } from "../types/journal-entry.types.js";
import { GoogleTranslateService } from "./google-translate.service.js";
import { JournalEntryRepository } from "../repositories/journal-entry.repository.js";
import { TranslationRepository } from "../repositories/translation.repository.js";

export class TranslationService {
  constructor(
    private journalEntryRepository: JournalEntryRepository,
    private translationRepository: TranslationRepository,
    private googleTranslateService: GoogleTranslateService,
  ) {}

  async createTranslations(userId: number, data: unknown): Promise<void> {
    const parsed = createTranslationsSchema.parse(data);
    const entry = await this.getEntryOrThrow(userId, parsed.entryId);

    await this.createMissingTranslations(userId, entry, parsed.targetLanguages);
  }

  async createMissingTranslations(userId: number, entry: JournalEntry, targetLanguages: string[]): Promise<void> {
    for (const language of targetLanguages) {
      await this.ensureTranslationForLanguage(userId, entry, language);
    }
  }

  async ensureTranslationForLanguage(userId: number, entry: JournalEntry, language: string): Promise<void> {
    const existingTranslation = await this.translationRepository.findByEntryAndLanguage(
      userId,
      entry.id,
      language,
    );

    if (existingTranslation) {
      return;
    }

    const translatedContent = await this.googleTranslateService.translateText(entry.content, language);

    try {
      await this.translationRepository.create(userId, entry.id, language, translatedContent);
    } catch (error) {
      const duplicateTranslation = await this.translationRepository.findByEntryAndLanguage(
        userId,
        entry.id,
        language,
      );

      if (duplicateTranslation) {
        return;
      }

      throw error;
    }
  }

  async updateExistingTranslations(userId: number, entry: JournalEntry): Promise<number[]> {
    const existingTranslations = await this.translationRepository.findByEntryId(userId, entry.id);

    for (const translation of existingTranslations) {
      const translatedContent = await this.googleTranslateService.translateText(entry.content, translation.language);
      await this.translationRepository.updateContent(translation.id, userId, translatedContent);
    }

    return existingTranslations.map((translation) => translation.id);
  }

  private async getEntryOrThrow(userId: number, entryId: number): Promise<JournalEntry> {
    const entry = await this.journalEntryRepository.findContentById(userId, entryId);

    if (!entry) {
      throw new Error("Journal entry not found");
    }

    return entry;
  }
}
