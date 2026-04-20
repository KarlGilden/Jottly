import { BaseRepository } from "./base.repository.js";
import type { AudioRecord } from "../types/audio.types.js";
import { toMysqlDateTime } from "../utils/datetime.js";

interface AudioRow {
  id: number;
  translation_id: number;
  user_id: number;
  audio_url: string;
  created_at: string;
}

function mapAudio(row: AudioRow): AudioRecord {
  return {
    id: row.id,
    translationId: row.translation_id,
    userId: row.user_id,
    audioUrl: row.audio_url,
    createdAt: row.created_at,
  };
}

export class AudioRepository extends BaseRepository {
  async findByTranslationId(userId: number, translationId: number): Promise<AudioRecord | null> {
    const row = (await this.db("audio")
      .where({ translation_id: translationId, user_id: userId })
      .first<AudioRow>("id", "translation_id", "user_id", "audio_url", "created_at")) as AudioRow | undefined;

    return row ? mapAudio(row) : null;
  }

  async create(userId: number, translationId: number, audioUrl: string): Promise<AudioRecord> {
    const createdAt = toMysqlDateTime(new Date());
    const result = await this.db("audio").insert({
      audio_url: audioUrl,
      created_at: createdAt,
      translation_id: translationId,
      user_id: userId,
    });

    const id = Number(Array.isArray(result) ? result[0] : result);
    const audio = (await this.db("audio")
      .where({ id, user_id: userId })
      .first<AudioRow>("id", "translation_id", "user_id", "audio_url", "created_at")) as AudioRow | undefined;

    if (!audio) {
      throw new Error("Audio record was not created");
    }

    return mapAudio(audio);
  }

  async deleteByTranslationIds(userId: number, translationIds: number[]): Promise<void> {
    if (translationIds.length === 0) {
      return;
    }

    await this.db("audio").where({ user_id: userId }).whereIn("translation_id", translationIds).delete();
  }
}
