/** Résultat d'un téléversement, indépendant du fournisseur de stockage. */
export type StoredFile = {
  /** Clé/identifiant opaque propre au fournisseur (pour suppression). */
  key: string;
  /** URL publique de diffusion du fichier. */
  url: string;
  /** Taille en octets. */
  bytes: number;
  /** Nombre de pages (si le fournisseur le détecte, ex. Cloudinary pour les PDF). */
  pageCount: number | null;
};

/** Interface commune des fournisseurs de stockage (disque local, Cloudinary…). */
export interface StorageProvider {
  upload(file: File, opts?: { folder?: string }): Promise<StoredFile>;
  delete(key: string): Promise<void>;
}
