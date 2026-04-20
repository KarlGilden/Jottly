import { FastifyInstance } from "fastify";
import { LingqService } from "../services/lingq.service.js";
import { LingqImportInput } from "../types/linqq.types.js";

export async function exportRoutes(fastify: FastifyInstance): Promise<void> {
	const lingqService = new LingqService();

	fastify.post("/lingq", async (req, res) => {
		const lessonData = req.body as LingqImportInput;

		if (!lessonData) return res.status(400).send();

		const lessonOutput = await lingqService.importLesson(
			lessonData,
			"2d71e317a43665206017141dd05534d88df6b79d",
			lessonData.language,
		);

		return res.send(lessonOutput);
	});
}
