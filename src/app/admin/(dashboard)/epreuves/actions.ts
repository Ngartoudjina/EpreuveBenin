"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { logAction } from "@/lib/admin/audit";
import { createExamPaper, deleteExamPaper } from "@/lib/admin/papers";

export type CreatePaperState = { error?: string } | undefined;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/connexion");
}

/** Supprime une épreuve (action de formulaire simple). */
export async function deletePaperAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const title = await deleteExamPaper(id);
    await logAction("delete", "épreuve", title);
    revalidatePath("/admin/epreuves");
  }
}

/** Crée une épreuve à partir du formulaire (avec téléversement des PDF). */
export async function createPaperAction(
  _prevState: CreatePaperState,
  formData: FormData,
): Promise<CreatePaperState> {
  await requireAdmin();

  const sujet = formData.get("sujet");
  if (!(sujet instanceof File) || sujet.size === 0) {
    return { error: "Le sujet (PDF) est obligatoire." };
  }
  const corrigeRaw = formData.get("corrige");
  const corrige =
    corrigeRaw instanceof File && corrigeRaw.size > 0 ? corrigeRaw : null;
  const seriesIdRaw = formData.get("seriesId");

  try {
    const { title } = await createExamPaper(
      {
        examId: String(formData.get("examId") ?? ""),
        seriesId: seriesIdRaw ? String(seriesIdRaw) : null,
        subjectId: String(formData.get("subjectId") ?? ""),
        year: String(formData.get("year") ?? ""),
        type: String(formData.get("type") ?? "normale") as
          | "normale"
          | "remplacement",
      },
      sujet,
      corrige,
    );
    await logAction("create", "épreuve", title);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de l'épreuve.",
    };
  }

  revalidatePath("/admin/epreuves");
  redirect("/admin/epreuves");
}
