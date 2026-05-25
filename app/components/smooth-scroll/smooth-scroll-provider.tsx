"use client";

import type { ReactNode } from "react";
import { useMemo, useSyncExternalStore } from "react";
import { ReactLenis } from "lenis/react";
import { HashScrollHandler, LENIS_ANCHOR_OFFSET } from "./hash-scroll-handler";
import "lenis/dist/lenis.css";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const options = useMemo(
    () => ({
      autoRaf: true,
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      anchors: {
        offset: LENIS_ANCHOR_OFFSET,
      },
      prevent: (node: HTMLElement) =>
        node.closest("[data-lenis-prevent]") !== null,
    }),
    [],
  );

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={options}>
      <HashScrollHandler />
      {children}
    </ReactLenis>
  );
}
