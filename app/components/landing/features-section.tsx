import type { ReactNode } from "react";

function GlassCard({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-colors duration-300 hover:bg-surface-container-highest/50 ${className}`}
    >
      {children}
    </div>
  );
}

function IconBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-container-high">
      {children}
    </div>
  );
}

function BrainIcon() {
  return (
    <svg className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9.5 4a3.5 3.5 0 0 0-2.2 6.2 4 4 0 0 0 .7 7.3 3.5 3.5 0 0 0 6.8 1.2 3.5 3.5 0 0 0 3.2-1.5 4 4 0 0 0 2.5-3.6A3.5 3.5 0 0 0 14.5 4 3.5 3.5 0 0 0 12 5.2 3.5 3.5 0 0 0 9.5 4Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="M12 8v4M10 10h4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 5 6v6c0 4.4 3 7.7 7 8.9 4-1.2 7-4.5 7-8.9V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 7h14v10H5V7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="m8 11 2 2-2 2M12 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-secondary" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.25" opacity={0.35} />
      <path
        d="M5 8.25 7 10.25 11 5.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="h-screen scroll-mt-24 bg-surface-container-low/30"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto flex h-full max-w-container-max flex-col justify-center overflow-y-auto border-t border-outline-variant/50 px-margin-mobile py-8 md:px-margin-desktop md:py-10">
        <header className="mb-10 text-center md:mb-12">
          <h2
            id="features-heading"
            className="text-balance font-sans text-3xl font-bold tracking-tight text-on-surface sm:text-4xl md:text-display-lg"
          >
            Built for Better AI Workflows
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-body-md leading-relaxed text-on-surface-variant md:text-body-lg">
            Copy text, press a shortcut, get a cleaner prompt—without leaving the app
            you&apos;re already in.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          {/* Large feature */}
          <GlassCard className="flex min-h-[280px] flex-col justify-between p-6 md:col-span-8 md:min-h-[300px] md:p-7">
            <IconBox>
              <BrainIcon />
            </IconBox>
            <div className="mt-5 md:mt-auto md:pt-3">
              <h3 className="text-headline-md font-semibold text-on-surface">
                Instant Prompt Enhancement
              </h3>
              <p className="mt-3 max-w-xl text-body-md leading-relaxed text-on-surface-variant">
                Refyn instantly improves copied text, prompts, errors, and technical
                content while preserving your original intent and formatting.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-secondary/20 bg-secondary-container/10 px-3 py-1.5 text-label-sm text-secondary">
                  Copy text
                </span>
                <span className="rounded-full border border-secondary/20 bg-secondary-container/10 px-3 py-1.5 text-label-sm text-secondary">
                  Press shortcut
                </span>
                <span className="rounded-full border border-secondary/20 bg-secondary-container/10 px-3 py-1.5 text-label-sm text-secondary">
                  Better prompt
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Privacy */}
          <GlassCard className="flex flex-col p-6 md:col-span-4">
            <IconBox>
              <ShieldIcon />
            </IconBox>
            <h3 className="mt-4 text-headline-md font-semibold text-on-surface">
              Privacy First
            </h3>
            <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
              Your prompts stay private. BYOK support lets you use your own OpenAI
              key without routing requests through Refyn servers.
            </p>
            <ul className="mt-auto space-y-2.5 border-t border-outline-variant/50 pt-4">
              <li className="flex items-center gap-3 text-label-md text-on-surface">
                <CheckIcon />
                Bring your own API key
              </li>
              <li className="flex items-center gap-3 text-label-md text-on-surface">
                <CheckIcon />
                No prompt storage by default
              </li>
            </ul>
          </GlassCard>

          {/* Global shortcut */}
          <GlassCard className="p-6 md:col-span-4">
            <IconBox>
              <KeyboardIcon />
            </IconBox>
            <h3 className="mt-4 text-headline-md font-semibold text-on-surface">
              Global Shortcut
            </h3>
            <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
              Enhance prompts from anywhere using{" "}
              <code className="rounded bg-surface-container-highest px-2 py-0.5 text-secondary">
                Shift + Alt + C
              </code>{" "}
              without leaving your workflow.
            </p>
          </GlassCard>

          {/* Works everywhere */}
          <GlassCard className="p-6 md:col-span-4">
            <IconBox>
              <GlobeIcon />
            </IconBox>
            <h3 className="mt-4 text-headline-md font-semibold text-on-surface">
              Works Everywhere
            </h3>
            <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
              Works with ChatGPT, Cursor, Claude, Gemini, and other AI tools across
              your desktop workflow.
            </p>
          </GlassCard>

          {/* Technical handling */}
          <GlassCard className="p-6 md:col-span-4">
            <IconBox>
              <TerminalIcon />
            </IconBox>
            <h3 className="mt-4 text-headline-md font-semibold text-on-surface">
              Smart Technical Handling
            </h3>
            <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
              Preserves code blocks, stack traces, logs, and formatting while
              improving clarity and AI readability.
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
