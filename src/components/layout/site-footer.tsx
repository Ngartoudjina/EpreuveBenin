"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import {
  ArrowRightIcon,
  CheckIcon,
  InstagramIcon,
  MailIcon,
  XIcon,
} from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

const columns = [
  {
    title: "Examens",
    links: [
      { label: "BEPC", href: "/bepc" },
      { label: "BAC", href: "/bac" },
      { label: "Recherche", href: "/recherche" },
    ],
  },
  {
    title: "À propos",
    links: [
      { label: "Le projet", href: "/a-propos" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Légal",
    links: [{ label: "Mentions légales", href: "/mentions-legales" }],
  },
];

const socials = [
  { label: "X (Twitter)", href: "https://x.com/ABeingar84308", Icon: XIcon },
  {
    label: "Instagram",
    href: "https://www.instagram.com/nodam597/",
    Icon: InstagramIcon,
  },
  { label: "E-mail", href: "mailto:abelbeingar@gmail.com", Icon: MailIcon },
];

export function SiteFooter() {
  const root = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-foot]", root.current);
        if (items.length) {
          gsap.from(items, {
            y: 28,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
          });
        }

        // Signature géante : montée en parallaxe liée au défilement.
        const word = root.current?.querySelector("[data-wordmark]");
        if (word) {
          gsap.fromTo(
            word,
            { yPercent: 55 },
            {
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top bottom",
                end: "bottom bottom",
                scrub: true,
              },
            },
          );
        }

        // Fond vivant : halos qui dérivent en continu.
        gsap.to("[data-blob-a]", {
          x: 50,
          y: -30,
          duration: 13,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to("[data-blob-b]", {
          x: -40,
          y: 24,
          duration: 16,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Icônes sociales « magnétiques » (desktop).
      mm.add(
        "(prefers-reduced-motion: no-preference) and (pointer: fine)",
        () => {
          const icons = gsap.utils.toArray<HTMLElement>(
            "[data-magnetic]",
            root.current,
          );
          const cleanups = icons.map((icon) => {
            const xTo = gsap.quickTo(icon, "x", { duration: 0.4, ease: "power3" });
            const yTo = gsap.quickTo(icon, "y", { duration: 0.4, ease: "power3" });
            const move = (e: PointerEvent) => {
              const r = icon.getBoundingClientRect();
              xTo((e.clientX - (r.left + r.width / 2)) * 0.4);
              yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
            };
            const leave = () => {
              xTo(0);
              yTo(0);
            };
            icon.addEventListener("pointermove", move);
            icon.addEventListener("pointerleave", leave);
            return () => {
              icon.removeEventListener("pointermove", move);
              icon.removeEventListener("pointerleave", leave);
            };
          });
          return () => cleanups.forEach((fn) => fn());
        },
      );
    },
    { scope: root },
  );

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer ref={root} className="px-4 pb-6 pt-10 sm:px-6">
      <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#231a13] via-[#19120d] to-[#140e09] px-6 py-12 sm:px-10 sm:py-16">
        {/* Fond vivant */}
        <div className="brand-bar absolute inset-x-0 top-0 h-1" />
        <div className="bg-dots pointer-events-none absolute inset-0 -z-10 text-white/[0.04]" />
        <div
          data-blob-a
          className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl"
        />
        <div
          data-blob-b
          className="pointer-events-none absolute -bottom-24 left-1/4 -z-10 h-72 w-72 rounded-full bg-brand-700/25 blur-3xl"
        />

        {/* Bandeau CTA */}
        <div
          data-foot
          className="flex flex-col gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h2 className="max-w-md text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Tout pour réussir, gratuitement.
            </h2>
            <p className="mt-2 text-white/55">
              Sujets et corrigés officiels du BEPC et du BAC, prêts à télécharger.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
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
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-6 font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Annales du BEPC
            </Link>
          </div>
        </div>

        {/* Marque + colonnes */}
        <div className="grid gap-10 pt-10 lg:grid-cols-12">
          <div data-foot className="lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-white">
                <Image
                  src="/hero/logo.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-full w-full scale-[1.7] object-contain"
                />
              </span>
              <span className="leading-tight">
                <span className="block text-lg font-bold text-white">
                  {siteConfig.name}
                </span>
                <span className="block text-xs text-white/50">
                  Annales BEPC &amp; BAC
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              La plateforme gratuite des annales officielles du BEPC et du BAC au
              Bénin. Rapide, fiable et consultable hors-ligne.
            </p>
            <div className="mt-6 flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  data-magnetic
                  className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10 transition-colors hover:bg-brand-600 hover:text-white hover:ring-brand-600"
                >
                  <s.Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {columns.map((col) => (
              <nav key={col.title} data-foot aria-label={col.title}>
                <p className="text-sm font-semibold text-white">{col.title}</p>
                <ul className="mt-4 space-y-3 text-sm">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="group inline-flex items-center gap-1.5 text-white/60 transition-colors hover:text-white"
                      >
                        <span>{l.label}</span>
                        <ArrowRightIcon className="h-3.5 w-3.5 -translate-x-1 text-brand-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Barre inférieure */}
        <div
          data-foot
          className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>
            © {year} {siteConfig.name}. Service gratuit — République du Bénin.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> · </span>
            Conçu par{" "}
            <a
              href="https://abelbeingar.me"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 font-semibold text-brand-400 transition-colors hover:text-brand-300"
            >
              Abel Beingar
              <ArrowRightIcon className="h-3.5 w-3.5 -rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/admin"
              className="text-white/40 transition-colors hover:text-white/80"
            >
              Administration
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70 ring-1 ring-white/10">
              <CheckIcon className="h-3.5 w-3.5 text-brand-400" /> 100 % gratuit
            </span>
            <button
              type="button"
              onClick={scrollTop}
              aria-label="Revenir en haut de la page"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand-500 hover:bg-brand-600 hover:text-white"
            >
              <ArrowRightIcon className="h-5 w-5 -rotate-90" />
            </button>
          </div>
        </div>

        {/* Signature géante (reflet animé + parallaxe) */}
        <div className="pointer-events-none relative mt-6 select-none overflow-hidden">
          <span
            data-wordmark
            className="animate-shimmer block bg-gradient-to-r from-brand-700/10 via-brand-400/45 to-brand-700/10 bg-clip-text text-[21vw] font-extrabold leading-[0.8] tracking-tight text-transparent lg:text-[12rem]"
          >
            {siteConfig.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
