import { createSavedWordSchema } from "../schemas/saved-word.schema.js";
import { SavedWordRepository } from "../repositories/saved-word.repository.js";
import type { SavedWord } from "../types/saved-word.types.js";

export class SavedWordService {
  constructor(private savedWordRepository: SavedWordRepository) {}

  async getSavedWords(userId: number): Promise<SavedWord[]> {
    return this.savedWordRepository.findAll(userId);
  }

  async createSavedWord(userId: number, data: unknown): Promise<SavedWord> {
    const parsed = createSavedWordSchema.parse(data);
    return this.savedWordRepository.create(userId, parsed);
  }
}
