import { BaseRepository } from "./base.repository.js";
import type { CreateSavedWordInput, SavedWord } from "../types/saved-word.types.js";
import { toMysqlDateTime } from "../utils/datetime.js";

interface SavedWordRow {
  id: number;
  user_id: number;
  word: string;
  translation: string;
  context_sentence: string;
  created_at: string;
}

function mapSavedWord(row: SavedWordRow): SavedWord {
  return {
    id: row.id,
    userId: row.user_id,
    word: row.word,
    translation: row.translation,
    contextSentence: row.context_sentence,
    createdAt: row.created_at,
  };
}

export class SavedWordRepository extends BaseRepository {
  async findAll(userId: number): Promise<SavedWord[]> {
    const rows = (await this.db("saved_words")
      .where({ user_id: userId })
      .orderBy("created_at", "desc")
      .select<SavedWordRow[]>("id", "user_id", "word", "translation", "context_sentence", "created_at")) as SavedWordRow[];

    return rows.map(mapSavedWord);
  }

  async create(userId: number, data: CreateSavedWordInput): Promise<SavedWord> {
    const createdAt = toMysqlDateTime(new Date());
    const result = await this.db("saved_words").insert({
      context_sentence: data.contextSentence,
      created_at: createdAt,
      translation: data.translation,
      user_id: userId,
      word: data.word,
    });

    const id = Number(Array.isArray(result) ? result[0] : result);
    const row = (await this.db("saved_words")
      .where({ id, user_id: userId })
      .first<SavedWordRow>("id", "user_id", "word", "translation", "context_sentence", "created_at")) as
      | SavedWordRow
      | undefined;

    if (!row) {
      throw new Error("Saved word was not created");
    }

    return mapSavedWord(row);
  }
}
