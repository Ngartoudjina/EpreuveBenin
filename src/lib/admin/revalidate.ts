/**
 * Invalidation du cache des pages publiques du catalogue.
 *
 * Les pages publiques sont statiques (`revalidate = 3600`) : sans invalidation
 * explicite, une épreuve ajoutée ou supprimée depuis le back-office ne serait
 * visible côté visiteurs qu'à l'expiration du cache (jusqu'à une heure).
 *
 * Les motifs comportant des segments dynamiques doivent inclure le groupe de
 * route `(public)` : les tags de cache sont dérivés du chemin des fichiers de
 * route, groupes compris.
 */
import { revalidatePath } from "next/cache";

/** À appeler après toute mutation d'épreuve ou de document. */
export function revalidatePublicCatalog(): void {
  // Accueil : épreuves récentes et chiffres clés.
  revalidatePath("/");

  // Catalogue BEPC : liste des matières, années, fiche épreuve.
  revalidatePath("/bepc");
  revalidatePath("/(public)/bepc/[matiere]", "page");
  revalidatePath("/(public)/bepc/[matiere]/[annee]", "page");

  // Catalogue BAC : séries, matières, années, fiche épreuve.
  revalidatePath("/bac");
  revalidatePath("/(public)/bac/[serie]", "page");
  revalidatePath("/(public)/bac/[serie]/[matiere]", "page");
  revalidatePath("/(public)/bac/[serie]/[matiere]/[annee]", "page");

  // Index de recherche (page /recherche) et plan du site.
  revalidatePath("/api/search-index");
  revalidatePath("/sitemap.xml");
}
