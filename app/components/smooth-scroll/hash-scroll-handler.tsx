"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

/** Matches section `scroll-mt-24` (6rem) for fixed navbar clearance */
export const LENIS_ANCHOR_OFFSET = -96;

function scrollToCurrentHash(lenis: NonNullable<ReturnType<typeof useLenis>>) {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return;

  const target = document.querySelector(hash);
  if (target instanceof HTMLElement) {
    lenis.scrollTo(target, { offset: LENIS_ANCHOR_OFFSET });
  }
}

export function HashScrollHandler() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    let cancelled = false;

    const run = () => {
      if (!cancelled) scrollToCurrentHash(lenis);
    };

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
    const timeout = window.setTimeout(run, 120);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [pathname, lenis]);

  useEffect(() => {
    if (!lenis) return;

    const onHashChange = () => scrollToCurrentHash(lenis);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [lenis]);

  return null;
}
