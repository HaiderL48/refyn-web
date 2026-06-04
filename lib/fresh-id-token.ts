import { getValidIdToken } from "./auth-session";

/** Mint or refresh the ID token before sending to api_refyn. */
export async function getFreshIdToken(): Promise<string> {
  const token = await getValidIdToken();
  if (!token) {
    throw new Error("Not signed in");
  }
  return token;
}
