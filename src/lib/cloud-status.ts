import { firebaseWebConfig } from "./firebase-config";

export function firebaseConfigured() {
  return Boolean(
    firebaseWebConfig.apiKey &&
      firebaseWebConfig.projectId &&
      firebaseWebConfig.authDomain &&
      firebaseWebConfig.appId,
  );
}

export function convexConfigured() {
  return Boolean(import.meta.env.VITE_CONVEX_URL);
}

export function cloudReady() {
  return firebaseConfigured();
}
