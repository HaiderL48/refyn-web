import Link from "next/link";

const footerMuted = "text-[#777777]";

const productLinks = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
] as const;

const legalLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund", label: "Refund Policy" },
] as const;

function FooterLinkColumn({
  links,
}: {
  links: readonly { href: string; label: string }[];
}) {
  return (
    <ul className="flex flex-col gap-2">
      {links.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`text-xs ${footerMuted} transition-colors hover:text-on-surface`}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-surface">
      <div className="mx-auto max-w-container-max border-t border-outline-variant/50 px-4 py-6 sm:px-6 md:px-margin-desktop md:py-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-1.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-outline-variant/30 bg-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  bolt
                </span>
              </span>
              <span className="text-xs font-bold tracking-tight text-on-surface">
                PromptRefine
              </span>
            </Link>
            <p className={`mt-2.5 text-xs leading-relaxed ${footerMuted}`}>
              Rewrites your AI prompts instantly so you get better answers every
              time.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 sm:gap-14 md:justify-end">
            <FooterLinkColumn links={productLinks} />
            <FooterLinkColumn links={legalLinks} />
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant/50">
        <div className="mx-auto max-w-container-max px-4 py-3 sm:px-6 md:px-margin-desktop">
          <p className={`text-[11px] ${footerMuted}`}>
            © {year} PromptRefine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
