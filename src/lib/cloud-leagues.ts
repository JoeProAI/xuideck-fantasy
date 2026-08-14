import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import type { FantasyLeague, LeagueMember } from "./league-types";

function code6() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

type CloudDoc = {
  code: string;
  name: string;
  commissionerId: string;
  createdAt: number;
  memberUids: string[];
  members: LeagueMember[];
};

function fromDoc(data: CloudDoc): FantasyLeague {
  return {
    code: data.code,
    name: data.name,
    commissionerId: data.commissionerId,
    createdAt: data.createdAt,
    members: data.members ?? [],
    cloud: true,
  };
}

function firestoreHint(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  if (/permission|insufficient/i.test(msg)) {
    return "Firestore blocked this. Create the database and paste the rules from the Leagues page.";
  }
  if (/not found|does not exist/i.test(msg)) {
    return "Turn on Firestore in Firebase (Build, Firestore Database).";
  }
  return msg;
}

export async function createCloudLeague(
  uid: string,
  name: string,
  teamName: string,
): Promise<FantasyLeague> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Sign in first.");
  const member: LeagueMember = {
    id: uid,
    teamName: teamName.trim() || "Home",
    roster: [],
  };
  for (let i = 0; i < 8; i++) {
    const code = code6();
    const ref = doc(db, "leagues", code);
    const hit = await getDoc(ref);
    if (hit.exists()) continue;
    const league: CloudDoc = {
      code,
      name: name.trim() || "New league",
      commissionerId: uid,
      createdAt: Date.now(),
      memberUids: [uid],
      members: [member],
    };
    try {
      await setDoc(ref, league);
    } catch (err) {
      throw new Error(firestoreHint(err));
    }
    return fromDoc(league);
  }
  throw new Error("Could not mint a league code. Try again.");
}

export async function joinCloudLeague(
  uid: string,
  raw: string,
  teamName: string,
): Promise<FantasyLeague> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Sign in first.");
  const code = raw.toUpperCase().trim();
  const ref = doc(db, "leagues", code);
  let snap;
  try {
    snap = await getDoc(ref);
  } catch (err) {
    throw new Error(firestoreHint(err));
  }
  if (!snap.exists()) throw new Error("No league with that code.");
  const data = snap.data() as CloudDoc;
  if (data.memberUids?.includes(uid) || data.members?.some((m) => m.id === uid)) {
    return fromDoc(data);
  }
  const member: LeagueMember = {
    id: uid,
    teamName: teamName.trim() || "Visitor",
    roster: [],
  };
  try {
    await updateDoc(ref, {
      memberUids: arrayUnion(uid),
      members: [...(data.members ?? []), member],
    });
  } catch (err) {
    throw new Error(firestoreHint(err));
  }
  return fromDoc({
    ...data,
    memberUids: [...(data.memberUids ?? []), uid],
    members: [...(data.members ?? []), member],
  });
}

export async function pushCloudLeague(league: FantasyLeague) {
  if (!league.cloud) return;
  const db = getFirebaseDb();
  if (!db) return;
  const ref = doc(db, "leagues", league.code);
  await setDoc(
    ref,
    {
      code: league.code,
      name: league.name,
      commissionerId: league.commissionerId,
      createdAt: league.createdAt,
      memberUids: league.members.map((m) => m.id),
      members: league.members,
    },
    { merge: true },
  );
}

export function listenMyLeagues(uid: string, onData: (leagues: FantasyLeague[]) => void) {
  const db = getFirebaseDb();
  if (!db) return () => {};
  const q = query(collection(db, "leagues"), where("memberUids", "array-contains", uid));
  return onSnapshot(
    q,
    (snap) => {
      const leagues = snap.docs.map((d) => fromDoc(d.data() as CloudDoc));
      onData(leagues);
    },
    () => {
      // Permission errors until rules are live. Local play still works.
    },
  );
}
