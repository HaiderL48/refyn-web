import { PricingCheckoutButton } from "./pricing-checkout-button";

type CtaVariant = "muted" | "emphasis";

type Tier = {
  id: string;
  name: string;
  priceMain: string;
  priceSuffix: string;
  listEyebrow: string;
  cta: { label: string; variant: CtaVariant };
  features: string[];
  highlight?: boolean;
};

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    priceMain: "₹0",
    priceSuffix: "/month",
    listEyebrow: "Includes:",
    cta: { label: "Get Started", variant: "muted" },
    features: [
      "20 enhancements/day",
      "Enhance & compress modes",
      "Works across all apps",
      "Global shortcut",
      "Clipboard automation",
      "Toast notifications",
      "Basic optimization",
      "Cross-platform support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceMain: "₹89",
    priceSuffix: "/month",
    listEyebrow: "Everything in Free, plus:",
    cta: { label: "Upgrade to Pro", variant: "emphasis" },
    features: [
      "Unlimited enhancements",
      "Faster priority servers",
      "Advanced quality engine",
      "Smart technical handling",
      "Better detailed logs",
      "Future modes & early access",
      "Priority updates",
    ],
    highlight: true,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    priceMain: "₹1199",
    priceSuffix: "one-time",
    listEyebrow: "Everything in Pro, plus:",
    cta: { label: "Buy Once, Use Forever", variant: "muted" },
    features: [
      "Lifetime access guarantee",
      "No recurring subscriptions",
      "All future major updates",
      "Permanent premium features",
      "Early adopter pricing",
      "Priority feature access",
    ],
  },
];

function CheckGlyph() {
  return (
    <svg
      className="mt-[3px] h-3.5 w-3.5 shrink-0 text-on-surface sm:h-4 sm:w-4"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3.33 8.33 6.67 11.67 12.67 4.67"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 bg-surface-container-low/30 py-12 md:py-16 lg:py-20"
    >
      <div className="mx-auto flex max-w-container-max flex-col border-t border-outline-variant/50 px-margin-mobile pt-10 md:px-margin-desktop md:pt-12">
        <header className="mx-auto max-w-2xl text-center md:max-w-3xl">
          <h2 className="text-balance font-sans text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl md:text-5xl">
            Precision Prompting,{" "}
            <span className="text-secondary">Refined.</span>
          </h2>
        </header>

        <div className="mt-14 grid gap-5 md:mt-16 md:grid-cols-3 md:items-stretch md:gap-4 lg:gap-6">
          {TIERS.map((tier) => (
            <article
              key={tier.id}
              className={`flex h-full flex-col rounded-2xl px-7 py-8 sm:p-9 ${
                tier.highlight
                  ? "bg-surface-container-highest/50"
                  : "bg-surface-container-highest/50"
              }`}
            >
              <h3 className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl md:text-[1.75rem]">
                {tier.name}
              </h3>

              <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-2xl font-semibold tabular-nums tracking-tight text-on-surface sm:text-3xl md:text-[1.75rem]">
                  {tier.priceMain}
                </span>
                <span className="text-body-sm font-medium text-on-surface-variant sm:text-body-md">
                  {tier.priceSuffix}
                </span>
              </div>

              <p className="mt-8 text-label-sm uppercase tracking-[0.12em] text-on-surface-variant/75">
                {tier.listEyebrow}
              </p>
              <ul className="mt-4 flex flex-1 flex-col gap-3.5 pb-6">
                {tier.features.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 text-body-sm leading-snug text-on-surface sm:text-body-md"
                  >
                    <CheckGlyph />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4">
                <PricingCheckoutButton
                  packageId={tier.id}
                  label={tier.cta.label}
                  variant={tier.cta.variant}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
