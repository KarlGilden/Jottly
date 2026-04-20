import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { entryIdParamsSchema } from "../schemas/journal-entry.schema.js";
import { AudioRepository } from "../repositories/audio.repository.js";
import { JournalEntryRepository } from "../repositories/journal-entry.repository.js";
import { TranslationRepository } from "../repositories/translation.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { GoogleTranslateService } from "../services/google-translate.service.js";
import { TranslationService } from "../services/translation.service.js";
import { JournalEntryService } from "../services/journal-entry.service.js";
import { UserService } from "../services/user.service.js";

export async function entryRoutes(fastify: FastifyInstance): Promise<void> {
	const entryQuerySchema = z.object({
		language: z.string().trim().min(2).optional(),
	});
	const journalEntryRepository = new JournalEntryRepository();
	const translationRepository = new TranslationRepository();
	const userService = new UserService(new UserRepository());
	const translationService = new TranslationService(
		journalEntryRepository,
		translationRepository,
		new GoogleTranslateService(),
	);
	const journalEntryService = new JournalEntryService(
		journalEntryRepository,
		new AudioRepository(),
		translationService,
	);

	fastify.get("/entries", async (request, reply) => {
		const clerkUserId = request.auth?.userId;

		if (!clerkUserId) {
			return reply.code(401).send({ message: "Unauthorized" });
		}

		const user = await userService.getUserByClerkId(clerkUserId);

		if (!user) {
			return reply.code(404).send({ message: "User not found" });
		}

		const entries = await journalEntryService.getEntries(user.id);
		return reply.send(entries);
	});

	fastify.get("/entries/:id", async (request, reply) => {
		const clerkUserId = request.auth?.userId;

		if (!clerkUserId) {
			return reply.code(401).send({ message: "Unauthorized" });
		}

		const user = await userService.getUserByClerkId(clerkUserId);

		if (!user) {
			return reply.code(404).send({ message: "User not found" });
		}

		const { id } = entryIdParamsSchema.parse(request.params);
		const { language } = entryQuerySchema.parse(request.query);
		const entry = await journalEntryService.getEntryById(user.id, id, language);
		return reply.send(entry);
	});

	fastify.post("/entries", async (request, reply) => {
		const clerkUserId = request.auth?.userId;

		if (!clerkUserId) {
			return reply.code(401).send({ message: "Unauthorized" });
		}

		const user = await userService.getUserByClerkId(clerkUserId);

		if (!user) {
			return reply.code(404).send({ message: "User not found" });
		}

		const entry = await journalEntryService.createEntry(user.id, request.body);
		return reply.code(201).send(entry);
	});

	fastify.put("/entries/:id", async (request, reply) => {
		const clerkUserId = request.auth?.userId;

		if (!clerkUserId) {
			return reply.code(401).send({ message: "Unauthorized" });
		}

		const user = await userService.getUserByClerkId(clerkUserId);

		if (!user) {
			return reply.code(404).send({ message: "User not found" });
		}

		const { id } = entryIdParamsSchema.parse(request.params);
		const entry = await journalEntryService.updateEntry(
			user.id,
			id,
			request.body,
		);
		return reply.send(entry);
	});
}
