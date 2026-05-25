import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { getFirebaseDb } from "./firebase";
import { USERS_COLLECTION } from "./firestore-collections";
import { getUserDisplayInitial } from "./user-initial";

function mapProviderString(providerId: string | null): string {
  if (!providerId) return "unknown";
  if (providerId === "google.com") return "google";
  if (providerId === "github.com") return "github";
  return providerId.replace(/\.com$/, "") || "unknown";
}

/**
 * Upserts the signed-in user document in the Firestore **collection** `users`
 * at path `users/{uid}`. Works for **new** users (creates doc + `createdAt`)
 * and **returning** users (`merge: true`, updates profile + login timestamps).
 */
export async function saveUserProfileToFirestore(user: User): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, USERS_COLLECTION, user.uid);
  const snap = await getDoc(ref);

  const providerIds = user.providerData?.map((p) => p.providerId) ?? [];
  const primaryProvider = user.providerData?.[0]?.providerId ?? null;
  const displayInitial = getUserDisplayInitial(user);

  const payload: Record<string, unknown> = {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    displayInitial,
    photoURL: null,
    emailVerified: user.emailVerified,
    providerIds,
    primaryProvider,
    provider: mapProviderString(primaryProvider),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  // Keep architecture fields aligned but never clobber existing counters/plan.
  if (!snap.exists()) {
    payload.createdAt = serverTimestamp();
    payload.plan = "free";
    payload.dailyUsageCount = 0;
    payload.monthlyUsageCount = 0;
    payload.allTimeUsageCount = 0;
    payload.dailyLimit = 30;
    payload.hasApiKey = false;
    payload.isPro = false;
  } else {
    const prev = snap.data() as Record<string, unknown>;
    if (prev.plan == null) payload.plan = "free";
    if (prev.dailyLimit == null) payload.dailyLimit = 30;
    if (prev.hasApiKey == null) payload.hasApiKey = false;
    if (prev.isPro == null) payload.isPro = false;
  }

  await setDoc(
    ref,
    payload,
    { merge: true },
  );
}
