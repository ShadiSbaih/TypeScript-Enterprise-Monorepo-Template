import { buildApp } from "./app";

async function main() {
  const app = await buildApp();
  const port = Number(process.env.PORT) || 4000;
  const host = process.env.HOST || "0.0.0.0";

  try {
    await app.listen({ port, host });
    app.log.info(`Server listening on http://${host}:${port}`);
    app.log.info(`OpenAPI Docs available at http://${host}:${port}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  // Graceful Shutdown
  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  for (const signal of signals) {
    process.on(signal, async () => {
      app.log.info(`Received ${signal}, closing server...`);
      await app.close();
      process.exit(0);
    });
  }
}

main();
