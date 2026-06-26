import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";

export type Tile = {
  href: string;
  title: string;
  subtitle?: string;
};

/** Grille responsive de tuiles cliquables (séries, matières, années). */
export function TileGrid({ tiles }: { tiles: Tile[] }) {
  if (tiles.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-muted">
        Aucune épreuve disponible pour le moment dans cette rubrique.
      </p>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map((tile) => (
        <li key={tile.href} data-reveal>
          <Link
            href={tile.href}
            className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-border bg-background p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
          >
            <span>
              <span className="block font-semibold text-foreground transition-colors group-hover:text-brand-700">
                {tile.title}
              </span>
              {tile.subtitle && (
                <span className="mt-0.5 block text-sm text-muted">
                  {tile.subtitle}
                </span>
              )}
            </span>
            <ArrowRightIcon className="h-5 w-5 shrink-0 text-brand-400 transition-transform group-hover:translate-x-1" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
