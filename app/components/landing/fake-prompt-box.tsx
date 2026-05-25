"use client";

import { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { MaterialIcon } from "@/app/components/material-icon";

const PROMPT_TEXT = "Create a task app";
const REFINED_TEXT =
  "Create a task management app with features to add, edit, delete, and mark tasks as complete. Include task categorization, due dates, and a simple, user-friendly interface.";

const TYPE_INTERVAL_MS = 70;
const HOLD_BEFORE_SELECT_MS = 500;
const SELECTION_SWEEP_MS = 400;
const HOLD_AFTER_SELECT_MS = 900;
const RESTART_DELAY_MS = 400;

const REFINING_HOLD_SELECTED_MS = 1000;
const REFINING_HOLD_REFINED_MS = 3500;
const REFINING_FADE_MS = 300;

type Phase = "typing" | "holding" | "selecting" | "selected" | "clearing";

type Size = "sm" | "md";

const SIZE_CONFIG = {
  sm: {
    container: "p-3 text-[11px] leading-[18px]",
    chipText: "text-[10px]",
    iconSize: 10,
    sendButton: "h-5 w-5",
    sendIcon: "h-2.5 w-2.5",
    caretHeight: "h-[10px]",
  },
  md: {
    container: "p-4 text-sm leading-6",
    chipText: "text-sm",
    iconSize: 14,
    sendButton: "h-7 w-7",
    sendIcon: "h-3.5 w-3.5",
    caretHeight: "h-[14px]",
  },
} as const;

function ToolbarChip({
  icon,
  children,
  bordered = false,
  textClass,
  iconSize,
}: {
  icon?: string;
  children: React.ReactNode;
  bordered?: boolean;
  textClass: string;
  iconSize: number;
}) {
  const base = `inline-flex items-center gap-1 px-1.5 py-0.5 text-on-surface-variant ${textClass}`;
  const borderClass = bordered
    ? "rounded-full border border-outline-variant/40 bg-white/[0.03]"
    : "";
  return (
    <span className={`${base} ${borderClass}`}>
      {icon ? <MaterialIcon name={icon} size={iconSize} /> : null}
      <span>{children}</span>
      <MaterialIcon
        name="expand_more"
        size={iconSize}
        className="opacity-70"
      />
    </span>
  );
}

type FakePromptBoxProps = {
  /**
   * - `typing` — type `Create a task app`, sweep selection, loop
   * - `selected` — static snapshot of selected `Create a task app`
   * - `refining` — show selected prompt, then stream the refined prompt in place, loop
   * - `static` — show the provided `text` as plain content, no animation or selection
   */
  variant?: "typing" | "selected" | "refining" | "static";
  /** Custom text. Required for `static`, ignored for other variants. */
  text?: string;
  /**
   * Visual scale. Controls body text size, toolbar chip text, icon sizes, and
   * the send button together so the proportions stay correct.
   * - `sm` (default) — 11px body, 10px chip/icons, 20px send button
   * - `md` — 14px body, 14px chip/icons, 28px send button
   */
  size?: Size;
  /** Extra classes appended to the outer container. */
  className?: string;
};

export function FakePromptBox({
  variant = "typing",
  text,
  size = "sm",
  className = "",
}: FakePromptBoxProps = {}) {
  const sizeCfg = SIZE_CONFIG[size];

  const [typed, setTyped] = useState<string>(() => {
    if (variant === "static") return text ?? "";
    if (variant === "selected" || variant === "refining") return PROMPT_TEXT;
    return "";
  });

  const [phase, setPhase] = useState<Phase>(() => {
    if (variant === "selected" || variant === "refining") return "selected";
    return "typing";
  });

  useEffect(() => {
    if (variant !== "static") return;
    setTyped(text ?? "");
  }, [variant, text]);

  const [fading, setFading] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Variant: typing — type → hold → select → hold → clear → loop
  useEffect(() => {
    if (variant !== "typing") return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setTyped(PROMPT_TEXT);
      setPhase("selected");
      return;
    }

    let cancelled = false;

    const schedule = (fn: () => void, ms: number) => {
      timerRef.current = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    const startTyping = () => {
      setPhase("typing");
      setTyped("");

      const typeNext = (n: number) => {
        if (cancelled) return;
        setTyped(PROMPT_TEXT.slice(0, n));
        if (n < PROMPT_TEXT.length) {
          schedule(() => typeNext(n + 1), TYPE_INTERVAL_MS);
        } else {
          setPhase("holding");
          schedule(startSelecting, HOLD_BEFORE_SELECT_MS);
        }
      };

      typeNext(1);
    };

    const startSelecting = () => {
      setPhase("selecting");
      schedule(() => {
        setPhase("selected");
        schedule(startClearing, HOLD_AFTER_SELECT_MS);
      }, SELECTION_SWEEP_MS);
    };

    const startClearing = () => {
      setPhase("clearing");
      schedule(startTyping, RESTART_DELAY_MS);
    };

    startTyping();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [variant]);

  // Variant: refining — toggle between selected prompt and refined prompt with fade transition
  useEffect(() => {
    if (variant !== "refining") return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setTyped(REFINED_TEXT);
      setPhase("holding");
      return;
    }

    let cancelled = false;
    let showingRefined = false;

    const schedule = (fn: () => void, ms: number) => {
      timerRef.current = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    const swap = () => {
      setFading(true);
      schedule(() => {
        if (showingRefined) {
          setPhase("selected");
          setTyped(PROMPT_TEXT);
        } else {
          setPhase("holding");
          setTyped(REFINED_TEXT);
        }
        showingRefined = !showingRefined;
        setFading(false);
        schedule(
          swap,
          showingRefined
            ? REFINING_HOLD_REFINED_MS
            : REFINING_HOLD_SELECTED_MS,
        );
      }, REFINING_FADE_MS);
    };

    schedule(swap, REFINING_HOLD_SELECTED_MS);

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [variant]);

  const isSelected =
    variant === "selected" || phase === "selecting" || phase === "selected";
  const showCaret =
    variant === "typing" && (phase === "typing" || phase === "holding");

  return (
    <div
      className={`origin-bottom flex w-full flex-col rounded-xl border border-outline-variant/30 bg-surface-container/90 text-on-surface shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl ${sizeCfg.container} ${className}`}
    >
      <div
        className={`min-h-[44px] flex-1 px-0.5 ${
          variant === "refining"
            ? `transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`
            : ""
        }`}
      >
        <span
          className={`selection-sweep ${isSelected ? "is-selected" : ""} ${
            variant === "typing" ? "is-animated" : ""
          }`}
        >
          {typed}
        </span>
        {showCaret ? (
          <span
            aria-hidden
            className={`caret-blink ml-0.5 inline-block w-[1px] translate-y-[1px] bg-on-surface align-middle ${sizeCfg.caretHeight}`}
          />
        ) : null}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <ToolbarChip
          icon="all_inclusive"
          bordered
          textClass={sizeCfg.chipText}
          iconSize={sizeCfg.iconSize}
        >
          Agent
        </ToolbarChip>
        <span
          aria-hidden
          className={`flex items-center justify-center rounded-full bg-on-surface text-surface ring-1 ring-white/10 ${sizeCfg.sendButton}`}
        >
          <FaArrowUp className={sizeCfg.sendIcon} />
        </span>
      </div>
    </div>
  );
}
