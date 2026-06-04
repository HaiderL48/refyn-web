import type { CloudProfile } from "./cloud-profile";
import { syncApiSessionWithToken } from "./sync-api-session";

export type SyncUserOutcome = {
  apiSynced: boolean;
  apiDetail: string | null;
};

function detail(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

/** Sync profile to api_refyn after Google sign-in (no client Firestore writes). */
export async function syncUserProfileAfterSignIn(
  idToken: string,
): Promise<SyncUserOutcome> {
  let apiSynced = false;
  let apiDetail: string | null = null;

  try {
    await syncApiSessionWithToken(idToken);
    apiSynced = true;
  } catch (e) {
    apiDetail = detail(e);
  }

  return { apiSynced, apiDetail };
}

export function formatProfileSyncHint(o: SyncUserOutcome): string | null {
  if (!o.apiSynced && o.apiDetail) {
    return `API sync failed (${o.apiDetail}). Check NEXT_PUBLIC_API_REFYN_URL and api_refyn Google OAuth env.`;
  }
  if (!o.apiSynced) {
    return "Could not sync your profile. Set NEXT_PUBLIC_API_REFYN_URL and run api_refyn.";
  }
  return null;
}

export function profileFromSession(profile: CloudProfile | null | undefined) {
  return profile ?? null;
}
