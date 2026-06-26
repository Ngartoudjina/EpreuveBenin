import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "accent" | "outline";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-foreground",
  brand: "bg-brand-50 text-brand-700",
  accent: "bg-accent text-accent-foreground",
  outline: "border border-border text-muted",
};

/** Petite étiquette (statut, métadonnée, compteur). */
export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
