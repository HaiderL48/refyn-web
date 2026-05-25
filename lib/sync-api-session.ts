import type { User } from "firebase/auth";
import { getFreshIdToken } from "./fresh-id-token";

type SessionErrorBody = {
  error?: string;
  firebaseCode?: string;
};

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0";

async function postSession(base: string, idToken: string): Promise<Response> {
  return fetch(`${base}/api/auth/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idToken,
      appVersion: APP_VERSION,
      usageMode: "cloud",
    }),
  });
}

function isExpiredTokenResponse(res: Response, body: SessionErrorBody): boolean {
  if (res.status !== 401) return false;
  if (body.firebaseCode === "auth/id-token-expired") return true;
  return body.error === "invalid_token" && Boolean(body.firebaseCode?.includes("expired"));
}

/** If `NEXT_PUBLIC_API_REFYN_URL` is set, upserts the user profile on the Express API. */
export async function syncApiSession(user: User): Promise<void> {
  const raw = process.env.NEXT_PUBLIC_API_REFYN_URL;
  if (!raw) return;
  const base = raw.replace(/\/$/, "");

  let idToken = await getFreshIdToken(user);
  let res = await postSession(base, idToken);

  if (!res.ok) {
    let body: SessionErrorBody = {};
    try {
      body = (await res.clone().json()) as SessionErrorBody;
    } catch {
      /* ignore */
    }
    if (isExpiredTokenResponse(res, body)) {
      idToken = await getFreshIdToken(user);
      res = await postSession(base, idToken);
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `session_sync_failed:${res.status}`);
  }
}
