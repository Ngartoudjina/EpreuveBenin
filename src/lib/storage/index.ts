import { env } from "@/env";

import { cloudinaryStorage } from "./cloudinary";
import { diskStorage } from "./disk";
import type { StorageProvider } from "./types";

/** Renvoie le fournisseur de stockage selon `STORAGE_DRIVER`. */
export function getStorage(): StorageProvider {
  return env.STORAGE_DRIVER === "cloudinary" ? cloudinaryStorage : diskStorage;
}

export type { StorageProvider, StoredFile } from "./types";
