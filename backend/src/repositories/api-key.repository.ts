import { BaseRepository } from "./base.repository.js";
import type { ApiKeyRecord } from "../types/api-key.types.js";

interface ApiKeyRow {
	id: number;
	user_id: number;
	apikey: string;
	iv: string;
	type: string;
}

function mapApiKey(row: ApiKeyRow): ApiKeyRecord {
	return {
		id: row.id,
		userId: row.user_id,
		apikey: row.apikey,
		iv: row.iv,
		type: row.type,
	};
}

export class ApiKeyRepository extends BaseRepository {
	async getApiKeyByType(
		userId: number,
		type: string,
	): Promise<ApiKeyRecord | null> {
		const row = (await this.db("user_apikeys")
			.where({ type, user_id: userId })
			.orderBy("id", "desc")
			.first<ApiKeyRow>("id", "user_id", "apikey", "type", "iv")) as
			| ApiKeyRow
			| undefined;

		return row ? mapApiKey(row) : null;
	}

	async upsertApiKey(
		userId: number,
		type: string,
		encryptedKey: string,
		iv: string,
	): Promise<ApiKeyRecord> {
		const existingRecord = await this.getApiKeyByType(userId, type);

		if (existingRecord) {
			await this.db("user_apikeys")
				.where({ id: existingRecord.id, user_id: userId, type })
				.update({ apikey: encryptedKey, iv: iv });

			const updatedRecord = await this.getApiKeyByType(userId, type);

			if (!updatedRecord) {
				throw new Error("API key was not updated");
			}

			await this.db("user_apikeys")
				.where({ user_id: userId, type })
				.whereNot({ id: updatedRecord.id })
				.del();

			return updatedRecord;
		}

		const result = await this.db("user_apikeys").insert({
			apikey: encryptedKey,
			iv: iv,
			type,
			user_id: userId,
		});

		const id = Number(Array.isArray(result) ? result[0] : result);
		const row = (await this.db("user_apikeys")
			.where({ id, user_id: userId, type })
			.first<ApiKeyRow>("id", "user_id", "apikey", "type")) as
			| ApiKeyRow
			| undefined;

		if (!row) {
			throw new Error("API key was not created");
		}

		return mapApiKey(row);
	}
}
