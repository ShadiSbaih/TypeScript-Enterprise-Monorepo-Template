import Fastify from "fastify";
import cors from "@fastify/cors";
import { aiRoutes } from "./routes/ai";

async function startAIService() {
  const app = Fastify({
    logger: {
      transport:
        process.env.NODE_ENV !== "production"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined
    }
  });

  await app.register(cors, { origin: true });
  await app.register(aiRoutes, { prefix: "/api/ai" });

  const port = Number(process.env.PORT) || 8000;
  const host = process.env.HOST || "0.0.0.0";

  try {
    await app.listen({ port, host });
    app.log.info(`AI Inference Service listening on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startAIService();
