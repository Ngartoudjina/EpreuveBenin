import { and, eq, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { examPapers, examSessions, exams, series, subjects } from "@/db/schema";
import { slugify } from "@/lib/format";

const CURRENT_YEAR = new Date().getFullYear();

/* --------------------------------- Matières -------------------------------- */

export const subjectSchema = z.object({
  label: z.string().trim().min(2, "Libellé trop court.").max(80, "Libellé trop long."),
});

export async function createSubject(raw: { label: string }): Promise<void> {
  const { label } = subjectSchema.parse(raw);
  const slug = slugify(label);
  if (!slug) throw new Error("Libellé invalide.");
  const code = slug.replace(/-/g, "_").toUpperCase().slice(0, 24);

  const existing = await db
    .select({ id: subjects.id })
    .from(subjects)
    .where(or(eq(subjects.slug, slug), eq(subjects.code, code)));
  if (existing.length > 0) {
    throw new Error("Une matière équivalente existe déjà.");
  }

  const all = await db.select({ position: subjects.position }).from(subjects);
  const position = Math.max(0, ...all.map((s) => s.position)) + 1;

  await db.insert(subjects).values({ label, slug, code, position });
}

export async function deleteSubject(id: string): Promise<void> {
  const used = await db
    .select({ id: examPapers.id })
    .from(examPapers)
    .where(eq(examPapers.subjectId, id));
  if (used.length > 0) {
    throw new Error(
      `Impossible de supprimer : ${used.length} épreuve(s) utilisent cette matière.`,
    );
  }
  await db.delete(subjects).where(eq(subjects.id, id));
}

/* ---------------------------------- Séries --------------------------------- */

export const seriesSchema = z.object({
  examId: z.string().uuid("Examen invalide."),
  code: z.string().trim().min(1, "Code requis.").max(8, "Code trop long."),
  label: z.string().trim().min(2, "Libellé trop court.").max(120),
});

export async function createSeries(raw: {
  examId: string;
  code: string;
  label: string;
}): Promise<void> {
  const { examId, code, label } = seriesSchema.parse(raw);
  const codeUpper = code.toUpperCase();
  const slug = slugify(`serie ${codeUpper}`);

  const exam = await db.query.exams.findFirst({ where: eq(exams.id, examId) });
  if (!exam) throw new Error("Examen introuvable.");

  const dup = await db
    .select({ id: series.id })
    .from(series)
    .where(and(eq(series.examId, examId), eq(series.code, codeUpper)));
  if (dup.length > 0) {
    throw new Error("Cette série existe déjà pour cet examen.");
  }

  const existing = await db
    .select({ position: series.position })
    .from(series)
    .where(eq(series.examId, examId));
  const position = Math.max(0, ...existing.map((s) => s.position)) + 1;

  await db
    .insert(series)
    .values({ examId, code: codeUpper, label, slug, position });
}

export async function deleteSeries(id: string): Promise<void> {
  const used = await db
    .select({ id: examPapers.id })
    .from(examPapers)
    .where(eq(examPapers.seriesId, id));
  if (used.length > 0) {
    throw new Error(
      `Impossible de supprimer : ${used.length} épreuve(s) utilisent cette série.`,
    );
  }
  await db.delete(series).where(eq(series.id, id));
}

/* -------------------------------- Sessions --------------------------------- */

export const sessionSchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(1990, "Année trop ancienne.")
    .max(CURRENT_YEAR + 1, "Année invalide."),
  type: z.enum(["normale", "remplacement"]).default("normale"),
});

export async function createSession(raw: {
  year: number | string;
  type: string;
}): Promise<void> {
  const { year, type } = sessionSchema.parse(raw);
  const dup = await db
    .select({ id: examSessions.id })
    .from(examSessions)
    .where(and(eq(examSessions.year, year), eq(examSessions.type, type)));
  if (dup.length > 0) {
    throw new Error("Cette session existe déjà.");
  }
  await db.insert(examSessions).values({ year, type });
}

export async function deleteSession(id: string): Promise<void> {
  const used = await db
    .select({ id: examPapers.id })
    .from(examPapers)
    .where(eq(examPapers.sessionId, id));
  if (used.length > 0) {
    throw new Error(
      `Impossible de supprimer : ${used.length} épreuve(s) utilisent cette session.`,
    );
  }
  await db.delete(examSessions).where(eq(examSessions.id, id));
}
