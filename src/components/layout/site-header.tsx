"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  ArrowRightIcon,
  GraduationIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";
import { siteConfig } from "@/lib/site";

const links = [
  { label: "BEPC", href: "/bepc" },
  { label: "BAC", href: "/bac" },
  { label: "À propos", href: "/a-propos" },
];

const menu = [
  { label: "Accueil", href: "/", sub: "Page d'accueil", Icon: HomeIcon },
  { label: "BEPC", href: "/bepc", sub: "Brevet d'Études du Premier Cycle", Icon: GraduationIcon },
  { label: "BAC", href: "/bac", sub: "Baccalauréat", Icon: GraduationIcon },
  { label: "À propos", href: "/a-propos", sub: "Le projet EpreuveBenin", Icon: HomeIcon },
];

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [open, setOpen] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] ?? "Mon compte";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  /* ---------------------- Indicateur glissant (desktop) ---------------------- */
  const move = useCallback((el: HTMLElement | null) => {
    const ind = indicatorRef.current;
    const nav = navRef.current;
    if (!ind || !nav) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el) {
      gsap.to(ind, { opacity: 0, duration: reduce ? 0 : 0.2 });
      return;
    }
    const navBox = nav.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    gsap.to(ind, {
      x: box.left - navBox.left,
      width: box.width,
      opacity: 1,
      duration: reduce ? 0 : 0.45,
      ease: "power3.out",
    });
  }, []);

  const toActive = useCallback(() => {
    move(navRef.current?.querySelector<HTMLElement>("[data-active='true']") ?? null);
  }, [move]);

  useEffect(() => {
    toActive();
    const onResize = () => toActive();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname, toActive]);

  /* ----------------------- Animations sophistiquées -------------------------- */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrée des pilules.
        gsap.from("[data-navpill]", {
          y: -18,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.12,
        });

        // Masquage au défilement vers le bas, réapparition vers le haut.
        const header = headerRef.current;
        if (header) {
          const yTo = gsap.quickTo(header, "yPercent", { duration: 0.4, ease: "power3" });
          let last = window.scrollY;
          const onScroll = () => {
            const y = window.scrollY;
            if (y > 130 && y > last + 3) yTo(-135);
            else if (y < last - 3 || y < 90) yTo(0);
            last = y;
          };
          window.addEventListener("scroll", onScroll, { passive: true });
          return () => window.removeEventListener("scroll", onScroll);
        }
      });

      // CTA magnétique (desktop).
      mm.add(
        "(prefers-reduced-motion: no-preference) and (pointer: fine)",
        () => {
          const cta = ctaRef.current;
          if (!cta) return;
          const xTo = gsap.quickTo(cta, "x", { duration: 0.4, ease: "power3" });
          const yTo = gsap.quickTo(cta, "y", { duration: 0.4, ease: "power3" });
          const onMove = (e: PointerEvent) => {
            const r = cta.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
          };
          cta.addEventListener("pointermove", onMove);
          cta.addEventListener("pointerleave", onLeave);
          return () => {
            cta.removeEventListener("pointermove", onMove);
            cta.removeEventListener("pointerleave", onLeave);
          };
        },
      );

      // Timeline du menu mobile.
      if (panelRef.current && backdropRef.current) {
        const items = panelRef.current.querySelectorAll("[data-menu-item]");
        const tl = gsap.timeline({ paused: true });
        tl.set([backdropRef.current, panelRef.current], { autoAlpha: 0 });
        tl.set(items, { autoAlpha: 0, y: 14 });
        tl.to(backdropRef.current, { autoAlpha: 1, duration: 0.25, ease: "power2.out" }, 0)
          .to(panelRef.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", startAt: { y: -12 } }, 0)
          .to(items, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power3.out" }, 0.1);
        tlRef.current = tl;
      }
    },
    { scope: headerRef },
  );

  /* ------------------------------- Menu mobile ------------------------------- */
  useEffect(() => {
    const tl = tlRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (tl) {
      if (open) {
        if (reduce) tl.progress(1).pause();
        else tl.play();
      } else {
        if (reduce) tl.progress(0).pause();
        else tl.reverse();
      }
    }
    if (!open) return;

    // Verrou de défilement : on bloque le scroll tant que le menu est ouvert.
    // overflow:hidden sur <html> (préserve l'en-tête sticky) + blocage du
    // touchmove hors panneau (indispensable sur iOS Safari).
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const blockTouch = (e: TouchEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) e.preventDefault();
    };
    document.addEventListener("touchmove", blockTouch, { passive: false });

    panelRef.current?.querySelector<HTMLElement>("[data-menu-item]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      html.style.overflow = previousOverflow;
      document.removeEventListener("touchmove", blockTouch);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(
    () => () => {
      document.documentElement.style.overflow = "";
    },
    [],
  );

  return (
    <header ref={headerRef} className="sticky top-0 z-50 px-4 pt-3 sm:pt-4">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3">
        {/* Pilule logo */}
        <Link
          href="/"
          data-navpill
          aria-label={`${siteConfig.name} — accueil`}
          onClick={() => setOpen(false)}
          className="relative z-40 flex items-center gap-2 rounded-full bg-white py-3 pl-3 pr-5 shadow-lift ring-1 ring-black/[0.03]"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {siteConfig.name.charAt(0)}
          </span>
          <span className="text-sm font-extrabold uppercase tracking-wide text-foreground">
            {siteConfig.name}
          </span>
        </Link>

        {/* Pilule navigation (desktop) */}
        <nav
          data-navpill
          className="relative z-40 hidden items-center gap-1 rounded-full bg-white py-2 pl-5 pr-2 shadow-lift ring-1 ring-black/[0.03] lg:flex"
        >
          <div
            ref={navRef}
            className="relative flex items-center gap-0.5"
            onMouseLeave={toActive}
          >
            <span
              ref={indicatorRef}
              aria-hidden
              style={{ width: 0, opacity: 0 }}
              className="pointer-events-none absolute left-0 top-0 h-full rounded-full bg-brand-50"
            />
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={(e) => move(e.currentTarget)}
                  className={`relative z-10 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                    active ? "text-brand-700" : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {user ? (
            <div className="ml-1 flex items-center gap-1">
              <span className="hidden px-2 text-sm font-semibold text-foreground xl:inline">
                {firstName}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              href="/connexion"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Connexion
            </Link>
          )}

          <Link
            ref={ctaRef}
            href="/recherche"
            className="cta-shine ml-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-shadow hover:shadow-lift"
          >
            <SearchIcon className="h-4 w-4" />
            Rechercher
          </Link>
        </nav>

        {/* Pilule menu (mobile) */}
        <button
          ref={toggleRef}
          type="button"
          data-navpill
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="relative z-40 grid h-12 w-12 place-items-center rounded-full bg-white text-foreground shadow-lift ring-1 ring-black/[0.03] lg:hidden"
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full bg-current transition-all duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${open ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0"}`} />
          </span>
        </button>

        {/* Panneau mobile (display:contents → n'est pas un élément flex) */}
        <div className="contents lg:hidden">
          <div
            ref={backdropRef}
            onClick={() => setOpen(false)}
            aria-hidden
            className="invisible fixed inset-0 z-20 bg-foreground/30 opacity-0 backdrop-blur-md"
          />
          <nav
            id="menu-mobile"
            ref={panelRef}
            aria-label="Menu"
            className="invisible absolute inset-x-0 top-full z-30 mt-2 rounded-3xl border border-white/60 bg-white/70 p-2 opacity-0 shadow-[0_24px_60px_-15px_rgba(28,20,16,0.35)] ring-1 ring-white/40 backdrop-blur-2xl"
          >
            {menu.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-menu-item
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors ${active ? "bg-brand-50" : "hover:bg-surface"}`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? "bg-brand-600 text-white" : "bg-surface-2 text-brand-700"}`}>
                    <item.Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className={`block font-semibold ${active ? "text-brand-700" : "text-foreground"}`}>
                      {item.label}
                    </span>
                    <span className="block text-xs text-muted">{item.sub}</span>
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-muted" />
                </Link>
              );
            })}
            {user ? (
              <button
                type="button"
                data-menu-item
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-surface"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                  {firstName.charAt(0).toUpperCase()}
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-foreground">
                    {firstName}
                  </span>
                  <span className="block text-xs text-muted">Se déconnecter</span>
                </span>
              </button>
            ) : (
              <Link
                href="/connexion"
                data-menu-item
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-surface"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-brand-700">
                  <UserIcon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-foreground">
                    Connexion
                  </span>
                  <span className="block text-xs text-muted">
                    Accéder à mon compte
                  </span>
                </span>
                <ArrowRightIcon className="h-4 w-4 text-muted" />
              </Link>
            )}

            <div className="mt-2 border-t border-border/70 p-1 pt-2">
              <Link
                href="/recherche"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 font-semibold text-white"
              >
                <SearchIcon className="h-4 w-4" />
                Rechercher une épreuve
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
