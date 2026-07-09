"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { logAction } from "@/lib/admin/audit";
import { addDocument, deleteDocument } from "@/lib/admin/papers";
import { revalidatePublicCatalog } from "@/lib/admin/revalidate";

type State = { error?: string } | undefined;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/connexion");
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

/** Ajoute un document (sujet/corrigé) à une épreuve, avec téléversement. */
export async function addDocumentAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireAdmin();
  const paperId = String(formData.get("paperId") ?? "");
  const type = String(formData.get("type") ?? "");
  const file = formData.get("file");

  if (type !== "sujet" && type !== "corrige") {
    return { error: "Type de document invalide." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Fichier PDF requis." };
  }

  try {
    await addDocument(paperId, type, file);
    await logAction("create", "document", type === "sujet" ? "Sujet" : "Corrigé");
  } catch (error) {
    return { error: message(error) };
  }

  revalidatePath(`/admin/epreuves/${paperId}`);
  revalidatePublicCatalog();
  return undefined;
}

/** Supprime un document d'une épreuve. */
export async function deleteDocumentAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireAdmin();
  const paperId = String(formData.get("paperId") ?? "");

  try {
    await deleteDocument(String(formData.get("id") ?? ""));
    await logAction("delete", "document");
  } catch (error) {
    return { error: message(error) };
  }

  revalidatePath(`/admin/epreuves/${paperId}`);
  revalidatePublicCatalog();
  return undefined;
}
