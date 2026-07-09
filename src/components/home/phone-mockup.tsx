"use client";

import {
  CheckIcon,
  DownloadIcon,
  FileIcon,
  SearchIcon,
} from "@/components/icons";

const previewPapers = [
  { subject: "Mathématiques", meta: "BAC D · 2024 · Sujet + Corrigé" },
  { subject: "Physique-Chimie", meta: "BAC D · 2024 · Sujet" },
  { subject: "SVT", meta: "BAC D · 2023 · Sujet + Corrigé" },
  { subject: "Français", meta: "BAC D · 2023 · Sujet" },
  { subject: "Philosophie", meta: "BAC D · 2022 · Sujet + Corrigé" },
  { subject: "Anglais", meta: "BAC D · 2022 · Sujet" },
];

/** Maquette iPhone au vrai ratio (≈ 9:19.5), contenu défilant clippé. */
export function PhoneMockup() {
  return (
    <div className="relative w-[270px]">
      {/* Boutons latéraux */}
      <span className="absolute -left-[3px] top-[96px] h-6 w-[3px] rounded-l-sm bg-[#0b0f17]" />
      <span className="absolute -left-[3px] top-[140px] h-12 w-[3px] rounded-l-sm bg-[#0b0f17]" />
      <span className="absolute -left-[3px] top-[200px] h-12 w-[3px] rounded-l-sm bg-[#0b0f17]" />
      <span className="absolute -right-[3px] top-[168px] h-[68px] w-[3px] rounded-r-sm bg-[#0b0f17]" />

      {/* Châssis */}
      <div className="rounded-[3rem] bg-[#0b0f17] p-[11px] shadow-[0_45px_90px_-25px_rgba(11,15,23,0.5)]">
        {/* Écran au ratio fixe d'un iPhone */}
        <div className="relative flex aspect-[180/390] flex-col overflow-hidden rounded-[2.4rem] bg-white">
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-[13px] z-20 h-[25px] w-[78px] -translate-x-1/2 rounded-full bg-black" />

          {/* Barre d'état (alignée de part et d'autre de l'island) */}
          <div className="flex items-center justify-between px-5 pb-1 pt-[18px] text-[10.5px] font-semibold text-black">
            <span className="w-[60px]">9:41</span>
            <span className="flex w-[60px] items-center justify-end gap-1">
              <span className="flex items-end gap-[1.5px]">
                <span className="h-1 w-[2px] rounded-[1px] bg-black" />
                <span className="h-1.5 w-[2px] rounded-[1px] bg-black" />
                <span className="h-2 w-[2px] rounded-[1px] bg-black" />
                <span className="h-2.5 w-[2px] rounded-[1px] bg-black" />
              </span>
              <svg
                viewBox="0 0 24 18"
                className="h-2.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.6}
                strokeLinecap="round"
              >
                <path d="M2.5 6.5a15 15 0 0 1 19 0" />
                <path d="M6.5 10.5a9 9 0 0 1 11 0" />
                <circle cx="12" cy="15" r="1.1" fill="currentColor" stroke="none" />
              </svg>
              <span className="relative inline-flex h-2.5 w-[19px] items-center">
                <span className="absolute inset-0 rounded-[2px] border border-black/40" />
                <span className="absolute -right-[2.5px] top-1/2 h-[4px] w-[1.5px] -translate-y-1/2 rounded-r-sm bg-black/40" />
                <span className="absolute inset-[1.5px] right-[5px] rounded-[1px] bg-black" />
              </span>
            </span>
          </div>

          {/* En-tête app */}
          <div className="flex items-center justify-between px-4 pb-1 pt-1">
            <div className="flex items-center gap-1">
              <span className="text-lg leading-none text-muted">‹</span>
              <span className="text-sm font-bold text-foreground">
                BAC · Série D
              </span>
            </div>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
              Aperçu
            </span>
          </div>

          {/* Bandeau hors-ligne */}
          <div className="mx-4 mt-1 flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-[11px] font-semibold text-white">
            <CheckIcon className="h-3.5 w-3.5" />
            Disponible hors-ligne
          </div>

          {/* Liste défilante (remplit la hauteur, contenu clippé) */}
          <div className="flex-1 overflow-hidden px-4 pt-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
              Épreuves récentes
            </p>
            <div className="space-y-2">
              {previewPapers.map((p) => (
                <div
                  key={p.subject}
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-surface p-2.5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-600">
                    <FileIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold leading-tight text-foreground">
                      {p.subject}
                    </p>
                    <p className="truncate text-[10px] text-muted">{p.meta}</p>
                  </div>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                    <DownloadIcon className="h-3.5 w-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recherche (épinglée en bas) */}
          <div className="px-4 pb-1.5 pt-2">
            <div className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-[11px] text-muted shadow-[0_-6px_12px_-8px_rgba(0,0,0,0.15)]">
              <SearchIcon className="h-3.5 w-3.5" />
              Rechercher une épreuve…
            </div>
          </div>

          {/* Barre d'accueil */}
          <div className="flex justify-center pb-2 pt-1">
            <span className="h-1 w-[108px] rounded-full bg-black/85" />
          </div>
        </div>
      </div>
    </div>
  );
}
