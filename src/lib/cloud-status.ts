export function firebaseConfigured() {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID &&
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
      import.meta.env.VITE_FIREBASE_APP_ID,
  );
}

export function convexConfigured() {
  return Boolean(import.meta.env.VITE_CONVEX_URL);
}

export function cloudReady() {
  return firebaseConfigured() && convexConfigured();
}
