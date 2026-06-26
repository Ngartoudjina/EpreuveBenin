"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { ArrowRightIcon, BoltIcon, GiftIcon, SparkleIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const stats = [
  { value: "100%", label: "Gratuit" },
  { value: "BEPC·BAC", label: "Examens couverts" },
  { value: "Hors-ligne", label: "Toujours accessible" },
];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const collage = useRef<HTMLDivElement>(null);
  const deco = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          delay: 0.1,
        });
        tl.from(".hero-eyebrow", { y: 12, opacity: 0, duration: 0.5, ease: "power3.out" })
          .from(".hero-line", { yPercent: 120, duration: 0.9, stagger: 0.12 }, "-=0.15")
          .from(
            ".hero-rise",
            { y: 22, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
            "-=0.5",
          )
          .from(
            ".hero-photo",
            { y: 32, opacity: 0, duration: 0.85, stagger: 0.15, ease: "power3.out" },
            "-=0.55",
          )
          .from(
            ".hero-photo img",
            { scale: 1.25, duration: 1.3, stagger: 0.15, ease: "power2.out" },
            "<",
          )
          .from(
            ".hero-deco",
            { scale: 0, opacity: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.8)" },
            "-=0.7",
          );

        gsap.to(".hero-float-a", {
          y: -12,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(".hero-float-b", {
          y: 10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Parallaxe au survol — desktop (pointeur précis) uniquement.
      mm.add(
        "(prefers-reduced-motion: no-preference) and (pointer: fine)",
        () => {
          if (!root.current || !collage.current || !deco.current) return;
          const xC = gsap.quickTo(collage.current, "x", { duration: 0.7, ease: "power3" });
          const yC = gsap.quickTo(collage.current, "y", { duration: 0.7, ease: "power3" });
          const xD = gsap.quickTo(deco.current, "x", { duration: 0.9, ease: "power3" });
          const yD = gsap.quickTo(deco.current, "y", { duration: 0.9, ease: "power3" });
          const el = root.current;

          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            xC(px * 18);
            yC(py * 18);
            xD(px * -38);
            yD(py * -38);
          };

          el.addEventListener("pointermove", onMove);
          return () => el.removeEventListener("pointermove", onMove);
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-background to-background"
    >
      <div className="pointer-events-none absolute inset-0 bg-dots text-brand-100" />
      <Container className="relative grid items-center gap-10 py-12 sm:gap-12 sm:py-20 lg:grid-cols-2">
        {/* Colonne gauche */}
        <div>
          <span className="hero-eyebrow mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
            <SparkleIcon className="h-4 w-4" />
            100 % gratuit · sujets &amp; corrigés
          </span>
          <h1 className="text-[2rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            <span className="block overflow-hidden pb-1">
              <span className="hero-line block">Une nouvelle façon</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="hero-line block">
                de réviser le <span className="text-brand-600">BEPC</span> &amp;
                le <span className="text-brand-600">BAC</span>
              </span>
            </span>
          </h1>
          <p className="hero-rise mt-4 max-w-md text-base text-muted sm:mt-5 sm:text-lg">
            EpreuveBenin met à ta disposition les annales officielles — sujets et
            corrigés — à télécharger gratuitement, même en connexion limitée.
          </p>

          <div className="hero-rise mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link
              href="/bac"
              className={buttonVariants({
                variant: "primary",
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              Annales du BAC
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/bepc"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              Annales du BEPC
            </Link>
          </div>

          <div className="hero-rise mt-8 flex items-center gap-5 sm:mt-10 sm:gap-6">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={i > 0 ? "border-l border-border pl-5 sm:pl-6" : ""}
              >
                <p className="text-xl font-extrabold text-foreground sm:text-2xl">
                  {s.value}
                </p>
                <p className="text-xs text-muted sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne droite — mosaïque */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-xl">
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-gradient-to-tr from-brand-200/60 via-brand-300/30 to-transparent blur-3xl" />

          <div ref={collage} className="grid grid-cols-2 items-start gap-3 sm:gap-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="hero-photo relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lift ring-1 ring-black/5 sm:rounded-3xl">
                <Image
                  src="/hero/hero1.jpg"
                  alt="Élève en pleine composition"
                  fill
                  priority
                  sizes="(min-width: 1024px) 22vw, 42vw"
                  className="object-cover"
                />
              </div>
              <div className="hero-photo relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lift ring-1 ring-black/5 sm:rounded-3xl">
                <Image
                  src="/hero/hero3.jpg"
                  alt="Candidates souriantes en classe"
                  fill
                  sizes="(min-width: 1024px) 22vw, 42vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="hero-photo relative aspect-[2/3] overflow-hidden rounded-2xl shadow-lift ring-1 ring-black/5 sm:rounded-3xl">
              <Image
                src="/hero/hero2.jpg"
                alt="Étudiant souriant avec ses cahiers"
                fill
                priority
                sizes="(min-width: 1024px) 26vw, 48vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Décorations — réservées aux écrans ≥ sm, sauf la carte « gratuit ». */}
          <div ref={deco} className="pointer-events-none absolute inset-0">
            <span className="hero-deco hero-float-a absolute -right-3 top-6 hidden h-14 w-14 place-items-center rounded-full bg-brand-600 text-white shadow-lift sm:grid">
              <BoltIcon className="h-6 w-6" />
            </span>
            <SparkleIcon className="hero-deco hero-float-b absolute -left-5 top-1/3 hidden h-9 w-9 text-brand-400 sm:block" />
            <div className="hero-deco hero-float-b absolute bottom-2 left-2 flex items-center gap-2.5 rounded-2xl border border-white/60 bg-white/85 px-3 py-2 shadow-lift backdrop-blur sm:-bottom-5 sm:-left-4 sm:gap-3 sm:px-4 sm:py-3">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-white sm:h-9 sm:w-9">
                <GiftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <div>
                <p className="text-xs font-bold leading-tight text-foreground sm:text-sm">
                  100 % gratuit
                </p>
                <p className="text-[11px] leading-tight text-muted sm:text-xs">
                  Sujets &amp; corrigés
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
