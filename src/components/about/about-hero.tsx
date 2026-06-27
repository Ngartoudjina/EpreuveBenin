"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useRef } from "react";

import { ArrowRightIcon, MailIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";

const HEADLINE = "Donner à chaque candidat les mêmes chances de réussir.";

export function AboutHero() {
  const root = useRef<HTMLDivElement>(null);
  const words = HEADLINE.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-blob]", {
          scale: 0.6,
          autoAlpha: 0,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.12,
        })
          .from("[data-eyebrow]", { y: 16, autoAlpha: 0, duration: 0.6 }, 0.1)
          .from(
            "[data-word]",
            {
              yPercent: 120,
              rotateX: -55,
              autoAlpha: 0,
              duration: 0.9,
              stagger: 0.045,
            },
            0.2,
          )
          .from("[data-sub]", { y: 18, autoAlpha: 0, duration: 0.7 }, "-=0.5")
          .from(
            "[data-cta]",
            { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.1 },
            "-=0.4",
          );

        // Halos qui dérivent en continu.
        gsap.to("[data-blob='a']", {
          x: 60,
          y: -36,
          duration: 14,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to("[data-blob='b']", {
          x: -50,
          y: 30,
          duration: 17,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-eyebrow], [data-word], [data-sub], [data-cta], [data-blob]", {
          autoAlpha: 1,
          clearProps: "transform",
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="relative overflow-hidden border-b border-border"
      style={{ perspective: 1000 }}
    >
      {/* Décor */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          data-blob="a"
          className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-brand-300/35 blur-3xl"
        />
        <div
          data-blob="b"
          className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-brand-500/25 blur-3xl"
        />
        <div className="bg-dots absolute inset-0 text-foreground/[0.04]" />
      </div>

      <Container className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p
            data-eyebrow
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/70 px-4 py-1.5 text-sm font-semibold text-brand-700 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Le projet EpreuveBenin
          </p>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                <span data-word className="inline-block">
                  {w}
                </span>
                {i < words.length - 1 && " "}
              </span>
            ))}
          </h1>

          <p
            data-sub
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            EpreuveBenin centralise gratuitement les sujets et corrigés officiels
            du BEPC et du BAC — accessibles partout, même hors connexion.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              data-cta
              href="/recherche"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-lift transition-colors hover:bg-brand-700"
            >
              Explorer les annales
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <a
              data-cta
              href="#message"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-6 py-3 font-semibold text-foreground backdrop-blur transition-colors hover:bg-white"
            >
              <MailIcon className="h-5 w-5 text-brand-600" />
              Nous écrire
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
