import { normalizeText } from "@/lib/format";

/**
 * Entrée de l'index de recherche : une épreuve dénormalisée, prête à être
 * filtrée côté client. Le champ `search` est pré-normalisé (sans accents).
 */
export type SearchDoc = {
  href: string;
  title: string;
  examCode: "bepc" | "bac";
  examLabel: string;
  seriesCode: string | null;
  seriesLabel: string | null;
  subjectLabel: string;
  subjectSlug: string;
  year: number;
  sessionType: "normale" | "remplacement";
  hasCorrige: boolean;
  search: string;
};

export type SearchFilters = {
  query: string;
  examCode: "" | "bepc" | "bac";
  seriesCode: string;
  subjectSlug: string;
  year: string;
  withCorrige: boolean;
};

export const emptyFilters: SearchFilters = {
  query: "",
  examCode: "",
  seriesCode: "",
  subjectSlug: "",
  year: "",
  withCorrige: false,
};

/**
 * Filtre l'index selon les critères. Fonction pure (testable, exécutée côté
 * client) : le texte est tokenisé et chaque mot doit être présent (ET logique).
 */
export function filterDocs(docs: SearchDoc[], f: SearchFilters): SearchDoc[] {
  const tokens = normalizeText(f.query).split(" ").filter(Boolean);

  return docs.filter((d) => {
    if (f.examCode && d.examCode !== f.examCode) return false;
    if (f.seriesCode && d.seriesCode !== f.seriesCode) return false;
    if (f.subjectSlug && d.subjectSlug !== f.subjectSlug) return false;
    if (f.year && String(d.year) !== f.year) return false;
    if (f.withCorrige && !d.hasCorrige) return false;
    if (tokens.length && !tokens.every((t) => d.search.includes(t))) {
      return false;
    }
    return true;
  });
}
