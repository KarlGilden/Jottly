import type { FastifyInstance } from "fastify";

import { createLingqLessonSchema } from "../schemas/lingq.schema.js";
import { ApiKeyRepository } from "../repositories/api-key.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { LingqService } from "../services/lingq.service.js";
import { UserService } from "../services/user.service.js";
import { LingqImportInput } from "../types/linqq.types.js";

export async function exportRoutes(fastify: FastifyInstance): Promise<void> {
	const userService = new UserService(new UserRepository());
	const lingqService = new LingqService(new ApiKeyRepository());

	fastify.post("/lingq", async (request, reply) => {
		const clerkUserId = request.auth?.userId;

		if (!clerkUserId) {
			return reply.code(401).send({ message: "Unauthorized" });
		}

		const user = await userService.getUserByClerkId(clerkUserId);

		if (!user) {
			return reply.code(404).send({ message: "User not found" });
		}

		const lessonData = request.body as LingqImportInput;
		const lessonOutput = await lingqService.createLesson(
			user.id,
			lessonData,
			lessonData.language,
		);

		return reply.send(lessonOutput);
	});
}
