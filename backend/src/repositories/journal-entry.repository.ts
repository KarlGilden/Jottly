import { BaseRepository } from "./base.repository.js";
import { toMysqlDateTime } from "../utils/datetime.js";
import type {
  CreateJournalEntryInput,
  JournalEntry,
  JournalEntryDetail,
  JournalEntryListItem,
  TranslationWithAudio,
  UpdateJournalEntryInput,
} from "../types/journal-entry.types.js";

interface JournalEntryRow {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
}

interface TranslationLanguageRow {
  entry_id: number;
  language: string;
}

function mapJournalEntry(row: JournalEntryRow): JournalEntry {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
  };
}

export class JournalEntryRepository extends BaseRepository {
  async create(userId: number, data: CreateJournalEntryInput): Promise<JournalEntry> {
    const createdAt = toMysqlDateTime(new Date());
    const result = await this.db("journal_entries").insert({
      content: data.content,
      created_at: createdAt,
      title: data.title,
      user_id: userId,
    });

    const id = Number(Array.isArray(result) ? result[0] : result);
    const entry = await this.findContentById(userId, id);

    if (!entry) {
      throw new Error("Journal entry was not created");
    }

    return entry;
  }

  async findAll(userId: number): Promise<JournalEntryListItem[]> {
    const entries = (await this.db("journal_entries")
      .where({ user_id: userId })
      .orderBy("created_at", "desc")
      .select<JournalEntryRow[]>("id", "user_id", "title", "content", "created_at")) as JournalEntryRow[];

    const languages = (await this.db("translations")
      .where({ user_id: userId })
      .select<TranslationLanguageRow[]>("entry_id", "language")) as TranslationLanguageRow[];

    return entries.map((entry) => ({
      ...mapJournalEntry(entry),
      languages: languages
        .filter((row) => row.entry_id === entry.id)
        .map((row) => row.language),
    }));
  }

  async findById(userId: number, id: number): Promise<JournalEntryDetail | null> {
    const entryRow = (await this.db("journal_entries")
      .where({ id, user_id: userId })
      .first<JournalEntryRow>("id", "user_id", "title", "content", "created_at")) as JournalEntryRow | undefined;

    if (!entryRow) {
      return null;
    }

    const translationRows = (await this.db("translations as t")
      .leftJoin("audio as a", function joinAudio() {
        this.on("a.translation_id", "=", "t.id").andOn("a.user_id", "=", "t.user_id");
      })
      .where("t.user_id", userId)
      .andWhere("t.entry_id", id)
      .orderBy("t.language", "asc")
      .select(
        "t.id",
        "t.entry_id",
        "t.user_id",
        "t.language",
        "t.content",
        "a.audio_url",
      )) as Array<{
      id: number;
      entry_id: number;
      user_id: number;
      language: string;
      content: string;
      audio_url: string | null;
    }>;

    const translations: TranslationWithAudio[] = translationRows.map((translation) => ({
      id: translation.id,
      entryId: translation.entry_id,
      userId: translation.user_id,
      language: translation.language,
      content: translation.content,
      audioUrl: translation.audio_url,
      sentences: [],
    }));

    return {
      ...mapJournalEntry(entryRow),
      translations,
    };
  }

  async findContentById(userId: number, id: number): Promise<JournalEntry | null> {
    const entry = (await this.db("journal_entries")
      .where({ id, user_id: userId })
      .first<JournalEntryRow>("id", "user_id", "title", "content", "created_at")) as JournalEntryRow | undefined;

    return entry ? mapJournalEntry(entry) : null;
  }

  async update(userId: number, id: number, data: UpdateJournalEntryInput): Promise<JournalEntry | null> {
    const updatedRows = await this.db("journal_entries")
      .where({ id, user_id: userId })
      .update({
        content: data.content,
        title: data.title,
      });

    if (updatedRows === 0) {
      return null;
    }

    return this.findContentById(userId, id);
  }
}
