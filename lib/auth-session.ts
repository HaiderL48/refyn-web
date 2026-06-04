import { apiRefynUrl } from "./api-refyn-client";
import type { CloudProfile } from "./cloud-profile";
import { getApiRefynBase } from "./cloud-profile";

const STORAGE_KEY = "refyn.auth.session";

export type AuthSession = {
  uid: string;
  idToken: string;
  refreshToken: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  profile?: CloudProfile | null;
};

export type AuthUser = Pick<AuthSession, "uid" | "email" | "displayName" | "photoURL">;

const AUTH_CHANGED = "refyn:auth-changed";

function dispatchAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGED));
  }
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.idToken || !parsed?.uid) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  dispatchAuthChanged();
}

export function clearAuthSession(): void {
  localStorage.removeItem(STORAGE_KEY);
  dispatchAuthChanged();
}

export function sessionToAuthUser(session: AuthSession | null): AuthUser | null {
  if (!session) return null;
  return {
    uid: session.uid,
    email: session.email ?? session.profile?.email ?? null,
    displayName: session.displayName ?? session.profile?.displayName ?? null,
    photoURL: session.photoURL ?? session.profile?.photoURL ?? null,
  };
}

export function subscribeAuthSession(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onChange = () => listener();
  window.addEventListener(AUTH_CHANGED, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AUTH_CHANGED, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function decodeJwtExp(idToken: string): number | null {
  try {
    const part = idToken.split(".")[1];
    if (!part) return null;
    const json = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/"))) as {
      exp?: number;
    };
    return typeof json.exp === "number" ? json.exp : null;
  } catch {
    return null;
  }
}

async function refreshIdToken(refreshToken: string): Promise<{
  idToken: string;
  refreshToken: string;
}> {
  const res = await fetch(apiRefynUrl("/api/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `token_refresh_failed:${res.status}`);
  }
  return (await res.json()) as { idToken: string; refreshToken: string };
}

/** Returns a valid Firebase ID token from the stored session (refreshes via api_refyn when needed). */
export async function getValidIdToken(): Promise<string | null> {
  const session = getAuthSession();
  if (!session?.idToken) return null;

  const exp = decodeJwtExp(session.idToken);
  const nowSec = Math.floor(Date.now() / 1000);
  if (exp && exp > nowSec + 60) {
    return session.idToken;
  }

  if (!session.refreshToken) {
    clearAuthSession();
    return null;
  }

  try {
    const tokens = await refreshIdToken(session.refreshToken);
    setAuthSession({
      ...session,
      idToken: tokens.idToken,
      refreshToken: tokens.refreshToken || session.refreshToken,
    });
    return tokens.idToken;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function googleSignInUrl(opts?: { returnTo?: string; deviceCode?: string }): string {
  const base = getApiRefynBase();
  const returnTo =
    opts?.returnTo ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "http://localhost:3000/auth/callback");
  const params = new URLSearchParams({ return_to: returnTo });
  if (opts?.deviceCode) params.set("device_code", opts.deviceCode);
  return `${base}/api/auth/google/start?${params.toString()}`;
}

export async function exchangeAuthCode(code: string): Promise<{
  uid: string;
  idToken: string;
  refreshToken: string;
  profile: CloudProfile;
}> {
  const res = await fetch(apiRefynUrl("/api/auth/exchange"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `auth_exchange_failed:${res.status}`);
  }
  const data = (await res.json()) as {
    uid: string;
    idToken: string;
    refreshToken?: string;
    profile: CloudProfile;
  };
  if (!data.idToken || !data.uid || !data.profile) {
    throw new Error("auth_exchange_incomplete");
  }
  return {
    uid: data.uid,
    idToken: data.idToken,
    refreshToken: data.refreshToken || "",
    profile: data.profile,
  };
}
