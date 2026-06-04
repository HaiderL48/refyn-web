"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  clearAuthSession,
  getAuthSession,
  googleSignInUrl,
  sessionToAuthUser,
  subscribeAuthSession,
  type AuthUser,
} from "@/lib/auth-session";
import { getUserDisplayInitial } from "@/lib/user-initial";

const btnBase =
  "inline-flex items-center justify-center rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50";

function displayFirstName(user: AuthUser): string {
  const dn = user.displayName?.trim();
  if (dn) {
    const first = dn.split(/\s+/)[0];
    if (first) return first;
  }
  const local = user.email?.split("@")[0]?.trim();
  if (local) {
    const segment = local.split(/[._-]/)[0];
    const base = (segment || local).slice(0, 24);
    return base || "Account";
  }
  return "Account";
}

export function NavbarGoogleAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [busy, setBusy] = useState(false);
  const accountMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const sync = () => setUser(sessionToAuthUser(getAuthSession()));
    sync();
    return subscribeAuthSession(sync);
  }, []);

  function signIn() {
    setBusy(true);
    window.location.href = googleSignInUrl();
  }

  function signOutUser() {
    setBusy(true);
    clearAuthSession();
    setBusy(false);
    accountMenuRef.current?.removeAttribute("open");
  }

  if (user) {
    const firstName = displayFirstName(user);
    const initial = getUserDisplayInitial(user);
    return (
      <div className="flex flex-col items-end gap-1">
        <details ref={accountMenuRef} className="relative">
          <summary
            className="flex cursor-pointer list-none items-center gap-2 rounded-lg py-0.5 pl-0.5 pr-1 outline-none transition-colors hover:bg-surface-variant/35 [&::-webkit-details-marker]:hidden"
            aria-label={`Account: ${firstName}. Open menu to sign out.`}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-variant text-[11px] font-bold text-secondary"
              aria-hidden
            >
              {initial}
            </span>
            <span className="max-w-[7.5rem] truncate text-left text-xs font-medium text-on-surface sm:max-w-[10rem] sm:text-sm">
              {firstName}
            </span>
          </summary>
          <div className="absolute right-0 top-[calc(100%+0.25rem)] z-[60] min-w-[9rem] rounded-md border border-outline-variant/30 bg-surface-container-high/95 py-1 shadow-lg backdrop-blur-md">
            <Link
              href="/profile"
              className="block w-full px-3 py-2 text-left text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-on-surface"
              onClick={() => accountMenuRef.current?.removeAttribute("open")}
            >
              Account
            </Link>
            <button
              type="button"
              onClick={() => signOutUser()}
              disabled={busy}
              className="w-full px-3 py-2 text-left text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-on-surface disabled:opacity-50"
            >
              {busy ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </details>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn()}
      disabled={busy}
      className={`${btnBase} max-w-full border border-secondary/50 bg-secondary/10 px-3 text-secondary hover:bg-secondary/20 sm:px-3.5`}
    >
      {busy ? (
        "Signing in…"
      ) : (
        <>
          <span className="sm:hidden">Sign in</span>
          <span className="hidden sm:inline">Sign in with Google</span>
        </>
      )}
    </button>
  );
}
