/**
 * Fonctions utilitaires de mise en forme et de génération de slugs.
 * Conçues pour le français (gestion des accents) et le contexte béninois.
 */

/**
 * Transforme un libellé en slug d'URL : minuscules, sans accents, tirets.
 * Ex. « Série D — Mathématiques » -> « serie-d-mathematiques ».
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // retire les accents (diacritiques)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Formate une taille de fichier en octets vers une unité lisible (o, Ko, Mo…).
 * Important pour aider les candidats à anticiper leur consommation de données.
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "—";
  const units = ["o", "Ko", "Mo", "Go"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, i);
  const decimals = value < 10 && i > 0 ? 1 : 0;
  return `${value.toFixed(decimals).replace(".", ",")} ${units[i]}`;
}

/** Formate un nombre selon la locale française (séparateurs de milliers). */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}

/**
 * Normalise un texte pour la recherche : minuscules, sans accents, mots séparés
 * par des espaces. Permet une recherche insensible aux accents et à la casse.
 * Ex. « Série D — Mathématiques » -> « serie d mathematiques ».
 */
export function normalizeText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
