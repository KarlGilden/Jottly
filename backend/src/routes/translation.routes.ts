import type { FastifyInstance } from "fastify";

import { JournalEntryRepository } from "../repositories/journal-entry.repository.js";
import { TranslationRepository } from "../repositories/translation.repository.js";
import { GoogleTranslateService } from "../services/google-translate.service.js";
import { TranslationService } from "../services/translation.service.js";
import { UserRepository } from "../repositories/user.repository.js";
import { UserService } from "../services/user.service.js";

export async function translationRoutes(fastify: FastifyInstance): Promise<void> {
  const userService = new UserService(new UserRepository());
  const translationService = new TranslationService(
    new JournalEntryRepository(),
    new TranslationRepository(),
    new GoogleTranslateService(),
  );

  fastify.post("/translations", async (request, reply) => {
    const clerkUserId = request.auth?.userId;

    if (!clerkUserId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const user = await userService.getUserByClerkId(clerkUserId);

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    await translationService.createTranslations(user.id, request.body);
    return reply.code(202).send({ success: true });
  });
}
