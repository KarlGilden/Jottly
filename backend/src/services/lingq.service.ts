import { LingqImportInput, LingqImportOutput } from "../types/linqq.types.js";
import { useFetch } from "../utils/data.js";

export class LingqService {
	constructor() {}

	async importLesson(
		lessonData: LingqImportInput,
		apikey: string,
		iso: string,
	) {
		const response = await useFetch<Promise<LingqImportOutput>>(
			`https://www.lingq.com/api/v3/${iso}/lessons/import/`,
			{
				headers: {
					Authorization: "Token " + apikey,
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify(lessonData),
			},
		);

		return response;
	}
}
