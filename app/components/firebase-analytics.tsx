"use client";

import { useEffect } from "react";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirebaseApp } from "@/lib/firebase";

/**
 * Initializes Firebase Analytics once in the browser (no-op if unsupported).
 */
export function FirebaseAnalytics() {
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        if (!(await isSupported()) || cancelled) return;
        getAnalytics(getFirebaseApp());
      } catch {
        // Analytics is optional; ignore init failures in dev / blocked contexts.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
