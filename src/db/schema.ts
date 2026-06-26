/**
 * Modèle de données — Annales BEPC & BAC (cf. §6 du cahier des charges).
 *
 * Hiérarchie : Examen → Série (optionnelle) → Matière → Session (année)
 *              → Épreuve → Document(s) (sujet / corrigé).
 *
 * Le BEPC ne comporte pas de série : la colonne `series_id` de `exam_papers`
 * est donc nullable. Le modèle reste extensible (nouveaux examens, séries
 * techniques, matières) sans refonte.
 */
import { relations, sql } from "drizzle-orm";
import {
  bigint,
  index,
  integer,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*                                   Énums                                    */
/* -------------------------------------------------------------------------- */

export const examCode = pgEnum("exam_code", ["bepc", "bac"]);
export const sessionType = pgEnum("session_type", ["normale", "remplacement"]);
export const documentType = pgEnum("document_type", ["sujet", "corrige"]);
export const adminRole = pgEnum("admin_role", ["admin", "super_admin"]);

/** Colonnes d'horodatage communes à toutes les tables. */
const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

/* -------------------------------------------------------------------------- */
/*                              Tables principales                            */
/* -------------------------------------------------------------------------- */

/** Examen : BEPC ou BAC. */
export const exams = pgTable("exams", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: examCode("code").notNull().unique(),
  label: text("label").notNull(),
  position: smallint("position").notNull().default(0),
  ...timestamps,
});

/** Série / Filière du BAC (A1, A2, B, C, D, E…). Vide pour le BEPC. */
export const series = pgTable(
  "series",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    examId: uuid("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    label: text("label").notNull(),
    slug: text("slug").notNull(),
    position: smallint("position").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("series_exam_code_uq").on(t.examId, t.code),
    uniqueIndex("series_exam_slug_uq").on(t.examId, t.slug),
  ],
);

/** Matière / discipline évaluée (partagée entre examens et séries). */
export const subjects = pgTable("subjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  label: text("label").notNull(),
  slug: text("slug").notNull().unique(),
  position: smallint("position").notNull().default(0),
  ...timestamps,
});

/** Session d'examen : une année + un type (normale / remplacement). */
export const examSessions = pgTable(
  "exam_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    year: smallint("year").notNull(),
    type: sessionType("type").notNull().default("normale"),
    ...timestamps,
  },
  (t) => [uniqueIndex("exam_sessions_year_type_uq").on(t.year, t.type)],
);

/** Épreuve = examen + série (optionnelle) + matière + session. */
export const examPapers = pgTable(
  "exam_papers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    examId: uuid("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "restrict" }),
    seriesId: uuid("series_id").references(() => series.id, {
      onDelete: "restrict",
    }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "restrict" }),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => examSessions.id, { onDelete: "restrict" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    ...timestamps,
  },
  (t) => [
    // Clé naturelle. Deux index uniques partiels car `series_id` est nullable :
    //  - BAC (avec série)  : unicité sur (examen, série, matière, session)
    //  - BEPC (sans série)  : unicité sur (examen, matière, session)
    // Cela évite les doublons que PostgreSQL laisserait passer avec un NULL.
    uniqueIndex("exam_papers_with_series_uq")
      .on(t.examId, t.seriesId, t.subjectId, t.sessionId)
      .where(sql`${t.seriesId} IS NOT NULL`),
    uniqueIndex("exam_papers_without_series_uq")
      .on(t.examId, t.subjectId, t.sessionId)
      .where(sql`${t.seriesId} IS NULL`),
    index("exam_papers_exam_idx").on(t.examId),
    index("exam_papers_series_idx").on(t.seriesId),
    index("exam_papers_subject_idx").on(t.subjectId),
    index("exam_papers_session_idx").on(t.sessionId),
  ],
);

/** Document : fichier PDF (sujet ou corrigé) rattaché à une épreuve. */
export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    examPaperId: uuid("exam_paper_id")
      .notNull()
      .references(() => examPapers.id, { onDelete: "cascade" }),
    type: documentType("type").notNull(),
    // Clé de l'objet dans le stockage R2/S3, et URL publique servie via CDN.
    storageKey: text("storage_key").notNull(),
    url: text("url").notNull(),
    fileSizeBytes: bigint("file_size_bytes", { mode: "number" })
      .notNull()
      .default(0),
    pageCount: smallint("page_count"),
    downloadCount: integer("download_count").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    // Au plus un sujet et un corrigé par épreuve.
    uniqueIndex("documents_paper_type_uq").on(t.examPaperId, t.type),
    index("documents_paper_idx").on(t.examPaperId),
  ],
);

/** Compte visiteur (candidat). Requis avant le téléchargement d'une épreuve. */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
});

/** Compte d'administration du back-office. */
export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: adminRole("role").notNull().default("admin"),
  passwordHash: text("password_hash").notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
});

/**
 * Journal d'audit (A-07) : trace immuable des actions du back-office.
 * On conserve un instantané de l'e-mail de l'acteur (l'admin peut être supprimé
 * plus tard) — pas de clé étrangère, donc, vers `admins`.
 */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: uuid("actor_id"),
    actorEmail: text("actor_email").notNull(),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetLabel: text("target_label"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("audit_logs_created_idx").on(t.createdAt)],
);

/* -------------------------------------------------------------------------- */
/*                                 Relations                                  */
/* -------------------------------------------------------------------------- */

export const examsRelations = relations(exams, ({ many }) => ({
  series: many(series),
  examPapers: many(examPapers),
}));

export const seriesRelations = relations(series, ({ one, many }) => ({
  exam: one(exams, { fields: [series.examId], references: [exams.id] }),
  examPapers: many(examPapers),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  examPapers: many(examPapers),
}));

export const examSessionsRelations = relations(examSessions, ({ many }) => ({
  examPapers: many(examPapers),
}));

export const examPapersRelations = relations(examPapers, ({ one, many }) => ({
  exam: one(exams, { fields: [examPapers.examId], references: [exams.id] }),
  series: one(series, {
    fields: [examPapers.seriesId],
    references: [series.id],
  }),
  subject: one(subjects, {
    fields: [examPapers.subjectId],
    references: [subjects.id],
  }),
  session: one(examSessions, {
    fields: [examPapers.sessionId],
    references: [examSessions.id],
  }),
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  examPaper: one(examPapers, {
    fields: [documents.examPaperId],
    references: [examPapers.id],
  }),
}));

/* -------------------------------------------------------------------------- */
/*                             Types inférés (TS)                             */
/* -------------------------------------------------------------------------- */

export type Exam = typeof exams.$inferSelect;
export type Series = typeof series.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type ExamSession = typeof examSessions.$inferSelect;
export type ExamPaper = typeof examPapers.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Admin = typeof admins.$inferSelect;
export type User = typeof users.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

export type NewExamPaper = typeof examPapers.$inferInsert;
export type NewDocument = typeof documents.$inferInsert;
