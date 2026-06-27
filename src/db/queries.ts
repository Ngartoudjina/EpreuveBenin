/**
 * Couche d'accès aux données pour le catalogue public.
 *
 * Toutes les fonctions sont mémoïsées par requête (`react/cache`) afin que les
 * appels dupliqués (ex. `generateMetadata` + page) ne touchent la base qu'une
 * fois. Les listes ne renvoient que les entrées possédant au moins une épreuve.
 *
 * À n'importer que depuis des Server Components (accès direct à la base).
 */
import {
  and,
  asc,
  desc,
  eq,
  gt,
  ilike,
  inArray,
  isNull,
  or,
  sql,
} from "drizzle-orm";
import { cache } from "react";

import { normalizeText } from "../lib/format";
import type { SearchDoc } from "../lib/search";
import { db } from "./index";
import {
  admins,
  auditLogs,
  contactMessages,
  documents,
  examPapers,
  examSessions,
  exams,
  series,
  subjects,
  users,
} from "./schema";

type ExamCode = "bepc" | "bac";

/** Examen par code (bepc / bac). */
export const getExamByCode = cache(async (code: ExamCode) => {
  return db.query.exams.findFirst({ where: eq(exams.code, code) });
});

/** Série d'un examen par slug (ex. « serie-d »). */
export const getSeriesBySlug = cache(async (examId: string, slug: string) => {
  return db.query.series.findFirst({
    where: and(eq(series.examId, examId), eq(series.slug, slug)),
  });
});

/** Matière par slug (ex. « mathematiques »). */
export const getSubjectBySlug = cache(async (slug: string) => {
  return db.query.subjects.findFirst({ where: eq(subjects.slug, slug) });
});

/** Séries d'un examen ayant au moins une épreuve, triées. */
export const listSeriesWithPapers = cache(async (examId: string) => {
  return db
    .select({
      id: series.id,
      code: series.code,
      label: series.label,
      slug: series.slug,
      papers: sql<number>`count(${examPapers.id})::int`,
    })
    .from(series)
    .innerJoin(examPapers, eq(examPapers.seriesId, series.id))
    .where(eq(series.examId, examId))
    .groupBy(series.id)
    .orderBy(asc(series.position));
});

/** Matières d'un examen (et d'une série optionnelle) ayant des épreuves. */
export const listSubjectsWithPapers = cache(
  async (examId: string, seriesId: string | null) => {
    return db
      .select({
        id: subjects.id,
        label: subjects.label,
        slug: subjects.slug,
        papers: sql<number>`count(${examPapers.id})::int`,
      })
      .from(subjects)
      .innerJoin(examPapers, eq(examPapers.subjectId, subjects.id))
      .where(
        and(
          eq(examPapers.examId, examId),
          seriesId
            ? eq(examPapers.seriesId, seriesId)
            : isNull(examPapers.seriesId),
        ),
      )
      .groupBy(subjects.id)
      .orderBy(asc(subjects.position));
  },
);

/** Années (sessions) disponibles pour un examen + matière (+ série optionnelle). */
export const listYearsWithPapers = cache(
  async (examId: string, subjectId: string, seriesId: string | null) => {
    return db
      .select({
        sessionId: examSessions.id,
        year: examSessions.year,
        type: examSessions.type,
      })
      .from(examSessions)
      .innerJoin(examPapers, eq(examPapers.sessionId, examSessions.id))
      .where(
        and(
          eq(examPapers.examId, examId),
          eq(examPapers.subjectId, subjectId),
          seriesId
            ? eq(examPapers.seriesId, seriesId)
            : isNull(examPapers.seriesId),
        ),
      )
      .groupBy(examSessions.id)
      .orderBy(desc(examSessions.year));
  },
);

/** Épreuve complète (avec examen, série, matière, session et documents). */
export const getPaper = cache(
  async (
    examId: string,
    subjectId: string,
    year: number,
    seriesId: string | null,
  ) => {
    // On résout d'abord les sessions de l'année (la requête relationnelle ne
    // permet pas de filtrer directement sur une table jointe).
    const yearSessions = await db
      .select({ id: examSessions.id })
      .from(examSessions)
      .where(eq(examSessions.year, year));
    const sessionIds = yearSessions.map((s) => s.id);
    if (sessionIds.length === 0) return undefined;

    return db.query.examPapers.findFirst({
      where: and(
        eq(examPapers.examId, examId),
        eq(examPapers.subjectId, subjectId),
        seriesId
          ? eq(examPapers.seriesId, seriesId)
          : isNull(examPapers.seriesId),
        inArray(examPapers.sessionId, sessionIds),
      ),
      with: {
        exam: true,
        series: true,
        subject: true,
        session: true,
        documents: { orderBy: (d, { asc }) => [asc(d.type)] },
      },
    });
  },
);

export type PaperWithRelations = NonNullable<
  Awaited<ReturnType<typeof getPaper>>
>;

/**
 * Index de recherche : toutes les épreuves dénormalisées pour un filtrage
 * instantané côté client. Servi en JSON (mis en cache CDN + navigateur).
 */
export const getSearchIndex = cache(async (): Promise<SearchDoc[]> => {
  const papers = await db.query.examPapers.findMany({
    with: {
      exam: true,
      series: true,
      subject: true,
      session: true,
      documents: { columns: { type: true } },
    },
  });

  return papers.map((p) => {
    const base =
      p.exam.code === "bac" && p.series ? `/bac/${p.series.slug}` : "/bepc";
    const href = `${base}/${p.subject.slug}/${p.session.year}`;

    return {
      href,
      title: p.title,
      examCode: p.exam.code,
      examLabel: p.exam.label,
      seriesCode: p.series?.code ?? null,
      seriesLabel: p.series?.label ?? null,
      subjectLabel: p.subject.label,
      subjectSlug: p.subject.slug,
      year: p.session.year,
      sessionType: p.session.type,
      hasCorrige: p.documents.some((d) => d.type === "corrige"),
      search: normalizeText(
        [
          p.title,
          p.subject.label,
          p.series?.label ?? "",
          p.exam.label,
          String(p.session.year),
        ].join(" "),
      ),
    };
  });
});

/* ----------------------------- Back-office -------------------------------- */

/** Tous les examens (pour les formulaires d'administration). */
export async function getAllExams() {
  return db
    .select({ id: exams.id, code: exams.code, label: exams.label })
    .from(exams)
    .orderBy(asc(exams.position));
}

/** Toutes les séries (avec leur examen) pour le filtrage côté client. */
export async function getAllSeries() {
  return db
    .select({
      id: series.id,
      examId: series.examId,
      code: series.code,
      label: series.label,
    })
    .from(series)
    .orderBy(asc(series.position));
}

/** Toutes les matières. */
export async function getAllSubjects() {
  return db
    .select({ id: subjects.id, label: subjects.label })
    .from(subjects)
    .orderBy(asc(subjects.position));
}

/** Liste des épreuves pour le tableau d'administration. */
export async function listPapersForAdmin() {
  const papers = await db.query.examPapers.findMany({
    with: {
      exam: true,
      series: true,
      subject: true,
      session: true,
      documents: { columns: { type: true } },
    },
  });

  return papers
    .map((p) => ({
      id: p.id,
      title: p.title,
      examLabel: p.exam.label,
      seriesCode: p.series?.code ?? null,
      subjectLabel: p.subject.label,
      year: p.session.year,
      type: p.session.type,
      hasSujet: p.documents.some((d) => d.type === "sujet"),
      hasCorrige: p.documents.some((d) => d.type === "corrige"),
    }))
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, "fr"));
}

/** Matières avec le nombre d'épreuves qui les utilisent (gestion A-04). */
export async function listSubjectsAdmin() {
  return db
    .select({
      id: subjects.id,
      label: subjects.label,
      code: subjects.code,
      papers: sql<number>`count(${examPapers.id})::int`,
    })
    .from(subjects)
    .leftJoin(examPapers, eq(examPapers.subjectId, subjects.id))
    .groupBy(subjects.id)
    .orderBy(asc(subjects.position));
}

/** Séries avec leur examen et le nombre d'épreuves (gestion A-04). */
export async function listSeriesAdmin() {
  return db
    .select({
      id: series.id,
      code: series.code,
      label: series.label,
      examLabel: exams.label,
      papers: sql<number>`count(${examPapers.id})::int`,
    })
    .from(series)
    .innerJoin(exams, eq(exams.id, series.examId))
    .leftJoin(examPapers, eq(examPapers.seriesId, series.id))
    .groupBy(series.id, exams.id)
    .orderBy(asc(series.position));
}

/** Épreuve unique avec ses relations et documents (gestion A-02). */
export async function getPaperForAdmin(id: string) {
  return db.query.examPapers.findFirst({
    where: eq(examPapers.id, id),
    with: {
      exam: true,
      series: true,
      subject: true,
      session: true,
      documents: { orderBy: (d, { asc }) => [asc(d.type)] },
    },
  });
}

/** Sessions (années) avec le nombre d'épreuves qui les utilisent (gestion A-04). */
export async function listSessionsAdmin() {
  return db
    .select({
      id: examSessions.id,
      year: examSessions.year,
      type: examSessions.type,
      papers: sql<number>`count(${examPapers.id})::int`,
    })
    .from(examSessions)
    .leftJoin(examPapers, eq(examPapers.sessionId, examSessions.id))
    .groupBy(examSessions.id)
    .orderBy(desc(examSessions.year), asc(examSessions.type));
}

/** Dernières épreuves ajoutées (tableau de bord A-06). */
export async function getRecentPapers(limit = 6) {
  const rows = await db.query.examPapers.findMany({
    with: { exam: true, series: true, subject: true, session: true },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
    limit,
  });
  return rows.map((p) => ({
    id: p.id,
    title: p.title,
    examLabel: p.exam.label,
    seriesCode: p.series?.code ?? null,
    subjectLabel: p.subject.label,
    year: p.session.year,
    createdAt: p.createdAt,
  }));
}

/** Documents les plus téléchargés (tableau de bord A-06). */
export async function getTopDownloads(limit = 6) {
  return db
    .select({
      id: documents.id,
      type: documents.type,
      downloads: documents.downloadCount,
      paperId: examPapers.id,
      title: examPapers.title,
    })
    .from(documents)
    .innerJoin(examPapers, eq(examPapers.id, documents.examPaperId))
    .where(gt(documents.downloadCount, 0))
    .orderBy(desc(documents.downloadCount))
    .limit(limit);
}

/** Épreuves incomplètes : un document (sujet/corrigé) manque (A-06). */
export async function getIncompletePapers(limit = 8) {
  const rows = await db.query.examPapers.findMany({
    with: {
      exam: true,
      series: true,
      subject: true,
      session: true,
      documents: { columns: { type: true } },
    },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });
  return rows
    .filter((p) => p.documents.length < 2)
    .map((p) => ({
      id: p.id,
      title: p.title,
      missing: p.documents.some((d) => d.type === "sujet")
        ? "Corrigé manquant"
        : "Sujet manquant",
    }))
    .slice(0, limit);
}

/** Derniers visiteurs inscrits (tableau de bord A-06). */
export async function getRecentUsers(limit = 6) {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit);
}

/** Comptes administrateurs (gestion réservée au super-admin). */
export async function listAdmins() {
  return db
    .select({
      id: admins.id,
      name: admins.name,
      email: admins.email,
      role: admins.role,
      lastLoginAt: admins.lastLoginAt,
      createdAt: admins.createdAt,
    })
    .from(admins)
    .orderBy(asc(admins.createdAt));
}

type Paginated<T> = {
  rows: T[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
};

/** Visiteurs inscrits, paginés, avec recherche optionnelle (nom / e-mail). */
export async function listUsers(opts: {
  page: number;
  perPage: number;
  q?: string;
}): Promise<
  Paginated<{
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    lastLoginAt: Date | null;
  }>
> {
  const page = Math.max(1, opts.page);
  const { perPage } = opts;
  const term = opts.q?.trim();
  const where = term
    ? or(ilike(users.name, `%${term}%`), ilike(users.email, `%${term}%`))
    : undefined;

  const [rows, totalRow] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .where(where)
      .orderBy(desc(users.createdAt))
      .limit(perPage)
      .offset((page - 1) * perPage),
    db.select({ n: sql<number>`count(*)::int` }).from(users).where(where),
  ]);

  const total = totalRow[0]?.n ?? 0;
  return {
    rows,
    total,
    page,
    perPage,
    pages: Math.max(1, Math.ceil(total / perPage)),
  };
}

/** Journal d'audit, paginé (A-07). */
export async function listAuditLogs(opts: {
  page: number;
  perPage: number;
}): Promise<
  Paginated<{
    id: string;
    actorEmail: string;
    action: string;
    targetType: string;
    targetLabel: string | null;
    createdAt: Date;
  }>
> {
  const page = Math.max(1, opts.page);
  const { perPage } = opts;

  const [rows, totalRow] = await Promise.all([
    db
      .select({
        id: auditLogs.id,
        actorEmail: auditLogs.actorEmail,
        action: auditLogs.action,
        targetType: auditLogs.targetType,
        targetLabel: auditLogs.targetLabel,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(perPage)
      .offset((page - 1) * perPage),
    db.select({ n: sql<number>`count(*)::int` }).from(auditLogs),
  ]);

  const total = totalRow[0]?.n ?? 0;
  return {
    rows,
    total,
    page,
    perPage,
    pages: Math.max(1, Math.ceil(total / perPage)),
  };
}

/** Messages de contact laissés par les visiteurs (back-office). */
export async function listMessages(limit = 100) {
  return db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt))
    .limit(limit);
}

/** Nombre de messages non traités (badge de navigation). */
export async function countUnhandledMessages(): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(contactMessages)
    .where(eq(contactMessages.handled, false));
  return row?.n ?? 0;
}

/** Statistiques du tableau de bord d'administration (A-06). */
export const getAdminStats = cache(async () => {
  const n = sql<number>`count(*)::int`;
  const [papers, docs, subj, sess, visitors] = await Promise.all([
    db.select({ n }).from(examPapers),
    db.select({ n }).from(documents),
    db.select({ n }).from(subjects),
    db.select({ n }).from(examSessions),
    db.select({ n }).from(users),
  ]);
  return {
    examPapers: papers[0]?.n ?? 0,
    documents: docs[0]?.n ?? 0,
    subjects: subj[0]?.n ?? 0,
    sessions: sess[0]?.n ?? 0,
    users: visitors[0]?.n ?? 0,
  };
});
