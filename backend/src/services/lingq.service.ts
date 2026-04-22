import type { ApiKeyRepository } from "../repositories/api-key.repository.js";
import { ApiKeyStatus } from "../types/api-key.types.js";
import { LingqImportInput, LingqImportOutput } from "../types/linqq.types.js";
import { useFetch } from "../utils/data.js";
import { decrypt, encrypt } from "../utils/encryption.js";

export class LingqService {
	constructor(private apiKeyRepository: ApiKeyRepository) {}

	async getLingqApiKey(userId: number): Promise<string> {
		const record = await this.apiKeyRepository.getApiKeyByType(userId, "lingq");

		if (!record) {
			throw new Error("LingQ API key not found");
		}

		return decrypt(record.apikey, record.iv);
	}

	async setLingqApiKey(userId: number, apiKey: string): Promise<void> {
		const { content, iv } = encrypt(apiKey);

		await this.apiKeyRepository.upsertApiKey(userId, "lingq", content, iv);
	}

	async hasLingqApiKey(userId: number): Promise<ApiKeyStatus> {
		const record = await this.apiKeyRepository.getApiKeyByType(userId, "lingq");

		if (record?.apikey) {
			const testResult = await fetch(`https://www.lingq.com/api/v3/es/cards/`, {
				method: "GET",
				headers: {
					Authorization: `Token ${decrypt(record.apikey, record.iv)}`,
					"Content-Type": "application/json",
				},
			});

			if (!testResult.ok) {
				return ApiKeyStatus.InvalidKey;
			} else {
				return ApiKeyStatus.Connected;
			}
		}
		return ApiKeyStatus.NotConnected;
	}

	async createLesson(
		userId: number,
		lesson: LingqImportInput,
		iso: string,
	): Promise<LingqImportOutput> {
		const apiKey = await this.getLingqApiKey(userId);

		const response = await useFetch<Promise<LingqImportOutput>>(
			`https://www.lingq.com/api/v3/${iso}/lessons/import/`,
			{
				headers: {
					Authorization: "Token " + apiKey,
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify(lesson),
			},
		);

		return response;
	}
}
