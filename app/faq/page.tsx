import type { Metadata } from "next";
import { FaqContent } from "@/app/components/landing/faq-content";
import { Navbar } from "@/app/components/landing/navbar";
import { SiteFooter } from "@/app/components/site-footer";

export const metadata: Metadata = {
  title: "FAQ — PromptRefine",
  description:
    "Answers about privacy, clipboard access, supported apps, macOS permissions, and AI models.",
};

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
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
