import Link from "next/link";

export type Crumb = { label: string; href?: string };

/** Fil d'Ariane accessible pour la navigation dans le catalogue. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-brand-600"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && (
              <span aria-hidden className="text-muted/50">
                ›
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
