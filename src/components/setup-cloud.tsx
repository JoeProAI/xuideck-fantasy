import { cloudReady, convexConfigured, firebaseConfigured } from "@/lib/cloud-status";

export function SetupCloud() {
  const fb = firebaseConfigured();
  const cx = convexConfigured();
  const ready = cloudReady();

  return (
    <section className="rounded-md border border-border bg-bg-elevated p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Go live</p>
      <h2 className="mt-1 text-3xl">Firebase + Convex</h2>
      <p className="mt-2 text-sm text-muted">
        Local play works now. Plug these in when you want friends on other phones.
      </p>
      <ol className="mt-5 space-y-4 text-sm">
        <li>
          <p className="font-medium">1. Firebase Auth (Google + email)</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-muted">
            <li>Create a project at console.firebase.google.com</li>
            <li>Authentication, Sign-in method: enable Google and Email/Password</li>
            <li>Project settings, add a Web app, copy the config</li>
            <li>Authorized domains: fantasy.xuideck.com</li>
          </ul>
        </li>
        <li>
          <p className="font-medium">2. Convex (leagues, rosters, live updates)</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-muted">
            <li>Run <span className="font-mono text-fg">npx convex dev</span> in this repo</li>
            <li>Dashboard, Settings, Environment Variables: set FIREBASE_PROJECT_ID</li>
            <li>Copy the deployment URL into VITE_CONVEX_URL</li>
          </ul>
        </li>
        <li>
          <p className="font-medium">3. Env vars on Vercel</p>
          <pre className="mt-2 overflow-x-auto rounded-sm bg-bg p-3 font-mono text-[11px] leading-5 text-fg">
            {`VITE_PUBLIC_HOSTNAME=fantasy.xuideck.com
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_CONVEX_URL=https://YOUR.convex.cloud`}
          </pre>
        </li>
      </ol>
      <dl className="mt-5 grid grid-cols-2 gap-2 font-mono text-xs">
        <Status ok={fb} label="Firebase" />
        <Status ok={cx} label="Convex" />
      </dl>
      <p className="mt-3 text-xs text-subtle">
        {ready
          ? "Cloud is configured. Sign in on the Leagues page."
          : "Until both are green, leagues stay on this device. Create a league and add a second manager to try the flow."}
      </p>
    </section>
  );
}

function Status({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-border px-3 py-2">
      <dt>{label}</dt>
      <dd className={ok ? "text-accent" : "text-danger"}>{ok ? "Ready" : "Missing"}</dd>
    </div>
  );
}
