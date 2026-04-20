import "@clerk/fastify";

declare module "fastify" {
	interface FastifyRequest {
		auth?: {
			userId: string;
			sessionId: string;
			actor: unknown;
			orgId: string | null;
			orgRole: string | null;
			orgSlug: string | null;
		};
	}
}
