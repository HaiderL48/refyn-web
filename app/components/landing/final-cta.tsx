import { FinalCtaDownloadButton } from "./final-cta-download-button";

export function FinalCta() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="scroll-mt-24 bg-surface-container-low/30"
    >
      <div className="mx-auto flex max-w-container-max flex-col items-center justify-center border-t border-outline-variant/50 px-margin-mobile py-8 text-center md:px-margin-desktop md:py-10">
        <h2
          id="final-cta-heading"
          className="mx-auto max-w-3xl text-balance font-sans text-2xl font-semibold tracking-tight text-on-surface sm:text-3xl md:text-4xl"
        >
          Start improving prompts instantly.
        </h2>
        <FinalCtaDownloadButton className="mt-8 sm:mt-10" />
      </div>
    </section>
  );
}
