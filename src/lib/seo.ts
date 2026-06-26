/**
 * Aides au référencement : URLs absolues et données structurées (JSON-LD).
 * Schema.org améliore l'affichage dans les résultats de recherche (rich results).
 */
import { env } from "@/env";
import { siteConfig } from "@/lib/site";

const BASE = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/** Liens sociaux officiels du projet (schema.org « sameAs »). */
const SOCIAL = [
  "https://x.com/ABeingar84308",
  "https://www.instagram.com/nodam597/",
];

/** Construit une URL absolue à partir d'un chemin relatif. */
export function absoluteUrl(path = "/"): string {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

/** JSON-LD du site (avec action de recherche pour la sitelinks searchbox). */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: "Épreuves Bénin",
    url: BASE,
    inLanguage: "fr-BJ",
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE}/recherche?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** JSON-LD de l'organisation éditrice. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: BASE,
    logo: absoluteUrl("/favicon.ico"),
    description: siteConfig.description,
    areaServed: "BJ",
    sameAs: SOCIAL,
  };
}

/** JSON-LD d'un fil d'Ariane. */
export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: absoluteUrl(it.href) } : {}),
    })),
  };
}

/** JSON-LD d'une épreuve (ressource pédagogique). */
export function paperJsonLd(p: {
  title: string;
  description: string;
  path: string;
  hasCorrige: boolean;
  year: number;
  subject: string;
  examLabel: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: p.title,
    description: p.description,
    url: absoluteUrl(p.path),
    inLanguage: "fr",
    isAccessibleForFree: true,
    learningResourceType: p.hasCorrige
      ? ["Sujet d'examen", "Corrigé"]
      : ["Sujet d'examen"],
    educationalLevel: p.examLabel,
    about: p.subject,
    datePublished: String(p.year),
    provider: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
      url: BASE,
    },
  };
}
