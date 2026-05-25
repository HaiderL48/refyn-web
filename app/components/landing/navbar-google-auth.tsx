"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import {
  formatProfileSyncHint,
  syncUserProfileAfterSignIn,
} from "@/lib/sync-user-after-sign-in";
import { getUserDisplayInitial } from "@/lib/user-initial";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const btnBase =
  "inline-flex items-center justify-center rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50";

/** Given name only: first word of `displayName`, else a short handle from email. */
function displayFirstName(user: User): string {
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
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [profileHint, setProfileHint] = useState<string | null>(null);
  const accountMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setProfileHint(null);
      if (next) {
        void (async () => {
          const outcome = await syncUserProfileAfterSignIn(next);
          const hint = formatProfileSyncHint(outcome);
          if (hint) setProfileHint(hint);
        })();
      }
    });
  }, []);

  async function signIn() {
    setBusy(true);
    setProfileHint(null);
    try {
      const auth = getFirebaseAuth();
      await signInWithPopup(auth, googleProvider);
      // `onAuthStateChanged` runs `syncUserProfileAfterSignIn` and sets `profileHint` if needed.
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  async function signOutUser() {
    setBusy(true);
    try {
      await signOut(getFirebaseAuth());
    } finally {
      setBusy(false);
      setProfileHint(null);
      accountMenuRef.current?.removeAttribute("open");
    }
  }

  if (user) {
    const firstName = displayFirstName(user);
    const initial = getUserDisplayInitial(user);
    return (
      <div className="flex flex-col items-end gap-1">
        <details
          ref={accountMenuRef}
          className="relative"
        >
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
              onClick={() => void signOutUser()}
              disabled={busy}
              className="w-full px-3 py-2 text-left text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-on-surface disabled:opacity-50"
            >
              {busy ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </details>
        {profileHint ? (
          <p
            role="status"
            className="max-w-[min(100vw-2rem,340px)] rounded border border-amber-500/35 bg-amber-950/50 px-2 py-1.5 text-left text-[10px] leading-snug text-amber-100/95"
          >
            {profileHint}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void signIn()}
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
      {profileHint ? (
        <p
          role="status"
          className="max-w-[min(100vw-2rem,340px)] rounded border border-amber-500/35 bg-amber-950/50 px-2 py-1.5 text-left text-[10px] leading-snug text-amber-100/95"
        >
          {profileHint}
        </p>
      ) : null}
    </div>
  );
}
