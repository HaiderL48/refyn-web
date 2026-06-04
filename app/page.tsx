import { HomePageJsonLd } from "./components/seo/json-ld";
import { BeforeAfter } from "./components/landing/before-after";
import { FeaturesSection } from "./components/landing/features-section";
import { LessRewritingSection } from "./components/landing/less-rewriting-section";
import { Hero } from "./components/landing/hero";
import { HowItWorks } from "./components/landing/how-it-works";
import { Navbar } from "./components/landing/navbar";
import { FinalCta } from "./components/landing/final-cta";
import { PricingSection } from "./components/landing/pricing-section";
import { SiteFooter } from "./components/site-footer";

function SectionShell({
  id,
  eyebrow,
  title,
  body,
}: {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <section
      id={id}
      className="h-screen scroll-mt-24 bg-surface-container-low/30"
    >
      <div className="mx-auto flex h-full max-w-container-max flex-col justify-center border-t border-outline-variant/50 px-margin-mobile py-8 md:px-margin-desktop md:py-10">
        <p className="text-label-sm uppercase tracking-widest text-secondary">
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-2xl text-headline-lg text-on-surface">{title}</h2>
        <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
          {body}
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <HomePageJsonLd />
      <Navbar />
      <Hero />
      {/* <AppsMarquee /> */}
      <HowItWorks />
      <FeaturesSection />
      {/* <LessRewritingSection /> */}
      <BeforeAfter />
      <PricingSection />
     {/* <FinalCta /> */}
      <SiteFooter />
    </div>
  );
}
