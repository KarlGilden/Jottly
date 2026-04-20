interface ElevenLabsVoiceResponse {
  audioBuffer: ArrayBuffer;
}

export class ElevenLabsService {
  async generateAudio(content: string): Promise<ElevenLabsVoiceResponse> {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    const modelId = process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";

    if (!apiKey || !voiceId) {
      const buffer = Buffer.from(content, "utf-8");
      return {
        audioBuffer: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
      };
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        model_id: modelId,
        text: content,
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs request failed with status ${response.status}`);
    }

    return {
      audioBuffer: await response.arrayBuffer(),
    };
  }
}
