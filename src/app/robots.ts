import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/** robots.txt : on autorise tout sauf les zones privées/techniques. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/connexion", "/inscription"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
