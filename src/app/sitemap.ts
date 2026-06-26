import type { MetadataRoute } from "next";

import { getSearchIndex } from "@/db/queries";
import { absoluteUrl } from "@/lib/seo";

/**
 * Plan du site : pages statiques + tout le catalogue (examens, séries, matières,
 * années) dérivé de l'index de recherche. Servi sur /sitemap.xml.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "/",
    "/bepc",
    "/bac",
    "/recherche",
    "/a-propos",
    "/contact",
    "/mentions-legales",
  ];

  const paths = new Set<string>(staticPaths);

  // Chaque épreuve donne un chemin feuille ; on ajoute aussi ses chemins parents
  // (ex. /bac/serie-d/maths/2024 → /bac/serie-d/maths et /bac/serie-d).
  const index = await getSearchIndex();
  for (const doc of index) {
    const segments = doc.href.split("/").filter(Boolean);
    let acc = "";
    for (const segment of segments) {
      acc += `/${segment}`;
      paths.add(acc);
    }
  }

  const now = new Date();
  return [...paths].map((path) => {
    const depth = path === "/" ? 0 : path.split("/").filter(Boolean).length;
    return {
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "weekly",
      priority: depth === 0 ? 1 : depth <= 1 ? 0.8 : depth <= 2 ? 0.6 : 0.5,
    };
  });
}
