import { cn } from "@/lib/utils";

/** Conteneur centré à largeur maximale, avec marges latérales mobile-first. */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}
      {...props}
    />
  );
}
