import type { FastifyInstance } from "fastify";
import { Webhook } from "svix";

import { UserService } from "../services/user.service.js";

export async function webhookRoutes(
  fastify: FastifyInstance,
  userService: UserService,
): Promise<void> {
  fastify.post("/webhooks/clerk", async (request, reply) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      fastify.log.error("CLERK_WEBHOOK_SECRET is not set");
      return reply.code(500).send({ message: "Server configuration error" });
    }

    const svixId = request.headers["svix-id"] as string | undefined;
    const svixTimestamp = request.headers["svix-timestamp"] as string | undefined;
    const svixSignature = request.headers["svix-signature"] as string | undefined;

    if (!svixId || !svixTimestamp || !svixSignature) {
      return reply.code(400).send({ message: "Missing svix headers" });
    }

    const payload = request.body;
    const body = JSON.stringify(payload);
    const webhook = new Webhook(webhookSecret);
    let event: {
      type: string;
      data: {
        id?: string;
        email_addresses?: Array<{ email_address: string }>;
      };
    };

    try {
      event = webhook.verify(body, {
        "svix-id": svixId,
        "svix-signature": svixSignature,
        "svix-timestamp": svixTimestamp,
      }) as typeof event;
    } catch (error) {
      fastify.log.error(error, "Webhook verification failed");
      return reply.code(400).send({ message: "Invalid signature" });
    }

    try {
      if (event.type === "user.created" || event.type === "user.updated") {
        const id = event.data.id;
        const emailAddresses = event.data.email_addresses ?? [];

        if (!id) {
          return reply.code(400).send({ message: "Missing user id" });
        }

        await userService.syncUserFromClerk({
          id,
          email_addresses: emailAddresses,
        });
      } else if (event.type === "user.deleted" && event.data.id) {
        await userService.deleteUser(event.data.id);
      }

      return reply.send({ success: true });
    } catch (error) {
      fastify.log.error(error, "Webhook processing error");
      return reply.code(500).send({ message: "Internal server error" });
    }
  });
}
