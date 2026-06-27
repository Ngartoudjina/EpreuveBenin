"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

export type QA = { q: string; a: string };

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-5 w-5 shrink-0 text-brand-600 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FaqItem({
  item,
  open,
  onToggle,
}: {
  item: QA;
  open: boolean;
  onToggle: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = panelRef.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(el, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0 });
        return;
      }
      if (open) {
        gsap.to(el, { height: "auto", autoAlpha: 1, duration: 0.45, ease: "power2.out" });
      } else {
        gsap.to(el, { height: 0, autoAlpha: 0, duration: 0.3, ease: "power2.inOut" });
      }
    },
    { dependencies: [open] },
  );

  return (
    <div
      data-reveal
      className="overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-soft backdrop-blur-xl transition-colors hover:bg-white/80"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-foreground">{item.q}</span>
        <Chevron open={open} />
      </button>
      <div ref={panelRef} style={{ height: 0, opacity: 0, overflow: "hidden" }}>
        <p className="px-5 pb-5 leading-relaxed text-muted">{item.a}</p>
      </div>
    </div>
  );
}

export function Faq({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <FaqItem
          key={item.q}
          item={item}
          open={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </div>
  );
}
