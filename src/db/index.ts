/**
 * Client de base de données Drizzle.
 *
 * Deux pilotes, même schéma et mêmes requêtes (PGlite et PostgreSQL parlent
 * tous deux le dialecte PostgreSQL) :
 *   - « postgres » : PostgreSQL via postgres.js (production).
 *   - « pglite »   : base embarquée locale, sans serveur (développement).
 *
 * Une connexion unique est réutilisée entre les rechargements à chaud.
 */
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import {
  drizzle as drizzlePostgres,
  type PostgresJsDatabase,
} from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../env";
import * as schema from "./schema";

export type AppDatabase = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { _db?: AppDatabase };

function createDatabase(): AppDatabase {
  if (env.DB_DRIVER === "pglite") {
    const client = new PGlite(env.PGLITE_PATH);
    // PGlite expose la même API de requêtes : le cast est sûr à l'usage.
    return drizzlePglite(client, { schema }) as unknown as AppDatabase;
  }

  const client = postgres(env.DATABASE_URL, {
    max: env.NODE_ENV === "production" ? 10 : 1,
  });
  return drizzlePostgres(client, { schema });
}

function getDb(): AppDatabase {
  const instance = globalForDb._db ?? createDatabase();
  if (env.NODE_ENV !== "production") globalForDb._db = instance;
  return instance;
}

/**
 * Client exposé en proxy : la connexion n'est ouverte qu'au premier accès
 * (première requête), jamais au simple chargement du module. Cela évite
 * d'ouvrir la base pendant le build (plusieurs workers) ou les démarrages à froid.
 */
export const db: AppDatabase = new Proxy({} as AppDatabase, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance as object, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export * from "./schema";
