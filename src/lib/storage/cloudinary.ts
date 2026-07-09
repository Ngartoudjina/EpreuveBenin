import { type UploadApiResponse, v2 as cloudinary } from "cloudinary";

import { env } from "@/env";

import type { StorageProvider } from "./types";

/**
 * Stockage Cloudinary (production). Les PDF sont téléversés en `resource_type:
 * "image"` afin de bénéficier des transformations (vignette de la 1ʳᵉ page,
 * `pages` détecté). La diffusion des PDF doit être activée dans les réglages
 * de sécurité du compte Cloudinary.
 */
function configure() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary non configuré : définir CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET.",
    );
  }
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const cloudinaryStorage: StorageProvider = {
  async upload(file, opts) {
    configure();
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: opts?.folder ?? "epreuvebenin",
          resource_type: "image",
          format: "pdf",
          use_filename: false,
          unique_filename: true,
          overwrite: false,
        },
        (error, res) =>
          error || !res
            ? reject(error ?? new Error("Échec du téléversement Cloudinary."))
            : resolve(res),
      );
      stream.end(buffer);
    });

    return {
      key: result.public_id,
      url: result.secure_url,
      bytes: result.bytes,
      pageCount: result.pages ?? null,
    };
  },

  async delete(key) {
    configure();
    await cloudinary.uploader.destroy(key, { resource_type: "image" });
  },

  deliveryUrl(file, opts) {
    // Documents non hébergés chez Cloudinary (démo du seed, anciens uploads
    // disque) : on sert l'URL stockée telle quelle.
    if (!file.url.includes("res.cloudinary.com")) return file.url;

    configure();
    // URL signée obligatoire : Cloudinary bloque par défaut la diffusion des
    // PDF via URL non signée (réglage « PDF and ZIP files delivery »).
    // `fl_attachment` force le téléchargement sous un nom lisible.
    return cloudinary.url(file.key, {
      resource_type: "image",
      type: "upload",
      format: "pdf",
      secure: true,
      sign_url: true,
      flags: opts?.attachment ? `attachment:${opts.attachment}` : undefined,
    });
  },
};
