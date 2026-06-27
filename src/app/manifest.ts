import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

/**
 * Manifeste de l'application web progressive (PWA).
 * Servi automatiquement par Next.js sur /manifest.webmanifest.
 * Les icônes définitives et le service worker (hors-ligne) seront ajoutés au lot L4.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${siteConfig.name} — Annales BEPC & BAC`,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#226d68",
    lang: "fr",
    dir: "ltr",
    categories: ["education", "books"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
