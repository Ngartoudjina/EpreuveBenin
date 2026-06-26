/**
 * Import en masse d'épreuves depuis un CSV (fonction A-05 du cahier des charges).
 *
 * Le CSV ne contient que des métadonnées : examen, série (BAC), matière, année,
 * type. Les épreuves sont créées « à compléter » ; les PDF (sujet/corrigé) sont
 * ensuite téléversés depuis la page de gestion de chaque épreuve.
 *
 * Chaque ligne est traitée indépendamment : une ligne invalide est signalée
 * sans interrompre l'import des autres. Un mode « analyse » (dry-run) valide
 * tout sans rien écrire en base.
 */
import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { examPapers, examSessions, exams, series, subjects } from "@/db/schema";
import { normalizeText, slugify } from "@/lib/format";

const CURRENT_YEAR = new Date().getFullYear();

export type ImportRowStatus = "created" | "skipped" | "error";

export type ImportRowResult = {
  line: number;
  status: ImportRowStatus;
  message: string;
};

export type ImportReport = {
  total: number;
  created: number;
  skipped: number;
  errors: number;
  dryRun: boolean;
  rows: ImportRowResult[];
};

/* ------------------------------- Parsing CSV ------------------------------- */

/** Détecte le séparateur le plus probable (Excel FR exporte souvent en « ; »). */
function detectDelimiter(headerLine: string): "," | ";" {
  const commas = (headerLine.match(/,/g) ?? []).length;
  const semis = (headerLine.match(/;/g) ?? []).length;
  return semis > commas ? ";" : ",";
}

/** Parseur CSV minimal mais correct (guillemets, échappements, retours ligne). */
export function parseCsv(text: string): string[][] {
  const clean = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const delim = detectDelimiter(clean.split("\n", 1)[0] ?? "");

  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delim) {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // On ignore les lignes entièrement vides.
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/* --------------------------------- Import ---------------------------------- */

export async function importPapers(
  csvText: string,
  opts: { dryRun: boolean },
): Promise<ImportReport> {
  const grid = parseCsv(csvText);
  if (grid.length < 2) {
    throw new Error(
      "CSV vide : une ligne d'en-tête et au moins une ligne de données sont requises.",
    );
  }

  const header = grid[0].map((h) => normalizeText(h));
  const idx = {
    examen: header.indexOf("examen"),
    serie: header.indexOf("serie"),
    matiere: header.indexOf("matiere"),
    annee: header.indexOf("annee"),
    type: header.indexOf("type"),
  };
  for (const col of ["examen", "matiere", "annee"] as const) {
    if (idx[col] < 0) {
      throw new Error(`Colonne « ${col} » manquante dans l'en-tête.`);
    }
  }

  // Pré-chargement des référentiels (résolution en mémoire, sans requête/ligne).
  const [allExams, allSeries, allSubjects] = await Promise.all([
    db.select().from(exams),
    db.select().from(series),
    db.select().from(subjects),
  ]);

  const rows: ImportRowResult[] = [];
  const seen = new Set<string>();
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (let r = 1; r < grid.length; r++) {
    const line = r + 1; // numéro de ligne dans le fichier (en-tête = 1)
    const cells = grid[r];
    const get = (i: number) => (i >= 0 ? (cells[i] ?? "").trim() : "");

    try {
      // Examen (par code bepc/bac ou libellé).
      const examKey = normalizeText(get(idx.examen));
      const exam = allExams.find(
        (e) => e.code === examKey || normalizeText(e.label) === examKey,
      );
      if (!exam) {
        throw new Error(
          `Examen inconnu : « ${get(idx.examen)} » (attendu : bepc ou bac).`,
        );
      }

      // Série (requise pour le BAC, interdite pour le BEPC).
      const serieRaw = get(idx.serie);
      let serie: (typeof allSeries)[number] | null = null;
      if (serieRaw) {
        serie =
          allSeries.find(
            (s) =>
              s.examId === exam.id &&
              normalizeText(s.code) === normalizeText(serieRaw),
          ) ?? null;
        if (!serie) {
          throw new Error(
            `Série « ${serieRaw} » introuvable pour ${exam.label}.`,
          );
        }
      }
      if (exam.code === "bac" && !serie) {
        throw new Error("Une série est requise pour le BAC.");
      }
      if (exam.code === "bepc" && serie) {
        throw new Error("Le BEPC ne comporte pas de série.");
      }

      // Matière (par libellé, code ou slug).
      const matRaw = get(idx.matiere);
      const matKey = normalizeText(matRaw);
      const matSlug = slugify(matRaw);
      const subject = allSubjects.find(
        (s) =>
          normalizeText(s.label) === matKey ||
          normalizeText(s.code) === matKey ||
          s.slug === matSlug,
      );
      if (!subject) {
        throw new Error(`Matière introuvable : « ${matRaw} ».`);
      }

      // Année.
      const yearNum = Number.parseInt(get(idx.annee), 10);
      if (
        !Number.isInteger(yearNum) ||
        yearNum < 1990 ||
        yearNum > CURRENT_YEAR + 1
      ) {
        throw new Error(`Année invalide : « ${get(idx.annee)} ».`);
      }

      // Type de session.
      const typeRaw = normalizeText(get(idx.type));
      if (typeRaw && typeRaw !== "normale" && typeRaw !== "remplacement") {
        throw new Error(
          `Type invalide : « ${get(idx.type)} » (normale ou remplacement).`,
        );
      }
      const type: "normale" | "remplacement" =
        typeRaw === "remplacement" ? "remplacement" : "normale";

      // Doublon à l'intérieur du fichier.
      const key = [exam.id, serie?.id ?? "", subject.id, yearNum, type].join(
        "|",
      );
      if (seen.has(key)) {
        rows.push({
          line,
          status: "skipped",
          message: "Doublon dans le fichier.",
        });
        skipped++;
        continue;
      }
      seen.add(key);

      // Session existante (créée seulement à l'import réel).
      let session = (
        await db
          .select()
          .from(examSessions)
          .where(and(eq(examSessions.year, yearNum), eq(examSessions.type, type)))
      )[0];

      // Doublon en base (clé naturelle).
      if (session) {
        const dup = await db
          .select({ id: examPapers.id })
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
        if (dup.length > 0) {
          rows.push({
            line,
            status: "skipped",
            message: "Épreuve déjà existante.",
          });
          skipped++;
          continue;
        }
      }

      const title = `${exam.label}${serie ? ` ${serie.code}` : ""} — ${subject.label} — ${yearNum}`;

      if (opts.dryRun) {
        rows.push({ line, status: "created", message: `${title} (à importer)` });
        created++;
        continue;
      }

      session ??= (
        await db
          .insert(examSessions)
          .values({ year: yearNum, type })
          .returning()
      )[0];

      const slug = slugify(
        `${exam.code} ${serie?.code ?? ""} ${subject.slug} ${yearNum}`,
      );
      await db.insert(examPapers).values({
        examId: exam.id,
        seriesId: serie?.id ?? null,
        subjectId: subject.id,
        sessionId: session.id,
        title,
        slug,
      });

      rows.push({ line, status: "created", message: title });
      created++;
    } catch (error) {
      rows.push({
        line,
        status: "error",
        message: error instanceof Error ? error.message : "Erreur inconnue.",
      });
      errors++;
    }
  }

  return {
    total: grid.length - 1,
    created,
    skipped,
    errors,
    dryRun: opts.dryRun,
    rows,
  };
}
