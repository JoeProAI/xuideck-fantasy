/** Public Firebase web config. Safe in the client. Restricted by authorized domains. */
export const firebaseWebConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCf0ZaKFaD2SX9BqlzXIoEy29ULlB4vHA0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fantasy-xuideck.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fantasy-xuideck",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:801799498797:web:d19972276c076cbe2f1ca4",
};
