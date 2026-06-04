import { apiRefynUrl } from "./api-refyn-client";
import { getFreshIdToken } from "./fresh-id-token";

type SessionErrorBody = {
  error?: string;
  firebaseCode?: string;
};

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0";

async function postSession(idToken: string): Promise<Response> {
  return fetch(apiRefynUrl("/api/auth/session"), {
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

/** Upserts the user profile on api_refyn using a Firebase ID token. */
export async function syncApiSessionWithToken(idToken: string): Promise<void> {
  if (!process.env.NEXT_PUBLIC_API_REFYN_URL?.trim()) return;

  let token = idToken.trim();
  if (!token) throw new Error("id_token_required");

  let res = await postSession(token);

  if (!res.ok) {
    let body: SessionErrorBody = {};
    try {
      body = (await res.clone().json()) as SessionErrorBody;
    } catch {
      /* ignore */
    }
    if (isExpiredTokenResponse(res, body)) {
      token = await getFreshIdToken();
      res = await postSession(token);
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `session_sync_failed:${res.status}`);
  }
}
