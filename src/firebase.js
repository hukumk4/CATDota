import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Defensive init: never throw at import time (so the app can show a readable
// message instead of a blank screen if configuration is missing).
export let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  // Optional (recommended): anonymous sign-in so DB rules can require auth.
  // Harmless if Anonymous auth is not enabled — the app still works with open rules.
  signInAnonymously(getAuth(app)).catch(() => {});
} catch (e) {
  console.error("Firebase init failed:", e);
}
