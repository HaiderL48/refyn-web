import type { User } from "firebase/auth";

/** Always mint a new ID token before sending to api_refyn (avoids auth/id-token-expired). */
export function getFreshIdToken(user: User): Promise<string> {
  return user.getIdToken(true);
}
