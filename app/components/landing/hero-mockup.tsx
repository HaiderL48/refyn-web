"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

const DRAFT_TEXT =
  "write an email to the team about the new design system update. keep it short and tell them to check the figma link.";

/** Replaces the typed draft in place after selection + pause (no second panel). */
const ENHANCED_PROMPT_TEXT =
  "Email the team a short design-system update: what changed, why it matters, and a direct link to the Figma library. Call out breaking changes, keep tone professional, and end with one clear next step.";

const HEADING_DRAFT = "Drafting Thought...";
const HEADING_ENHANCED = "Refined prompt...";

/** ms per character — whole sentence types in ~3.5s for ~120 chars */
const MS_PER_CHAR = 30;

/** Must match `globals.css` `.shortcut-chip-glow` duration */
const SHORTCUT_GLOW_S = 0.95;

export function HeroMockup() {
  const root = useRef<HTMLDivElement>(null);
  const draftLineRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLSpanElement>(null);
  const lastTypedEndRef = useRef(-1);

  /** React-driven so React 19 does not wipe imperative textContent on re-render. */
  const [draftVisible, setDraftVisible] = useState("");
  const [promptSelected, setPromptSelected] = useState(false);
  const [headingLabel, setHeadingLabel] = useState(HEADING_DRAFT);
  /** CSS keyframe pulse (see `.shortcut-chip-glow`); avoids GSAP writing styles React then overwrites. */
  const [shortcutGlow, setShortcutGlow] = useState(false);

  useGSAP(
    () => {
      const line = draftLineRef.current;
      const heading = headingRef.current;
      if (!line || !heading) return;

      const typeState = { n: 0 };
      const typeDuration = (DRAFT_TEXT.length * MS_PER_CHAR) / 1000;

      const reset = () => {
        typeState.n = 0;
        lastTypedEndRef.current = -1;
        setDraftVisible("");
        setPromptSelected(false);
        setHeadingLabel(HEADING_DRAFT);
        setShortcutGlow(false);
        gsap.set(line, { opacity: 1 });
        gsap.set(heading, { opacity: 1 });
      };

      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "power2.inOut" },
      });

      tl.call(reset, [], 0);

      tl.fromTo(
        typeState,
        { n: 0 },
        {
          n: DRAFT_TEXT.length,
          duration: typeDuration,
          ease: "none",
          onUpdate: () => {
            const end = Math.min(
              DRAFT_TEXT.length,
              Math.round(typeState.n),
            );
            if (end !== lastTypedEndRef.current) {
              lastTypedEndRef.current = end;
              setDraftVisible(DRAFT_TEXT.slice(0, end));
            }
          },
        },
      );

      tl.to({}, { duration: 0.45 }, ">");

      // Ctrl+A-style: inline background hugs each wrapped line (box-decoration-break)
      tl.call(() => setPromptSelected(true));
      tl.to({}, { duration: 0.72 });
      tl.call(() => setPromptSelected(false));

      // Shortcut glow: CSS animation class (React); runs after select, before refined crossfade
      tl.call(() => setShortcutGlow(true));
      tl.to({}, { duration: SHORTCUT_GLOW_S });
      tl.call(() => setShortcutGlow(false));

      tl.to({}, { duration: 0.5 });
      tl.to([line, heading], { opacity: 0, duration: 0.22, ease: "power2.in" });
      tl.call(() => {
        setDraftVisible(ENHANCED_PROMPT_TEXT);
        setHeadingLabel(HEADING_ENHANCED);
      });
      tl.to([line, heading], { opacity: 1, duration: 0.28, ease: "power2.out" });

      tl.to({}, { duration: 2.6 }, ">");

      return () => {
        tl.kill();
      };
    },
    { scope: root, dependencies: [] },
  );

  return (
    <div ref={root} className="relative flex w-full min-w-0 flex-col lg:mt-0">
      <p className="m-0 mb-2.5 w-full text-center text-label-sm uppercase tracking-widest text-on-surface-variant/45">
        How it works
      </p>
      <div className="mockup-container relative flex h-[208px] w-full max-w-full flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/35 p-4 backdrop-blur-xl transition-[border-color] duration-500 hover:border-outline-variant/35 sm:rounded-2xl sm:p-5 md:h-[224px] md:p-6">
        <div
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          aria-hidden="true"
        >
          <div className="mb-3 shrink-0 flex items-center gap-2.5">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-outline-variant/40" />
            <span
              ref={headingRef}
              className={`text-label-sm uppercase tracking-widest will-change-[opacity] ${
                headingLabel === HEADING_ENHANCED
                  ? "text-primary"
                  : "text-on-surface-variant/55"
              }`}
            >
              {headingLabel}
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0.5 [scrollbar-gutter:stable]">
            <p className="m-0 font-mono text-[13px] leading-relaxed text-on-surface-variant/90 md:text-sm">
              <span
                ref={draftLineRef}
                className="inline will-change-[opacity]"
              >
                <span
                  className={
                    promptSelected
                      ? "rounded-[1px] bg-primary px-0.5 py-px -mx-0.5 text-on-primary"
                      : "rounded-[1px] px-0.5 py-px -mx-0.5 text-on-surface-variant"
                  }
                  style={{
                    WebkitBoxDecorationBreak: "clone",
                    boxDecorationBreak: "clone",
                  }}
                >
                  {draftVisible}
                </span>
                <span
                  className={`ml-0.5 inline-block h-[1em] w-0.5 align-baseline ${
                    promptSelected
                      ? "bg-on-primary/35"
                      : "animate-pulse bg-secondary/40"
                  }`}
                />
              </span>
            </p>
          </div>
        </div>

        <div className="mt-auto flex shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-2 border-t border-outline-variant/[0.12] pt-3">
          <div className="flex items-center gap-1.5 text-label-sm text-on-surface-variant/45">
            <span className="text-[10px]">Refyn Active</span>
          </div>
          <div
            className={`flex shrink-0 items-center gap-1 rounded-md border border-outline-variant/40 bg-surface-variant/30 px-2 py-1 text-on-surface-variant/75 shadow-none transition-none will-change-[border-color,box-shadow] ${shortcutGlow ? "shortcut-chip-glow" : ""}`}
            aria-label="Keyboard shortcut: Shift Alt C"
          >
            <kbd className="rounded px-1 py-0.5 font-mono text-[10px] font-medium tracking-wide text-on-surface-variant md:text-[11px]">
              Shift
            </kbd>
            <span className="text-[10px] text-on-surface-variant/40">+</span>
            <kbd className="rounded px-1 py-0.5 font-mono text-[10px] font-medium tracking-wide text-on-surface-variant md:text-[11px]">
              Alt
            </kbd>
            <span className="text-[10px] text-on-surface-variant/40">+</span>
            <kbd className="rounded px-1 py-0.5 font-mono text-[10px] font-medium tracking-wide text-on-surface-variant md:text-[11px]">
              C
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
