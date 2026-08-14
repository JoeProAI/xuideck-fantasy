import { useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { listenMyLeagues, pushCloudLeague } from "@/lib/cloud-leagues";
import { getFirebaseAuth } from "@/lib/firebase";
import { useLeague } from "@/lib/store";

export function CloudSync() {
  const uidRef = useRef<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    let unsubLeagues: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      unsubLeagues?.();
      unsubLeagues = undefined;
      uidRef.current = user?.uid ?? null;
      if (!user) return;
      const name = user.displayName || user.email?.split("@")[0] || "You";
      useLeague.getState().setMeIdentity(user.uid, name);
      unsubLeagues = listenMyLeagues(user.uid, (remote) => {
        useLeague.getState().mergeRemoteLeagues(remote);
      });
    });
    return () => {
      unsubAuth();
      unsubLeagues?.();
    };
  }, []);

  useEffect(() => {
    return useLeague.subscribe((state, prev) => {
      const uid = uidRef.current;
      if (!uid || state.leagues === prev.leagues) return;
      for (const league of state.leagues) {
        if (!league.cloud) continue;
        const before = prev.leagues.find((l) => l.code === league.code);
        if (before === league) continue;
        void pushCloudLeague(league).catch(() => {});
      }
    });
  }, []);

  return null;
}
