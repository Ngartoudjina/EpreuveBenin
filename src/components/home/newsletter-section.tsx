"use client";

import { useActionState, useRef } from "react";

import {
  subscribeNewsletterAction,
  type NewsletterState,
} from "@/app/(public)/actions";
import { CheckIcon, MailIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

import { useScrollReveal } from "./use-scroll-reveal";

export function NewsletterSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  const [state, action, pending] = useActionState<NewsletterState, FormData>(
    subscribeNewsletterAction,
    undefined,
  );

  return (
    <section ref={ref} className="pb-16 sm:pb-20">
      <Container>
        <div
          data-reveal
          className="flex flex-col items-start gap-6 rounded-3xl border border-border bg-surface p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-brand-100 bg-brand-50 text-brand-700">
              <MailIcon className="h-7 w-7" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Restez informé</h2>
              <p className="text-sm text-muted">
                Soyez averti quand de nouvelles épreuves sont ajoutées.
              </p>
            </div>
          </div>

          {state?.ok ? (
            <p className="inline-flex items-center gap-2 font-semibold text-brand-700">
              <CheckIcon className="h-5 w-5" />
              Merci ! Votre adresse a bien été enregistrée.
            </p>
          ) : (
            <form
              action={action}
              className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:flex-wrap"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Adresse e-mail
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="Entrez votre adresse e-mail"
                autoComplete="email"
                className="h-11 w-full flex-1 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              />
              <Button type="submit" disabled={pending} className="shrink-0">
                {pending ? "Envoi…" : "S'abonner"}
              </Button>
              {state?.error && (
                <p className="text-sm font-medium text-red-600 sm:w-full">
                  {state.error}
                </p>
              )}
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
