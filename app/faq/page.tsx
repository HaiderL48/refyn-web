import { FaqContent, faqItems } from "@/app/components/landing/faq-content";
import { Navbar } from "@/app/components/landing/navbar";
import { FaqPageJsonLd } from "@/app/components/seo/json-ld";
import { SiteFooter } from "@/app/components/site-footer";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "FAQ",
  description:
    "Answers about privacy, clipboard access, supported apps, macOS permissions, and AI models.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <FaqPageJsonLd items={faqItems} />
      <Navbar />
      <main className="flex-1 pt-14">
        <div className="mx-auto max-w-3xl px-margin-mobile py-12 md:px-margin-desktop md:py-16">
          <FaqContent />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
