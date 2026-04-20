import fs from "node:fs/promises";
import path from "node:path";

import { createAudioSchema } from "../schemas/audio.schema.js";
import { AudioRepository } from "../repositories/audio.repository.js";
import { TranslationRepository } from "../repositories/translation.repository.js";
import { ElevenLabsService } from "./elevenlabs.service.js";
import type { AudioRecord } from "../types/audio.types.js";
import { staticAudioDirectory } from "../plugins/db.js";

export class AudioService {
  constructor(
    private audioRepository: AudioRepository,
    private translationRepository: TranslationRepository,
    private elevenLabsService: ElevenLabsService,
  ) {}

  async getAudioByTranslationId(userId: number, translationId: number): Promise<AudioRecord | null> {
    return this.audioRepository.findByTranslationId(userId, translationId);
  }

  async createAudio(userId: number, data: unknown): Promise<AudioRecord> {
    const parsed = createAudioSchema.parse(data);
    const existingAudio = await this.audioRepository.findByTranslationId(userId, parsed.translationId);

    if (existingAudio) {
      return existingAudio;
    }

    const translation = await this.translationRepository.findById(userId, parsed.translationId);

    if (!translation) {
      throw new Error("Translation not found");
    }

    const voiceResponse = await this.elevenLabsService.generateAudio(translation.content);
    const fileName = `translation-${translation.id}.mp3`;
    const absoluteFilePath = path.resolve(staticAudioDirectory, fileName);

    await fs.writeFile(absoluteFilePath, Buffer.from(voiceResponse.audioBuffer));

    return this.audioRepository.create(userId, translation.id, `/static/audio/${fileName}`);
  }
}
