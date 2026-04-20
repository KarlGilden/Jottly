import type { FastifyInstance } from "fastify";

import { SavedWordRepository } from "../repositories/saved-word.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { SavedWordService } from "../services/saved-word.service.js";
import { UserService } from "../services/user.service.js";

export async function savedWordRoutes(fastify: FastifyInstance): Promise<void> {
  const userService = new UserService(new UserRepository());
  const savedWordService = new SavedWordService(new SavedWordRepository());

  fastify.get("/saved-words", async (request, reply) => {
    const clerkUserId = request.auth?.userId;

    if (!clerkUserId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const user = await userService.getUserByClerkId(clerkUserId);

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    const savedWords = await savedWordService.getSavedWords(user.id);
    return reply.send(savedWords);
  });

  fastify.post("/saved-words", async (request, reply) => {
    const clerkUserId = request.auth?.userId;

    if (!clerkUserId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const user = await userService.getUserByClerkId(clerkUserId);

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    const savedWord = await savedWordService.createSavedWord(user.id, request.body);
    return reply.code(201).send(savedWord);
  });
}
