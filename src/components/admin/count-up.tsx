"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { formatNumber } from "@/lib/format";

/** Compteur animé (0 → valeur) au montage, via GSAP. */
export function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || value <= 0) {
        el.textContent = formatNumber(value);
        return;
      }
      const obj = { n: 0 };
      el.textContent = "0";
      gsap.to(obj, {
        n: value,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = formatNumber(Math.round(obj.n));
        },
      });
    },
    { dependencies: [value], scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {formatNumber(value)}
    </span>
  );
}
