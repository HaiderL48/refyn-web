import type { ReactNode } from "react";
import { Navbar } from "@/app/components/landing/navbar";
import { SiteFooter } from "@/app/components/site-footer";

export function LegalDocumentLayout({
  title,
  description,
  lastUpdated,
  children,
}: {
  title: string;
  description?: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1 pt-14">
        <article className="mx-auto max-w-3xl px-margin-mobile py-12 md:px-margin-desktop md:py-16">
          <p className="text-label-sm uppercase tracking-widest text-secondary">
            Legal
          </p>
          <h1 className="mt-3 text-headline-lg font-semibold text-on-surface md:text-display-lg">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 text-body-lg leading-relaxed text-on-surface-variant">
              {description}
            </p>
          ) : null}
          <p className="mt-2 text-body-sm text-on-surface-variant/80">
            Last updated: {lastUpdated}
          </p>
          <div className="legal-prose mt-10 flex flex-col gap-8 text-body-md leading-relaxed text-on-surface-variant">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
