import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { runMigrations } from "./plugins/migrations.js";

const app = buildApp();

try {
  await runMigrations();
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
