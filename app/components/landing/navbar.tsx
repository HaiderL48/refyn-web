"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useSyncExternalStore } from "react";
import { NavbarGoogleAuth } from "./navbar-google-auth";

const navLinks = [
  { href: "/", label: "Home", id: "home" as const },
  { href: "/#pricing", label: "Pricing", id: "pricing" as const },
  { href: "/faq", label: "FAQ", id: "faq" as const },
] as const;

function linkIsActive(
  pathname: string,
  hash: string,
  item: (typeof navLinks)[number],
) {
  if (item.id === "home") {
    return pathname === "/" && (hash === "" || hash === "#");
  }
  if (item.id === "pricing") {
    return pathname === "/" && hash === "#pricing";
  }
  if (item.id === "faq") {
    return pathname === "/faq";
  }
  return false;
}

function subscribeHash(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("hashchange", onStoreChange);
  window.addEventListener("popstate", onStoreChange);
  return () => {
    window.removeEventListener("hashchange", onStoreChange);
    window.removeEventListener("popstate", onStoreChange);
  };
}

function getHashSnapshot() {
  return typeof window === "undefined" ? "" : window.location.hash;
}

function getServerHashSnapshot() {
  return "";
}

export function Navbar() {
  const pathname = usePathname();
  const hash = useSyncExternalStore(
    subscribeHash,
    getHashSnapshot,
    getServerHashSnapshot,
  );

  const isActive = useCallback(
    (item: (typeof navLinks)[number]) => linkIsActive(pathname, hash, item),
    [pathname, hash],
  );

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/50 bg-surface/70 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 min-h-14 max-w-container-max items-center justify-between gap-2 px-4 sm:px-margin-mobile md:px-margin-desktop">
        <Link
          href="/"
          className="flex min-w-0 max-w-[min(100%,11rem)] shrink items-center gap-1.5 sm:max-w-none"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-outline-variant/30 bg-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">
              bolt
            </span>
          </div>
          <span className="truncate text-xs font-bold tracking-tight text-on-surface sm:text-sm md:text-base">
            PromptRefine
          </span>
        </Link>

        {/* Not shown on viewports smaller than `md` (768px) */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-5 px-2 md:flex lg:gap-6">
          {navLinks.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "text-sm font-semibold text-primary transition-colors duration-200 active:scale-95"
                    : "text-sm font-medium text-on-surface-variant transition-colors duration-200 hover:text-primary active:scale-95"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="min-w-0 shrink-0">
          <NavbarGoogleAuth />
        </div>
      </div>
    </nav>
  );
}
