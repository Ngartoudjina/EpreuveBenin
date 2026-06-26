/**
 * Validation typée des variables d'environnement.
 *
 * On distingue les variables « serveur » (jamais exposées au navigateur) des
 * variables « client » (préfixées NEXT_PUBLIC_). La validation échoue au
 * démarrage si une variable requise est absente ou malformée.
 */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    // Pilote de base de données : « postgres » (production) ou « pglite »
    // (base embarquée locale, sans serveur — pratique pour le développement).
    DB_DRIVER: z.enum(["postgres", "pglite"]).default("postgres"),
    // Chemin du dossier de persistance PGlite (driver « pglite » uniquement).
    PGLITE_PATH: z.string().default("./.pglite"),
    // Connexion PostgreSQL (métadonnées du catalogue, driver « postgres »).
    DATABASE_URL: z.string().url(),
    // Secret de signature des sessions (Auth.js). Générer : `openssl rand -base64 32`.
    AUTH_SECRET: z.string().min(1),
    // Stockage des fichiers PDF : « local » (disque, dev) ou « cloudinary » (prod).
    STORAGE_DRIVER: z.enum(["local", "cloudinary"]).default("local"),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
    // Envoi d'e-mails (vérification d'adresse). Sans clé : mode console (dev).
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().optional(),
  },
  client: {
    // URL publique canonique (SEO, sitemap, Open Graph, liens de partage).
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DB_DRIVER: process.env.DB_DRIVER,
    PGLITE_PATH: process.env.PGLITE_PATH,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    STORAGE_DRIVER: process.env.STORAGE_DRIVER,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  // Une chaîne vide est traitée comme « non définie » (pratique pour les .env).
  emptyStringAsUndefined: true,
  // Permet `SKIP_ENV_VALIDATION=1` lors d'opérations type Docker build.
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
