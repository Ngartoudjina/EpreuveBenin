"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { logAction } from "@/lib/admin/audit";
import { importPapers, type ImportReport } from "@/lib/admin/import";
import { revalidatePublicCatalog } from "@/lib/admin/revalidate";

export type ImportState = { report?: ImportReport; error?: string } | undefined;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/connexion");
}

/** Importe (ou analyse) un CSV d'épreuves. « Analyser » envoie dryRun=on. */
export async function importAction(
  _prev: ImportState,
  formData: FormData,
): Promise<ImportState> {
  await requireAdmin();

  const pasted = String(formData.get("csv") ?? "").trim();
  const file = formData.get("file");
  let text = pasted;
  if (!text && file instanceof File && file.size > 0) {
    text = (await file.text()).trim();
  }
  if (!text) {
    return { error: "Fournissez un fichier CSV ou collez son contenu." };
  }

  const dryRun = formData.get("dryRun") === "on";

  try {
    const report = await importPapers(text, { dryRun });
    if (!dryRun && report.created > 0) {
      await logAction("import", "épreuves", `${report.created} créée(s)`);
      revalidatePath("/admin/epreuves");
      revalidatePath("/admin");
      revalidatePublicCatalog();
    }
    return { report };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Échec de l'import.",
    };
  }
}
