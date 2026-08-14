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
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfigured } from "./cloud-status";
import { firebaseWebConfig } from "./firebase-config";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (!firebaseConfigured()) return null;
  if (!app) {
    app = initializeApp(firebaseWebConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!auth) {
    auth = getAuth(a);
    void setPersistence(auth, browserLocalPersistence);
  }
  return auth;
}

export function getFirebaseDb(): Firestore | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!db) db = getFirestore(a);
  return db;
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
