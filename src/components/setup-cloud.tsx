import { cloudReady, firebaseConfigured } from "@/lib/cloud-status";

export const FIRESTORE_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leagues/{code} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.commissionerId == request.auth.uid
        && request.auth.uid in request.resource.data.memberUids;
      allow update: if request.auth != null
        && (request.auth.uid in resource.data.memberUids
          || request.auth.uid in request.resource.data.memberUids);
    }
  }
}`;

export function SetupCloud() {
  const fb = firebaseConfigured();
  const ready = cloudReady();

  return (
    <section className="rounded-md border border-border bg-bg-elevated p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        One-time setup
      </p>
      <h2 className="mt-1 text-3xl">Finish Firebase</h2>
      <p className="mt-2 text-sm text-muted">
        Skip the SDK snippet. The app is already wired. Flip these three switches so a friend can join from another phone.
      </p>

      <ol className="mt-5 space-y-4 text-sm">
        <li>
          <p className="font-medium">1. Sign-in methods</p>
          <p className="mt-1 text-muted">
            Authentication, Sign-in method: enable Google and Email/Password.
          </p>
        </li>
        <li>
          <p className="font-medium">2. Authorized domains</p>
          <p className="mt-1 text-muted">
            Authentication, Settings, Authorized domains: add fantasy.xuideck.com
            and xuideck-fantasy.vercel.app
          </p>
        </li>
        <li>
          <p className="font-medium">3. Firestore</p>
          <p className="mt-1 text-muted">
            Build, Firestore Database, Create database, production mode. Then Rules,
            replace with this and Publish.
          </p>
          <pre className="mt-2 overflow-x-auto rounded-sm bg-bg p-3 font-mono text-[11px] leading-5 text-fg">
            {FIRESTORE_RULES}
          </pre>
        </li>
      </ol>

      <dl className="mt-5 font-mono text-xs">
        <div className="flex items-center justify-between rounded-sm border border-border px-3 py-2">
          <dt>Firebase project</dt>
          <dd className={fb ? "text-accent" : "text-danger"}>{fb ? "Ready" : "Missing"}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-subtle">
        {ready
          ? "Sign in above, create a league, send the code. Until Firestore is on, the code stays on this device."
          : "Create a league anyway to try the flow on this phone."}
      </p>
    </section>
  );
}
