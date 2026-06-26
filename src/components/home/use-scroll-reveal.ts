import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Révélations au défilement, pilotées par attributs de données :
 *   - `data-reveal`  : apparition (fondu + translation) en cascade quand la
 *                      section entre dans la fenêtre ;
 *   - `data-line`    : tracé d'une ligne (scaleX 0 → 1) ;
 *   - `data-float-a` / `data-float-b` : flottement continu (décorations).
 *
 * Désactivé si l'utilisateur a demandé à réduire les animations ; le contenu
 * reste visible sans JavaScript.
 */
export function useScrollReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(
          "[data-reveal]",
          scope.current,
        );
        if (items.length) {
          gsap.from(items, {
            y: 32,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: scope.current, start: "top 75%", once: true },
          });
        }

        const lines = gsap.utils.toArray<HTMLElement>(
          "[data-line]",
          scope.current,
        );
        lines.forEach((line) => {
          gsap.from(line, {
            scaleX: 0,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: { trigger: line, start: "top 85%", once: true },
          });
        });

        const floatA = gsap.utils.toArray("[data-float-a]", scope.current);
        const floatB = gsap.utils.toArray("[data-float-b]", scope.current);
        if (floatA.length)
          gsap.to(floatA, { y: -14, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
        if (floatB.length)
          gsap.to(floatB, { y: 12, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });
    },
    { scope },
  );
}
