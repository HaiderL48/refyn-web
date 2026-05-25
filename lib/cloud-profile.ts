import type { User } from "firebase/auth";
import { getFreshIdToken } from "./fresh-id-token";

export type CloudProfile = {
  id: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  plan?: string;
  usageMode?: string;
  dailyUsageCount?: number;
  monthlyUsageCount?: number;
  allTimeUsageCount?: number;
  dailyLimit?: number;
  isPro?: boolean;
  provider?: string;
  emailVerified?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
};

const CLOUD_DAILY_LIMIT = 20;

export function getApiRefynBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_REFYN_URL?.trim();
  if (!raw) {
    throw new Error("NEXT_PUBLIC_API_REFYN_URL is not configured");
  }
  return raw.replace(/\/$/, "");
}

function isExpiredTokenResponse(
  res: Response,
  body: { firebaseCode?: string; error?: string },
): boolean {
  if (res.status !== 401) return false;
  if (body.firebaseCode === "auth/id-token-expired") return true;
  return (
    body.error === "invalid_token" &&
    Boolean(body.firebaseCode?.includes("expired"))
  );
}

/** Loads the signed-in user's cloud profile from api_refyn (Firestore-backed). */
export async function fetchCloudProfile(user: User): Promise<CloudProfile> {
  const base = getApiRefynBase();
  let token = await getFreshIdToken(user);
  let res = await fetch(`${base}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    let body: { firebaseCode?: string; error?: string } = {};
    try {
      body = (await res.clone().json()) as typeof body;
    } catch {
      /* ignore */
    }
    if (isExpiredTokenResponse(res, body)) {
      token = await getFreshIdToken(user);
      res = await fetch(`${base}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `profile_fetch_failed:${res.status}`);
  }

  const data = (await res.json()) as { profile?: CloudProfile };
  if (!data.profile) {
    throw new Error("profile_missing");
  }
  return data.profile;
}

export function isByokProfile(profile: CloudProfile | null): boolean {
  return profile?.usageMode === "byok";
}

export function profileDailyLimit(profile: CloudProfile | null): number {
  const n = Number(profile?.dailyLimit);
  return Number.isFinite(n) && n > 0 ? n : CLOUD_DAILY_LIMIT;
}

export function firstNameFromProfile(
  profile: CloudProfile | null,
  user: Pick<User, "displayName" | "email">,
): string {
  const dn = profile?.displayName?.trim() || user.displayName?.trim();
  if (dn) {
    const first = dn.split(/\s+/)[0];
    if (first) return first;
  }
  const email = profile?.email?.trim() || user.email?.trim();
  if (email) {
    const local = email.split("@")[0];
    if (local) return local;
  }
  return "there";
}
