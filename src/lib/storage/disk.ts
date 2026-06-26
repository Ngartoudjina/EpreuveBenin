import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { StorageProvider } from "./types";

/**
 * Stockage local sur disque (développement). Les fichiers sont écrits dans
 * `public/uploads` et servis directement par Next.js. La clé est le nom du
 * fichier ; l'URL publique est `/uploads/<clé>`.
 */
const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export const diskStorage: StorageProvider = {
  async upload(file) {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const key = `${randomUUID()}.pdf`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(UPLOAD_DIR, key), buffer);
    return {
      key,
      url: `/uploads/${key}`,
      bytes: buffer.byteLength,
      pageCount: null,
    };
  },

  async delete(key) {
    // Ignore les fichiers absents (ex. données de démonstration).
    await unlink(join(UPLOAD_DIR, key)).catch(() => undefined);
  },
};
