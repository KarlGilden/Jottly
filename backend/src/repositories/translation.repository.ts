import { BaseRepository } from "./base.repository.js";
import type { Translation } from "../types/translation.types.js";

interface TranslationRow {
  id: number;
  entry_id: number;
  user_id: number;
  language: string;
  content: string;
}

function mapTranslation(row: TranslationRow): Translation {
  return {
    id: row.id,
    entryId: row.entry_id,
    userId: row.user_id,
    language: row.language,
    content: row.content,
  };
}

export class TranslationRepository extends BaseRepository {
  async findByEntryId(userId: number, entryId: number): Promise<Translation[]> {
    const rows = (await this.db("translations")
      .where({ entry_id: entryId, user_id: userId })
      .orderBy("language", "asc")
      .select<TranslationRow[]>("id", "entry_id", "user_id", "language", "content")) as TranslationRow[];

    return rows.map(mapTranslation);
  }

  async findByEntryAndLanguage(userId: number, entryId: number, language: string): Promise<Translation | null> {
    const row = (await this.db("translations")
      .where({ entry_id: entryId, language, user_id: userId })
      .first<TranslationRow>("id", "entry_id", "user_id", "language", "content")) as TranslationRow | undefined;

    return row ? mapTranslation(row) : null;
  }

  async findById(userId: number, id: number): Promise<Translation | null> {
    const row = (await this.db("translations")
      .where({ id, user_id: userId })
      .first<TranslationRow>("id", "entry_id", "user_id", "language", "content")) as TranslationRow | undefined;

    return row ? mapTranslation(row) : null;
  }

  async create(userId: number, entryId: number, language: string, content: string): Promise<Translation> {
    const result = await this.db("translations").insert({
      content,
      entry_id: entryId,
      language,
      user_id: userId,
    });

    const id = Number(Array.isArray(result) ? result[0] : result);
    const translation = await this.findById(userId, id);

    if (!translation) {
      throw new Error("Translation was not created");
    }

    return translation;
  }

  async updateContent(id: number, userId: number, content: string): Promise<Translation | null> {
    const updatedRows = await this.db("translations")
      .where({ id, user_id: userId })
      .update({
        content,
      });

    if (updatedRows === 0) {
      return null;
    }

    return this.findById(userId, id);
  }

  async deleteByEntryId(userId: number, entryId: number): Promise<number[]> {
    const translationIds = (await this.db("translations")
      .where({ entry_id: entryId, user_id: userId })
      .pluck("id")) as number[];

    await this.db("translations").where({ entry_id: entryId, user_id: userId }).delete();

    return translationIds;
  }
}
