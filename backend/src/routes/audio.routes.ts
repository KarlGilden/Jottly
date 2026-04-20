import type { FastifyInstance } from "fastify";

import { audioParamsSchema } from "../schemas/audio.schema.js";
import { AudioRepository } from "../repositories/audio.repository.js";
import { TranslationRepository } from "../repositories/translation.repository.js";
import { AudioService } from "../services/audio.service.js";
import { ElevenLabsService } from "../services/elevenlabs.service.js";
import { UserRepository } from "../repositories/user.repository.js";
import { UserService } from "../services/user.service.js";

export async function audioRoutes(fastify: FastifyInstance): Promise<void> {
  const userService = new UserService(new UserRepository());
  const audioService = new AudioService(
    new AudioRepository(),
    new TranslationRepository(),
    new ElevenLabsService(),
  );

  fastify.get("/audio/:translationId", async (request, reply) => {
    const clerkUserId = request.auth?.userId;

    if (!clerkUserId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const user = await userService.getUserByClerkId(clerkUserId);

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    const { translationId } = audioParamsSchema.parse(request.params);
    const audio = await audioService.getAudioByTranslationId(user.id, translationId);

    if (!audio) {
      return reply.code(404).send({ message: "Audio not found" });
    }

    return reply.send(audio);
  });

  fastify.post("/audio", async (request, reply) => {
    const clerkUserId = request.auth?.userId;

    if (!clerkUserId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const user = await userService.getUserByClerkId(clerkUserId);

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    const audio = await audioService.createAudio(user.id, request.body);
    return reply.code(201).send(audio);
  });
}
