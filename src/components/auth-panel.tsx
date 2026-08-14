import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { firebaseConfigured } from "@/lib/cloud-status";
import { getFirebaseAuth, signInEmail, signInGoogle, signOutFirebase } from "@/lib/firebase";
import { useLeague } from "@/lib/store";

export function AuthPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const setMyName = useLeague((s) => s.setMyName);
  const ready = firebaseConfigured();

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.displayName) setMyName(u.displayName);
      else if (u?.email) setMyName(u.email.split("@")[0] ?? "You");
    });
  }, [setMyName]);

  if (!ready) return null;

  async function google() {
    setPending(true);
    try {
      await signInGoogle();
      toast.success("Signed in.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setPending(false);
    }
  }

  async function emailSign(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await signInEmail(email, password);
      toast.success("Signed in.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Email sign-in failed.");
    } finally {
      setPending(false);
    }
  }

  if (user) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-bg-elevated px-4 py-3">
        <p className="text-sm">
          Signed in as <span className="text-accent">{user.email ?? user.displayName}</span>
        </p>
        <Button size="sm" variant="outline" onClick={() => void signOutFirebase()}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-bg-elevated p-4">
      <p className="text-sm text-muted">Sign in to sync leagues across phones.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" onClick={() => void google()} disabled={pending}>
          Continue with Google
        </Button>
      </div>
      <form onSubmit={emailSign} className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="outline" disabled={pending}>
          Email
        </Button>
      </form>
    </div>
  );
}
