import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

function readWebConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    throw new Error(
      "Missing Firebase web env vars. Set NEXT_PUBLIC_FIREBASE_* (see firebase-web.example.env).",
    );
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    ...(measurementId ? { measurementId } : {}),
  };
}

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApp();
    return app;
  }
  app = initializeApp(readWebConfig());
  return app;
}

/** Call only from client components. */
export function getFirebaseDb(): Firestore {
  if (db) return db;
  db = getFirestore(getFirebaseApp());
  return db;
}

/** Call only from client components (or after mount). */
export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}
