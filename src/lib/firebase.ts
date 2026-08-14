import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { firebaseConfigured } from "./cloud-status";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined") return null;
  if (!firebaseConfigured()) return null;
  if (!app) {
    app = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });
    auth = getAuth(app);
    void setPersistence(auth, browserLocalPersistence);
  }
  return auth;
}

export async function signInGoogle(): Promise<User> {
  const a = getFirebaseAuth();
  if (!a) throw new Error("Firebase is not configured.");
  const cred = await signInWithPopup(a, new GoogleAuthProvider());
  return cred.user;
}

export async function signInEmail(email: string, password: string): Promise<User> {
  const a = getFirebaseAuth();
  if (!a) throw new Error("Firebase is not configured.");
  try {
    const cred = await signInWithEmailAndPassword(a, email, password);
    return cred.user;
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
      const cred = await createUserWithEmailAndPassword(a, email, password);
      return cred.user;
    }
    throw err;
  }
}

export async function signOutFirebase() {
  const a = getFirebaseAuth();
  if (a) await signOut(a);
}

export async function firebaseIdToken(): Promise<string | null> {
  const a = getFirebaseAuth();
  if (!a?.currentUser) return null;
  return a.currentUser.getIdToken();
}
