import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import {
  documents,
  examPapers,
  examSessions,
  exams,
  series,
  subjects,
} from "@/db/schema";
import { slugify } from "@/lib/format";
import { getStorage } from "@/lib/storage";

const MAX_BYTES = 20 * 1024 * 1024; // 20 Mo
const CURRENT_YEAR = new Date().getFullYear();

export const createPaperSchema = z.object({
  examId: z.string().uuid("Examen invalide."),
  seriesId: z.string().uuid().nullable().optional(),
  subjectId: z.string().uuid("Matière invalide."),
  year: z.coerce
    .number()
    .int()
    .min(1990, "Année trop ancienne.")
    .max(CURRENT_YEAR + 1, "Année invalide."),
  type: z.enum(["normale", "remplacement"]).default("normale"),
});

export type CreatePaperInput = z.input<typeof createPaperSchema>;

function assertPdf(file: File, label: string) {
  if (file.size === 0) throw new Error(`${label} : fichier vide ou manquant.`);
  if (file.type && file.type !== "application/pdf") {
    throw new Error(`${label} : le fichier doit être un PDF.`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`${label} : fichier trop volumineux (max 20 Mo).`);
  }
}

/** Crée une épreuve : valide, téléverse les fichiers, insère épreuve + documents. */
export async function createExamPaper(
  rawInput: CreatePaperInput,
  sujet: File,
  corrige: File | null,
): Promise<{ id: string; title: string }> {
  const input = createPaperSchema.parse(rawInput);
  assertPdf(sujet, "Sujet");
  if (corrige) assertPdf(corrige, "Corrigé");

  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, input.examId),
  });
  if (!exam) throw new Error("Examen introuvable.");

  const serie = input.seriesId
    ? await db.query.series.findFirst({
        where: and(eq(series.id, input.seriesId), eq(series.examId, exam.id)),
      })
    : null;
  if (input.seriesId && !serie) {
    throw new Error("Série invalide pour cet examen.");
  }
  if (exam.code === "bac" && !serie) {
    throw new Error("Une série est requise pour le BAC.");
  }

  const subject = await db.query.subjects.findFirst({
    where: eq(subjects.id, input.subjectId),
  });
  if (!subject) throw new Error("Matière introuvable.");

  // Session : récupérée si elle existe, sinon créée.
  let session = (
    await db
      .select()
      .from(examSessions)
      .where(
        and(
          eq(examSessions.year, input.year),
          eq(examSessions.type, input.type),
        ),
      )
  )[0];
  session ??= (
    await db
      .insert(examSessions)
      .values({ year: input.year, type: input.type })
      .returning()
  )[0];

  // Unicité (clé naturelle examen + série + matière + session).
  const duplicate = await db
    .select({ id: examPapers.id })
    .from(examPapers)
    .where(
      and(
        eq(examPapers.examId, exam.id),
        serie ? eq(examPapers.seriesId, serie.id) : isNull(examPapers.seriesId),
        eq(examPapers.subjectId, subject.id),
        eq(examPapers.sessionId, session.id),
      ),
    );
  if (duplicate.length > 0) {
    throw new Error("Une épreuve identique existe déjà.");
  }

  const title = `${exam.label}${serie ? ` ${serie.code}` : ""} — ${subject.label} — ${input.year}`;
  const slug = slugify(
    `${exam.code} ${serie?.code ?? ""} ${subject.slug} ${input.year}`,
  );

  // Téléversement (le stockage est choisi selon STORAGE_DRIVER).
  const storage = getStorage();
  const sujetFile = await storage.upload(sujet, { folder: "epreuvebenin/epreuves" });
  const corrigeFile = corrige
    ? await storage.upload(corrige, { folder: "epreuvebenin/epreuves" })
    : null;

  const [paper] = await db
    .insert(examPapers)
    .values({
      examId: exam.id,
      seriesId: serie?.id ?? null,
      subjectId: subject.id,
      sessionId: session.id,
      title,
      slug,
    })
    .returning({ id: examPapers.id });

  await db.insert(documents).values([
    {
      examPaperId: paper.id,
      type: "sujet",
      storageKey: sujetFile.key,
      url: sujetFile.url,
      fileSizeBytes: sujetFile.bytes,
      pageCount: sujetFile.pageCount,
    },
    ...(corrigeFile
      ? [
          {
            examPaperId: paper.id,
            type: "corrige" as const,
            storageKey: corrigeFile.key,
            url: corrigeFile.url,
            fileSizeBytes: corrigeFile.bytes,
            pageCount: corrigeFile.pageCount,
          },
        ]
      : []),
  ]);

  return { id: paper.id, title };
}

/** Type de document gérable manuellement (sujet ou corrigé). */
export type DocType = "sujet" | "corrige";

/** Ajoute un document à une épreuve existante (téléverse puis insère). */
export async function addDocument(
  paperId: string,
  type: DocType,
  file: File,
): Promise<void> {
  const label = type === "sujet" ? "Sujet" : "Corrigé";
  assertPdf(file, label);

  const paper = await db.query.examPapers.findFirst({
    where: eq(examPapers.id, paperId),
  });
  if (!paper) throw new Error("Épreuve introuvable.");

  const existing = await db
    .select({ id: documents.id })
    .from(documents)
    .where(and(eq(documents.examPaperId, paperId), eq(documents.type, type)));
  if (existing.length > 0) {
    throw new Error(`Un ${label.toLowerCase()} existe déjà pour cette épreuve.`);
  }

  const stored = await getStorage().upload(file, {
    folder: "epreuvebenin/epreuves",
  });
  await db.insert(documents).values({
    examPaperId: paperId,
    type,
    storageKey: stored.key,
    url: stored.url,
    fileSizeBytes: stored.bytes,
    pageCount: stored.pageCount,
  });
}

/** Supprime un document précis (et son fichier de stockage). */
export async function deleteDocument(docId: string): Promise<void> {
  const [doc] = await db
    .select({ storageKey: documents.storageKey })
    .from(documents)
    .where(eq(documents.id, docId));
  if (!doc) return;
  // On supprime d'abord le fichier (au pire orphelin si l'étape DB échoue).
  await getStorage()
    .delete(doc.storageKey)
    .catch(() => {});
  await db.delete(documents).where(eq(documents.id, docId));
}

/** Supprime une épreuve, ses documents et les fichiers de stockage associés.
 *  Renvoie le titre supprimé (pour la journalisation), ou null si introuvable. */
export async function deleteExamPaper(id: string): Promise<string | null> {
  const [paper] = await db
    .select({ title: examPapers.title })
    .from(examPapers)
    .where(eq(examPapers.id, id));

  const docs = await db
    .select({ storageKey: documents.storageKey })
    .from(documents)
    .where(eq(documents.examPaperId, id));

  const storage = getStorage();
  await Promise.all(docs.map((d) => storage.delete(d.storageKey)));

  // Les lignes `documents` sont supprimées en cascade (FK onDelete: cascade).
  await db.delete(examPapers).where(eq(examPapers.id, id));
  return paper?.title ?? null;
}
