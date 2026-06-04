"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getAuthSession,
  getValidIdToken,
  googleSignInUrl,
} from "@/lib/auth-session";
import { apiRefynUrl } from "@/lib/api-refyn-client";

function desktopAppUrl() {
  return process.env.NEXT_PUBLIC_REFYN_DESKTOP_URL || "renfy://auth-complete";
}

function toFriendlyError(raw: unknown) {
  const text = String((raw as Error)?.message || raw || "");
  if (text.includes("device_code_not_found") || text.includes('"error":"device_code_not_found"')) {
    return "This sign-in session expired or the API was restarted. Go back to RefynAI desktop and click Sign in with Google again.";
  }
  if (text.includes("device_code_expired")) {
    return "This sign-in code expired. Start sign-in again from RefynAI desktop.";
  }
  try {
    const parsed = JSON.parse(text) as { error?: string; message?: string; hint?: string };
    if (parsed.error === "invalid_token") {
      const detail = [parsed.message, parsed.hint].filter(Boolean).join(" — ");
      return detail || "Sign-in failed. Try again from the desktop app.";
    }
  } catch {
    /* not JSON */
  }
  return text || "Sign-in failed. Please try again.";
}

function DesktopLoginInner() {
  const params = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openHint, setOpenHint] = useState<string | null>(null);
  const [linked, setLinked] = useState(false);
  const code = useMemo(() => (params.get("code") || "").trim(), [params]);

  async function completeDesktopLoginWithToken(idToken: string, refreshToken = "") {
    const res = await fetch(apiRefynUrl("/api/auth/device/complete"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        idToken,
        refreshToken,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `device_complete_failed:${res.status}`);
    }
    setLinked(true);
    setStatus("You're logged in. Returning to desktop app...");
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.href = desktopAppUrl();
      }, 150);
      setTimeout(() => {
        if (!document.hidden) {
          setOpenHint(
            "Could not launch desktop app automatically. Click 'Open RefynAI Desktop' below or switch to the app manually.",
          );
        }
      }, 1400);
    }
  }

  function tryOpenDesktopFromButton() {
    setOpenHint(null);
    if (typeof window !== "undefined") {
      window.location.href = desktopAppUrl();
      setTimeout(() => {
        if (!document.hidden) {
          setOpenHint(
            "Browser could not open renfy:// yet. Restart RefynAI desktop (after latest update) and try again.",
          );
        }
      }, 1200);
    }
  }

  useEffect(() => {
    if (!code) return;
    const session = getAuthSession();
    if (!session?.idToken) return;

    void (async () => {
      try {
        setBusy(true);
        setError(null);
        setStatus("Detected existing website login. Linking desktop session...");
        const idToken = (await getValidIdToken()) || session.idToken;
        await completeDesktopLoginWithToken(idToken, session.refreshToken || "");
      } catch (e) {
        setError(toFriendlyError(e));
        setStatus(null);
      } finally {
        setBusy(false);
      }
    })();
  }, [code]);

  function continueDesktopLogin() {
    if (!code) {
      setError("Missing device code. Re-open sign-in from the desktop app.");
      return;
    }
    setBusy(true);
    setError(null);
    setStatus("Redirecting to Google sign-in…");
    window.location.href = googleSignInUrl({
      returnTo: `${window.location.origin}/desktop-login?code=${encodeURIComponent(code)}`,
      deviceCode: code,
    });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-stretch justify-center gap-4 bg-surface px-6 py-8 text-on-surface">
      <h1 className="text-3xl font-bold tracking-tight text-on-surface">Sign in to RefynAI Desktop</h1>
      <p className="text-base leading-relaxed text-on-surface-variant">
        Sign-in is handled securely by our API — no secrets in this page. After Google approves, you will return to the desktop app automatically.
      </p>
      {!code ? (
        <p className="rounded border border-amber-300/60 bg-amber-100/10 px-3 py-2 text-sm text-amber-100">
          Missing device code in URL. Start sign-in again from the desktop app.
        </p>
      ) : null}
      {status ? (
        <p className="rounded border border-emerald-300/60 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-100">
          {status}
        </p>
      ) : null}
      {error ? (
        <p className="rounded border border-red-300/60 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {error}
        </p>
      ) : null}
      {!linked ? (
        <button
          type="button"
          disabled={busy || !code}
          onClick={() => continueDesktopLogin()}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-secondary px-4 text-sm font-semibold text-on-secondary shadow-[0_0_12px_rgba(93,230,255,0.15)] transition-colors hover:bg-secondary-container disabled:cursor-not-allowed disabled:bg-secondary/40 disabled:text-on-secondary/70"
        >
          {busy ? "Working..." : "Continue with Google"}
        </button>
      ) : null}
      {linked ? (
        <button
          type="button"
          onClick={tryOpenDesktopFromButton}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-secondary/50 bg-secondary/10 px-4 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/20"
        >
          Open RefynAI Desktop
        </button>
      ) : null}
      {openHint ? (
        <p className="rounded border border-blue-300/55 bg-blue-500/10 px-3 py-2 text-sm text-blue-100">
          {openHint}
        </p>
      ) : null}
    </main>
  );
}

export default function DesktopLoginPage() {
  return (
    <Suspense fallback={<main className="p-6 text-sm">Loading sign-in page...</main>}>
      <DesktopLoginInner />
    </Suspense>
  );
}
