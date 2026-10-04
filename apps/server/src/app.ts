import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { healthRoutes } from "./routes/health";
import { userRoutes } from "./routes/users";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      transport:
        process.env.NODE_ENV !== "production"
          ? {
              target: "pino-pretty",
              options: { colorize: true }
            }
          : undefined
    }
  });

  // Security Plugins
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
    credentials: true
  });

  // Auth Plugin
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || "supersecret-dev-key-change-in-prod"
  });

  // OpenAPI Documentation Plugin
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Enterprise Monorepo API",
        description: "Production API Server Template",
        version: "1.0.0"
      }
    }
  });
  await app.register(swaggerUi, {
    routePrefix: "/docs"
  });

  // Application Routes
  await app.register(healthRoutes, { prefix: "/api/health" });
  await app.register(userRoutes, { prefix: "/api/v1/users" });

  return app;
}
