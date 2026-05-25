import type { User } from "firebase/auth";
import { saveUserProfileToFirestore } from "./save-user-to-firestore";
import { syncApiSession } from "./sync-api-session";

export type SyncUserOutcome = {
  firestoreSaved: boolean;
  apiSynced: boolean;
  firestoreDetail: string | null;
  apiDetail: string | null;
};

function detail(e: unknown): string {
  if (typeof e === "object" && e !== null && "code" in e && "message" in e) {
    const o = e as { code?: string; message?: string };
    return [o.code, o.message].filter(Boolean).join(": ");
  }
  if (e instanceof Error) return e.message;
  return String(e);
}

/**
 * 1) Tries api_refyn first (Admin SDK writes `users/{uid}` — works even when browser rules deny).
 * 2) Then tries client Firestore merge (needs published rules in `firestore.rules`).
 */
export async function syncUserProfileAfterSignIn(user: User): Promise<SyncUserOutcome> {
  let firestoreSaved = false;
  let apiSynced = false;
  let firestoreDetail: string | null = null;
  let apiDetail: string | null = null;

  try {
    await syncApiSession(user);
    apiSynced = true;
  } catch (e) {
    apiDetail = detail(e);
  }

  try {
    await saveUserProfileToFirestore(user);
    firestoreSaved = true;
  } catch (e) {
    firestoreDetail = detail(e);
  }

  return { firestoreSaved, apiSynced, firestoreDetail, apiDetail };
}

export function formatProfileSyncHint(o: SyncUserOutcome): string | null {
  if (o.firestoreSaved) return null;

  if (o.firestoreDetail?.includes("permission-denied")) {
    if (o.apiSynced) {
      return "Your profile was written by the API (check the users collection). Browser writes are blocked: publish Firestore rules from refyn-web/firestore.rules, then refresh.";
    }
    return "Firestore blocked this app (permission denied). Open Firebase Console → Firestore → Rules, paste rules from refyn-web/firestore.rules, Publish, then sign in again.";
  }

  if (!o.apiSynced && o.apiDetail) {
    return `API sync failed (${o.apiDetail}). Fix NEXT_PUBLIC_API_REFYN_URL / api_refyn env, or fix Firestore rules for direct saves.`;
  }

  if (o.firestoreDetail) {
    return `Could not save profile: ${o.firestoreDetail}`;
  }

  if (!o.apiSynced) {
    return "No write reached Firestore. Set NEXT_PUBLIC_API_REFYN_URL and run api_refyn, and publish Firestore rules (refyn-web/firestore.rules).";
  }

  return null;
}
