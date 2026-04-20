interface GoogleTranslateResponse {
  data?: {
    translations?: Array<{
      translatedText: string;
    }>;
  };
}

export class GoogleTranslateService {
  async translateText(content: string, targetLanguage: string): Promise<string> {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      return `[${targetLanguage}] ${content}`;
    }

    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        format: "text",
        q: content,
        target: targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Translate request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as GoogleTranslateResponse;
    const translatedText = payload.data?.translations?.[0]?.translatedText;

    if (!translatedText) {
      throw new Error("Google Translate response did not include translated text");
    }

    return translatedText;
  }
}
