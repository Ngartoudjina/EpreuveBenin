/**
 * Amorçage de la base : référentiels (examens, séries, matières, sessions)
 * + quelques épreuves et documents d'exemple pour rendre le catalogue navigable.
 *
 * Idempotent : on insère en ignorant les conflits et on relit les identifiants.
 * Lancer avec :  npm run db:seed   (driver « postgres », base déjà migrée)
 *                npm run db:local  (driver « pglite », migre puis amorce)
 */
import "dotenv/config";

import { pathToFileURL } from "node:url";

import { and, eq, isNull } from "drizzle-orm";

import { slugify } from "../lib/format";
import { hashPassword } from "../lib/password";
import type { AppDatabase } from "./index";
import {
  admins,
  documents,
  examPapers,
  examSessions,
  exams,
  series,
  subjects,
} from "./schema";

/** Administrateur de démonstration (à changer en production). */
const DEMO_ADMIN = {
  name: "Administrateur",
  email: "admin@beingar.bj",
  password: "Beingar2026!",
} as const;

/** Séries du BAC d'enseignement général (cf. annexe 12.1 du cahier des charges). */
const BAC_SERIES = [
  { code: "A1", slug: "serie-a1", label: "Série A1 — Littéraire (lettres-langues)", position: 1 },
  { code: "A2", slug: "serie-a2", label: "Série A2 — Littéraire", position: 2 },
  { code: "B", slug: "serie-b", label: "Série B — Sciences sociales et économiques", position: 3 },
  { code: "C", slug: "serie-c", label: "Série C — Mathématiques et sciences physiques", position: 4 },
  { code: "D", slug: "serie-d", label: "Série D — Sciences de la vie et de la Terre", position: 5 },
  { code: "E", slug: "serie-e", label: "Série E — Mathématiques et techniques", position: 6 },
];

/** Matières les plus courantes (extensible via le back-office). */
const SUBJECTS = [
  { code: "MATH", slug: "mathematiques", label: "Mathématiques", position: 1 },
  { code: "PCT", slug: "physique-chimie", label: "Physique-Chimie et Technologie", position: 2 },
  { code: "SVT", slug: "svt", label: "Sciences de la Vie et de la Terre", position: 3 },
  { code: "FR", slug: "francais", label: "Français", position: 4 },
  { code: "PHILO", slug: "philosophie", label: "Philosophie", position: 5 },
  { code: "HG", slug: "histoire-geographie", label: "Histoire-Géographie", position: 6 },
  { code: "ANG", slug: "anglais", label: "Anglais", position: 7 },
  { code: "ESP", slug: "espagnol", label: "Espagnol", position: 8 },
  { code: "ALL", slug: "allemand", label: "Allemand", position: 9 },
  { code: "ECO", slug: "economie", label: "Sciences économiques", position: 10 },
];

/** Sessions récentes (type « normale »). */
const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

/** Épreuves d'exemple (examCode, seriesCode|null, subjectCode, year, corrigé ?). */
const EXAMPLE_PAPERS: {
  examCode: "bepc" | "bac";
  seriesCode: string | null;
  subjectCode: string;
  year: number;
  withCorrige: boolean;
}[] = [
  { examCode: "bepc", seriesCode: null, subjectCode: "MATH", year: 2024, withCorrige: true },
  { examCode: "bepc", seriesCode: null, subjectCode: "MATH", year: 2023, withCorrige: false },
  { examCode: "bepc", seriesCode: null, subjectCode: "FR", year: 2024, withCorrige: true },
  { examCode: "bepc", seriesCode: null, subjectCode: "SVT", year: 2024, withCorrige: false },
  { examCode: "bac", seriesCode: "D", subjectCode: "MATH", year: 2024, withCorrige: true },
  { examCode: "bac", seriesCode: "D", subjectCode: "MATH", year: 2023, withCorrige: false },
  { examCode: "bac", seriesCode: "D", subjectCode: "SVT", year: 2024, withCorrige: true },
  { examCode: "bac", seriesCode: "D", subjectCode: "PCT", year: 2024, withCorrige: false },
  { examCode: "bac", seriesCode: "C", subjectCode: "MATH", year: 2024, withCorrige: true },
  { examCode: "bac", seriesCode: "C", subjectCode: "PCT", year: 2023, withCorrige: false },
];

export async function seedReferentials(db: AppDatabase): Promise<void> {
  // 1. Examens
  await db
    .insert(exams)
    .values([
      { code: "bepc", label: "BEPC", position: 1 },
      { code: "bac", label: "BAC", position: 2 },
    ])
    .onConflictDoNothing();
  const allExams = await db.select().from(exams);
  const examByCode = new Map(allExams.map((e) => [e.code, e]));

  const bac = examByCode.get("bac");
  if (!bac) throw new Error("Examen BAC introuvable après insertion.");

  // 2. Séries du BAC
  await db
    .insert(series)
    .values(BAC_SERIES.map((s) => ({ ...s, examId: bac.id })))
    .onConflictDoNothing();
  const allSeries = await db.select().from(series);
  const seriesByCode = new Map(allSeries.map((s) => [s.code, s]));

  // 3. Matières
  await db.insert(subjects).values(SUBJECTS).onConflictDoNothing();
  const allSubjects = await db.select().from(subjects);
  const subjectByCode = new Map(allSubjects.map((s) => [s.code, s]));

  // 4. Sessions
  await db
    .insert(examSessions)
    .values(YEARS.map((year) => ({ year, type: "normale" as const })))
    .onConflictDoNothing();
  const allSessions = await db.select().from(examSessions);
  const sessionByYear = new Map(
    allSessions.filter((s) => s.type === "normale").map((s) => [s.year, s]),
  );

  // 5. Épreuves d'exemple + documents
  for (const ex of EXAMPLE_PAPERS) {
    const exam = examByCode.get(ex.examCode);
    const subject = subjectByCode.get(ex.subjectCode);
    const session = sessionByYear.get(ex.year);
    const serie = ex.seriesCode ? seriesByCode.get(ex.seriesCode) : null;
    if (!exam || !subject || !session) continue;

    const title = `${exam.label}${serie ? ` ${serie.code}` : ""} — ${subject.label} — ${ex.year}`;
    const slug = slugify(
      `${exam.code} ${serie?.code ?? ""} ${subject.slug} ${ex.year}`,
    );

    // Idempotence : on cherche l'épreuve par sa clé naturelle avant d'insérer.
    const existing = await db
      .select()
      .from(examPapers)
      .where(
        and(
          eq(examPapers.examId, exam.id),
          serie
            ? eq(examPapers.seriesId, serie.id)
            : isNull(examPapers.seriesId),
          eq(examPapers.subjectId, subject.id),
          eq(examPapers.sessionId, session.id),
        ),
      );

    let paperId = existing[0]?.id;
    if (!paperId) {
      const inserted = await db
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
      paperId = inserted[0]?.id;
    }
    if (!paperId) continue;

    await db
      .insert(documents)
      .values([
        {
          examPaperId: paperId,
          type: "sujet" as const,
          storageKey: `exemples/${slug}-sujet.pdf`,
          url: "/exemples/exemple.pdf",
          fileSizeBytes: 48_211,
          pageCount: 4,
        },
        ...(ex.withCorrige
          ? [
              {
                examPaperId: paperId,
                type: "corrige" as const,
                storageKey: `exemples/${slug}-corrige.pdf`,
                url: "/exemples/exemple.pdf",
                fileSizeBytes: 61_804,
                pageCount: 7,
              },
            ]
          : []),
      ])
      .onConflictDoNothing();
  }

  // 6. Administrateur de démonstration
  const existingAdmin = await db
    .select()
    .from(admins)
    .where(eq(admins.email, DEMO_ADMIN.email));
  if (existingAdmin.length === 0) {
    await db.insert(admins).values({
      name: DEMO_ADMIN.name,
      email: DEMO_ADMIN.email,
      role: "super_admin",
      passwordHash: await hashPassword(DEMO_ADMIN.password),
    });
  }
}

// Exécution directe : amorce via le client partagé (driver courant).
async function runCli() {
  const { db } = await import("./index");
  console.log("🌱  Amorçage de la base…");
  await seedReferentials(db);
  console.log("✅  Amorçage terminé.");
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  runCli()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌  Échec de l'amorçage :", err);
      process.exit(1);
    });
}
