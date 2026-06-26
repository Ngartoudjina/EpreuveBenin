/**
 * Configuration centrale du site (nom, description, navigation).
 * Source unique de vérité pour l'en-tête, le pied de page et les métadonnées.
 */
export const siteConfig = {
  name: "EpreuveBenin",
  shortName: "EpreuveBenin",
  description:
    "Téléchargez gratuitement les sujets et corrigés du BEPC et du BAC au Bénin. Rapide même en connexion limitée, et consultable hors-ligne.",
  locale: "fr_BJ",
  /** Identifiant X/Twitter du projet (pour les cartes sociales). */
  twitter: "@ABeingar84308",
} as const;

/** Les deux examens couverts, mis en avant sur la page d'accueil. */
export const exams = [
  {
    code: "bepc",
    name: "BEPC",
    href: "/bepc",
    fullName: "Brevet d'Études du Premier Cycle",
    tagline: "Sujets et corrigés classés par matière et par année.",
  },
  {
    code: "bac",
    name: "BAC",
    href: "/bac",
    fullName: "Baccalauréat — séries A à E",
    tagline: "Annales par série, matière, session et année.",
  },
] as const;

/** Liens de navigation principaux. */
export const mainNav = [
  { label: "BEPC", href: "/bepc" },
  { label: "BAC", href: "/bac" },
  { label: "Recherche", href: "/recherche" },
] as const;
