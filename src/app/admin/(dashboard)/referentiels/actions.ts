"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { logAction } from "@/lib/admin/audit";
import {
  createSeries,
  createSession,
  createSubject,
  deleteSeries,
  deleteSession,
  deleteSubject,
} from "@/lib/admin/referentials";

type State = { error?: string } | undefined;
const PATH = "/admin/referentiels";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/connexion");
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

export async function createSubjectAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireAdmin();
  const label = String(formData.get("label") ?? "");
  try {
    await createSubject({ label });
    await logAction("create", "matière", label);
  } catch (error) {
    return { error: message(error) };
  }
  revalidatePath(PATH);
  return undefined;
}

export async function deleteSubjectAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireAdmin();
  try {
    await deleteSubject(String(formData.get("id") ?? ""));
    await logAction("delete", "matière");
  } catch (error) {
    return { error: message(error) };
  }
  revalidatePath(PATH);
  return undefined;
}

export async function createSeriesAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireAdmin();
  const code = String(formData.get("code") ?? "");
  try {
    await createSeries({
      examId: String(formData.get("examId") ?? ""),
      code,
      label: String(formData.get("label") ?? ""),
    });
    await logAction("create", "série", code.toUpperCase());
  } catch (error) {
    return { error: message(error) };
  }
  revalidatePath(PATH);
  return undefined;
}

export async function deleteSeriesAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireAdmin();
  try {
    await deleteSeries(String(formData.get("id") ?? ""));
    await logAction("delete", "série");
  } catch (error) {
    return { error: message(error) };
  }
  revalidatePath(PATH);
  return undefined;
}

export async function createSessionAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireAdmin();
  const year = String(formData.get("year") ?? "");
  const type = String(formData.get("type") ?? "normale");
  try {
    await createSession({ year, type });
    await logAction(
      "create",
      "session",
      `${year}${type === "remplacement" ? " (remplacement)" : ""}`,
    );
  } catch (error) {
    return { error: message(error) };
  }
  revalidatePath(PATH);
  return undefined;
}

export async function deleteSessionAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireAdmin();
  try {
    await deleteSession(String(formData.get("id") ?? ""));
    await logAction("delete", "session");
  } catch (error) {
    return { error: message(error) };
  }
  revalidatePath(PATH);
  return undefined;
}
