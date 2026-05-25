"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OsLogo, type OsName } from "./os-logo";

const OS_LABELS: readonly OsName[] = ["Windows", "macOS", "Linux"];
/** Duplicate first row so we can animate L → W then snap reel to 0 */
const ROWS = [...OS_LABELS, OS_LABELS[0]] as const;

const ROW_H = "1.5rem"; /* Tailwind h-6 — fits larger OS icons */
const ROTATE_MS = 2600;

export function DownloadForOsButton() {
  const [rowIndex, setRowIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const rowIndexRef = useRef(rowIndex);
  rowIndexRef.current = rowIndex;

  const resetReel = useCallback(() => {
    setTransitionEnabled(false);
    setRowIndex(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setRowIndex((r) => {
        if (r >= OS_LABELS.length) return r;
        return r + 1;
      });
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const onTrackTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "transform") return;
    if (rowIndexRef.current === OS_LABELS.length) {
      resetReel();
    }
  };

  const currentOs = OS_LABELS[rowIndex % OS_LABELS.length];

  return (
    <button
      type="button"
      aria-label={`Download for ${currentOs}`}
      className="flex w-full max-w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3.5 text-label-md font-bold text-black transition-all duration-300 hover:bg-secondary-container sm:w-auto sm:px-8 sm:py-3.5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px] shrink-0"
        aria-hidden
      >
        <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      <span className="inline-flex flex-wrap items-center justify-center gap-x-1">
        <span>Download for</span>
        <span
          className="inline-grid h-6 w-max overflow-hidden leading-none [grid-template-rows:1.5rem]"
          aria-live="polite"
        >
          <span
            aria-hidden
            className="invisible col-start-1 row-start-1 flex h-6 items-center gap-2 whitespace-nowrap"
          >
            Windows
            <OsLogo os="Windows" />
          </span>
          <div
            className={`col-start-1 row-start-1 flex min-h-0 flex-col ${
              transitionEnabled
                ? "duration-500 ease-out transition-transform"
                : ""
            }`}
            style={{
              /* Strip moves up: next row slides in from below (classic slot / scroll reel) */
              transform: `translateY(calc(-1 * ${rowIndex} * ${ROW_H}))`,
            }}
            onTransitionEnd={onTrackTransitionEnd}
          >
            {ROWS.map((label, i) => (
              <span
                key={`${label}-${i}`}
                className={`flex h-6 shrink-0 items-center whitespace-nowrap ${
                  label !== "macOS" ? "gap-2" : ""
                }`}
              >
                {label}
                {label !== "macOS" ? <OsLogo os={label} /> : null}
              </span>
            ))}
          </div>
        </span>
      </span>
    </button>
  );
}
