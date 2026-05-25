"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import {
  fetchCloudProfile,
  isByokProfile,
  profileDailyLimit,
  type CloudProfile,
} from "@/lib/cloud-profile";
import { getUserDisplayInitial } from "@/lib/user-initial";

/** Set to false when login is required again on /profile */
const PREVIEW_WITHOUT_LOGIN = true;

const DEMO_PROFILE: CloudProfile = {
  id: "preview",
  email: "haiderlimdi@gmail.com",
  displayName: "Haider Limdiwala",
  plan: "free",
  usageMode: "cloud",
  dailyUsageCount: 0,
  monthlyUsageCount: 0,
  dailyLimit: 10,
  isPro: false,
  provider: "google",
};

function DashboardSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-4 py-5 sm:px-5 sm:py-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
        {label}
      </p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function planDisplayName(plan: string) {
  const p = plan.trim().toLowerCase();
  if (p === "free") return "Free";
  if (p === "pro") return "Pro";
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

export function ProfileDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<CloudProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const authHydratedRef = useRef(false);

  const loadProfile = useCallback(async (firebaseUser: User) => {
    setLoading(true);
    setError("");
    try {
      const p = await fetchCloudProfile(firebaseUser);
      setProfile(p);
    } catch (e) {
      console.error(e);
      setProfile(null);
      setError(
        e instanceof Error ? e.message : "Could not load your account data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    let disposed = false;

    const applyAuthState = (next: User | null) => {
      setUser(next);
      setError("");
      if (next) {
        setProfile(null);
        void loadProfile(next);
      } else if (PREVIEW_WITHOUT_LOGIN) {
        setProfile(DEMO_PROFILE);
      } else {
        setProfile(null);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (next) => {
      // Ignore pre-hydration auth events to avoid signed-out flicker.
      if (!authHydratedRef.current) return;
      if (disposed) return;
      applyAuthState(next);
    });

    void (async () => {
      const authWithReady = auth as typeof auth & {
        authStateReady?: () => Promise<void>;
      };
      if (typeof authWithReady.authStateReady === "function") {
        try {
          await authWithReady.authStateReady();
        } catch {
          // Continue with currentUser fallback.
        }
      }
      if (disposed) return;
      authHydratedRef.current = true;
      applyAuthState(auth.currentUser);
      setAuthReady(true);
    })();

    return () => {
      disposed = true;
      unsubscribe();
    };
  }, [loadProfile]);

  if (!authReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-on-surface-variant">
        Loading…
      </div>
    );
  }

  const previewMode = PREVIEW_WITHOUT_LOGIN && !user;
  const displayProfile =
    profile ?? (previewMode ? DEMO_PROFILE : null);

  if (!displayProfile && !previewMode) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="text-xl font-semibold text-on-surface">Dashboard</h1>
        <p className="mt-3 text-sm text-on-surface-variant">
          Sign in with Google to view your account.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-md bg-secondary px-4 py-2 text-xs font-semibold text-on-secondary hover:bg-secondary-fixed"
        >
          Go to home & sign in
        </Link>
      </div>
    );
  }

  const byok = previewMode ? false : isByokProfile(displayProfile);
  const daily = Number(displayProfile?.dailyUsageCount ?? 0);
  const dailyLimit = profileDailyLimit(displayProfile);
  const hasUnlimitedDaily =
    !byok && displayProfile?.isPro === true && dailyLimit >= 1_000_000;
  const pct = hasUnlimitedDaily
    ? Math.min(100, daily > 0 ? 12 : 0)
    : Math.min(100, dailyLimit > 0 ? (daily / dailyLimit) * 100 : 0);
  const planName = planDisplayName(String(displayProfile?.plan || "free"));
  const displayName =
    displayProfile?.displayName?.trim() ||
    user?.displayName?.trim() ||
    "Account";
  const email = displayProfile?.email || user?.email || "";
  const initial = user
    ? getUserDisplayInitial(user)
    : (displayName.charAt(0).toUpperCase() || "?");

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-12 pt-8 sm:px-6 sm:pt-10">
      <h1 className="text-center text-2xl font-bold tracking-tight text-on-surface">
        Dashboard
      </h1>

      {previewMode ? (
        <p className="mx-auto mt-2 max-w-sm text-center text-[10px] text-amber-200/90">
          Design preview — sample data. Sign in for your real account.
        </p>
      ) : null}

      {error ? (
        <p className="mx-auto mt-2 max-w-sm text-center text-[10px] text-amber-300">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-1.5 text-center text-[10px] text-on-surface-variant">
          Refreshing…
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-lg border border-outline-variant/25 bg-surface-container-high/90 divide-y divide-outline-variant/50">
        {byok ? (
          <DashboardSection label="Account">
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Your account uses BYOK mode. Cloud usage is tracked in the desktop
              app with your own API key.
            </p>
            <Link
              href="/#download"
              className="mt-2 inline-block text-xs font-medium text-secondary hover:text-secondary-fixed"
            >
              Download desktop app →
            </Link>
          </DashboardSection>
        ) : (
          <>
            <DashboardSection label="Account">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-on-secondary">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-on-surface">
                    {displayName}
                  </p>
                  {email ? (
                    <p className="mt-0.5 truncate text-xs text-on-surface-variant">
                      {email}
                    </p>
                  ) : null}
                </div>
              </div>
            </DashboardSection>

            <DashboardSection label="Daily usage">
              <p className="text-2xl font-bold leading-none text-on-surface">
                {daily}
                <span className="text-lg font-semibold text-on-surface-variant">
                  {" "}
                  / {hasUnlimitedDaily ? "Unlimited" : dailyLimit}
                </span>
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                requests today
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
                <div
                  className="h-full rounded-full bg-secondary shadow-[0_0_8px_rgba(93,230,255,0.3)] transition-[width] duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-on-surface-variant/80">
                Resets daily at midnight UTC.
              </p>
            </DashboardSection>

            <DashboardSection label="Current plan">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-on-surface">{planName}</p>
                  <p className="mt-0.5 text-xs text-on-surface-variant">
                    {hasUnlimitedDaily ? "Unlimited" : dailyLimit} requests/day ·
                    Compress &amp; Enhance
                  </p>
                </div>
                <Link
                  href="/#pricing"
                  className="inline-flex shrink-0 items-center justify-center rounded-md bg-secondary px-3.5 py-1.5 text-xs font-semibold text-on-secondary transition-colors hover:bg-secondary-fixed"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </DashboardSection>

            <DashboardSection label="Desktop app">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-on-surface">
                    Refyn for Windows
                  </p>
                  <p className="mt-0.5 text-xs text-on-surface-variant">
                    Windows 10 / 11 · macOS coming soon
                  </p>
                </div>
                <Link
                  href="/#download"
                  className="inline-flex shrink-0 items-center justify-center rounded-md border border-secondary bg-transparent px-3.5 py-1.5 text-xs font-semibold text-on-surface transition-colors hover:bg-secondary/10"
                >
                  Download
                </Link>
              </div>
            </DashboardSection>
          </>
        )}
      </div>
    </div>
  );
}
