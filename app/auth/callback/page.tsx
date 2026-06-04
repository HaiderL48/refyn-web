"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  exchangeAuthCode,
  setAuthSession,
} from "@/lib/auth-session";
import { syncApiSessionWithToken } from "@/lib/sync-api-session";

function AuthCallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Completing sign-in…");

  useEffect(() => {
    const error = (params.get("error") || "").trim();
    if (error) {
      setMessage(decodeURIComponent(error));
      return;
    }

    const authCode = (params.get("auth_code") || "").trim();
    if (!authCode) {
      setMessage("Missing sign-in code. Try signing in again.");
      return;
    }

    void (async () => {
      try {
        const exchanged = await exchangeAuthCode(authCode);
        setAuthSession({
          uid: exchanged.uid,
          idToken: exchanged.idToken,
          refreshToken: exchanged.refreshToken,
          email: exchanged.profile.email,
          displayName: exchanged.profile.displayName,
          photoURL: exchanged.profile.photoURL,
          profile: exchanged.profile,
        });
        await syncApiSessionWithToken(exchanged.idToken);
        router.replace("/profile");
      } catch (e) {
        console.error(e);
        if (e instanceof Error && e.message === "Failed to fetch") {
          setMessage(
            "Could not connect to api_refyn. This is usually a CORS/origin issue or the API URL is wrong. Try opening the site at http://localhost:3000 and ensure NEXT_PUBLIC_API_REFYN_URL points to your API (for local testing use http://localhost:8787).",
          );
        } else {
          setMessage(
            e instanceof Error ? e.message : "Sign-in failed. Please try again.",
          );
        }
      }
    })();
  }, [params, router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 py-12 text-on-surface">
      <p className="text-center text-sm text-on-surface-variant">{message}</p>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="p-6 text-sm text-on-surface-variant">Loading…</main>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
