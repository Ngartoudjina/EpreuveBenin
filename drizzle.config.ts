import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * Configuration de Drizzle Kit (génération et application des migrations).
 * Les migrations SQL sont versionnées dans le dossier `./drizzle`.
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
