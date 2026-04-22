import type { FastifyInstance } from "fastify";

import { setLingqApiKeySchema } from "../schemas/lingq.schema.js";
import { ApiKeyRepository } from "../repositories/api-key.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { LingqService } from "../services/lingq.service.js";
import { UserService } from "../services/user.service.js";

export async function lingqRoutes(fastify: FastifyInstance): Promise<void> {
  const userService = new UserService(new UserRepository());
  const lingqService = new LingqService(new ApiKeyRepository());

  fastify.post("/apikey", async (request, reply) => {
    const clerkUserId = request.auth?.userId;

    if (!clerkUserId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const user = await userService.getUserByClerkId(clerkUserId);

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    const { apiKey } = setLingqApiKeySchema.parse(request.body);
    await lingqService.setLingqApiKey(user.id, apiKey);

    return reply.send({ success: true });
  });

  fastify.get("/status", async (request, reply) => {
    const clerkUserId = request.auth?.userId;

    if (!clerkUserId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const user = await userService.getUserByClerkId(clerkUserId);

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    const connected = await lingqService.hasLingqApiKey(user.id);
    return reply.send({ connected });
  });
}
