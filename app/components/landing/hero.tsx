import { FinalCtaDownloadButton } from "./final-cta-download-button";
import { HeroMockup } from "./hero-mockup";

export function Hero() {
  return (
    <main className="hero-bottom-glow relative flex h-screen flex-col justify-center overflow-x-hidden bg-[#0a0a0c] pt-[max(4rem,calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem))] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="relative z-10 w-full px-4 py-8 sm:px-margin-mobile sm:py-10 md:px-margin-desktop md:py-12">
        <div className="mx-auto flex w-full min-w-0 max-w-container-max flex-col items-center gap-8 sm:gap-10 lg:gap-12">
          <div className="flex w-full min-w-0 max-w-2xl flex-col items-center gap-4 text-center sm:gap-5 lg:max-w-3xl">
            <h1 className="m-0 text-balance px-1 font-sans text-3xl font-semibold tracking-tight text-white min-[400px]:text-4xl md:text-5xl lg:text-6xl">
              <span className="block text-primary">Instant precision,</span>
              <span className="block text-white">Anywhere you type.</span>
            </h1>
            <p className="m-0 max-w-xl text-pretty px-1 text-sm leading-relaxed text-on-surface-variant sm:text-base md:text-lg">
              Sharper prompts in every app. One shortcut.
            </p>
            <div
              id="download"
              className="flex w-full scroll-mt-24 flex-col items-center gap-3 pt-1 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4"
            >
              <FinalCtaDownloadButton />
            </div>
          </div>

          <div className="flex w-full min-w-0 justify-center px-0 sm:px-1 md:px-2">
            <div className="w-full min-w-0 max-w-2xl lg:max-w-3xl">
              <HeroMockup />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
