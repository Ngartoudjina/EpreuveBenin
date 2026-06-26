/**
 * Initialise la base locale PGlite : applique les migrations puis amorce.
 * Aucun serveur requis — idéal pour démarrer sans Docker.
 *
 * Lancer avec :  npm run db:local
 */
import "dotenv/config";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import type { AppDatabase } from "./index";
import * as schema from "./schema";
import { seedReferentials } from "./seed";

async function main() {
  const path = process.env.PGLITE_PATH ?? "./.pglite";
  console.log(`🗄️   Base PGlite locale : ${path}`);

  const client = new PGlite(path);
  const db = drizzle(client, { schema });

  console.log("⏫  Application des migrations…");
  await migrate(db, { migrationsFolder: "drizzle" });

  console.log("🌱  Amorçage…");
  await seedReferentials(db as unknown as AppDatabase);

  await client.close();
  console.log("✅  Base locale prête.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌  Échec de l'initialisation locale :", err);
    process.exit(1);
  });
