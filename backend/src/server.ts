import "dotenv/config";

import { clerkPlugin } from "@clerk/fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";

import { UserRepository } from "./repositories/user.repository.js";
import { UserService } from "./services/user.service.js";
import { audioRoutes } from "./routes/audio.routes.js";
import { entryRoutes } from "./routes/entry.routes.js";
import { initializeDatabase, staticAudioDirectory } from "./plugins/db.js";
import { savedWordRoutes } from "./routes/saved-word.routes.js";
import { translationRoutes } from "./routes/translation.routes.js";
import { webhookRoutes } from "./routes/webhook.routes.js";
import { exportRoutes } from "./routes/export.routes.js";

await initializeDatabase();

const app = Fastify({
	logger: true,
});

await app.register(cors, {
	origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	allowedHeaders: ["Authorization", "Content-Type"],
});

await app.register(fastifyStatic, {
	root: staticAudioDirectory,
	prefix: "/static/audio/",
});

app.get("/health", async () => ({ status: "ok" }));

const userService = new UserService(new UserRepository());

await app.register(async (fastify) => {
	await webhookRoutes(fastify, userService);
});

await app.register(clerkPlugin, {
	publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
	secretKey: process.env.CLERK_SECRET_KEY,
});

await app.register(entryRoutes);
await app.register(translationRoutes);
await app.register(audioRoutes);
await app.register(savedWordRoutes);
await app.register(exportRoutes, { prefix: "/export" });

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "0.0.0.0";

try {
	await app.listen({ port, host });
} catch (error) {
	app.log.error(error);
	process.exit(1);
}
