import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FantasyLeague, Manager } from "./league-types";
import { PLAYERS } from "./players";
import { CURRENT_WEEK, ROSTER_SIZE } from "./scoring";
import type { Player } from "./types";

function nid() {
  return Math.random().toString(36).slice(2, 10);
}

function code6() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

type State = {
  week: number;
  roster: string[];
  custom: Player[];
  leagueName: string;
  me: Manager;
  leagues: FantasyLeague[];
  activeCode: string | null;
  togglePlayer: (handle: string) => string | null;
  addCustom: (player: Player) => void;
  removeCustom: (handle: string) => void;
  setWeek: (week: number) => void;
  setLeagueName: (name: string) => void;
  setMyName: (name: string) => void;
  setMeIdentity: (id: string, name: string) => void;
  addLeague: (league: FantasyLeague) => void;
  mergeRemoteLeagues: (remote: FantasyLeague[]) => void;
  clearRoster: () => void;
  createLeague: (name: string, teamName: string) => FantasyLeague;
  joinLeague: (code: string, teamName: string) => FantasyLeague;
  addLocalManager: (teamName: string) => void;
  setActiveCode: (code: string | null) => void;
  renameTeam: (teamName: string) => void;
};

export function mergePool(custom: Player[]): Player[] {
  const seen = new Set(PLAYERS.map((p) => p.handle.toLowerCase()));
  return [...PLAYERS, ...custom.filter((p) => !seen.has(p.handle.toLowerCase()))];
}

export const useLeague = create<State>()(
  persist(
    (set, get) => ({
      week: CURRENT_WEEK,
      roster: [],
      custom: [],
      leagueName: "My team",
      me: { id: "mgr-" + nid(), name: "You" },
      leagues: [],
      activeCode: null,
      setWeek: (week) => set({ week }),
      setLeagueName: (leagueName) => set({ leagueName }),
      setMyName: (name) => set({ me: { ...get().me, name } }),
      setMeIdentity: (id, name) => set({ me: { id, name } }),
      addLeague: (league) => {
        const leagues = get().leagues.filter((l) => l.code !== league.code);
        set({
          leagues: [league, ...leagues],
          activeCode: league.code,
          leagueName: league.name,
        });
      },
      mergeRemoteLeagues: (remote) => {
        const localOnly = get().leagues.filter((l) => !l.cloud);
        const byCode = new Map(remote.map((l) => [l.code, l]));
        for (const l of get().leagues) {
          if (l.cloud && !byCode.has(l.code)) byCode.set(l.code, l);
        }
        const next = [...byCode.values(), ...localOnly];
        const active = get().activeCode;
        const still = active && next.some((l) => l.code === active);
        set({
          leagues: next,
          activeCode: still ? active : next[0]?.code ?? null,
        });
      },
      setActiveCode: (activeCode) => set({ activeCode }),
      clearRoster: () => {
        const { activeCode, leagues, me } = get();
        if (!activeCode) {
          set({ roster: [] });
          return;
        }
        set({
          leagues: leagues.map((l) =>
            l.code !== activeCode
              ? l
              : {
                  ...l,
                  members: l.members.map((m) => (m.id === me.id ? { ...m, roster: [] } : m)),
                },
          ),
        });
      },
      addCustom: (player) => {
        const exists = get().custom.some(
          (p) => p.handle.toLowerCase() === player.handle.toLowerCase(),
        );
        if (exists) {
          set({
            custom: get().custom.map((p) =>
              p.handle.toLowerCase() === player.handle.toLowerCase() ? player : p,
            ),
          });
          return;
        }
        set({ custom: [player, ...get().custom] });
      },
      removeCustom: (handle) =>
        set({
          custom: get().custom.filter((p) => p.handle !== handle),
          roster: get().roster.filter((h) => h !== handle),
        }),
      togglePlayer: (handle) => {
        const { activeCode, leagues, me, roster } = get();
        if (!activeCode) {
          if (roster.includes(handle)) {
            set({ roster: roster.filter((h) => h !== handle) });
            return null;
          }
          if (roster.length >= ROSTER_SIZE) return "Lineup is full.";
          set({ roster: [...roster, handle] });
          return null;
        }
        const league = leagues.find((l) => l.code === activeCode);
        if (!league) return "Join a league first.";
        const mine = league.members.find((m) => m.id === me.id);
        if (!mine) return "You are not in this league.";
        if (mine.roster.includes(handle)) {
          set({
            leagues: leagues.map((l) =>
              l.code !== activeCode
                ? l
                : {
                    ...l,
                    members: l.members.map((m) =>
                      m.id === me.id ? { ...m, roster: m.roster.filter((h) => h !== handle) } : m,
                    ),
                  },
            ),
          });
          return null;
        }
        if (mine.roster.length >= ROSTER_SIZE) return "Lineup is full.";
        const taken = league.members.some((m) => m.id !== me.id && m.roster.includes(handle));
        if (taken) return `@${handle} is already rostered in this league.`;
        set({
          leagues: leagues.map((l) =>
            l.code !== activeCode
              ? l
              : {
                  ...l,
                  members: l.members.map((m) =>
                    m.id === me.id ? { ...m, roster: [...m.roster, handle] } : m,
                  ),
                },
          ),
        });
        return null;
      },
      createLeague: (name, teamName) => {
        const { me, leagues } = get();
        const league: FantasyLeague = {
          code: code6(),
          name: name.trim() || "New league",
          commissionerId: me.id,
          createdAt: Date.now(),
          members: [{ id: me.id, teamName: teamName.trim() || "Home", roster: [] }],
        };
        set({ leagues: [league, ...leagues], activeCode: league.code, leagueName: league.name });
        return league;
      },
      joinLeague: (raw, teamName) => {
        const code = raw.toUpperCase().trim();
        const { me, leagues } = get();
        const league = leagues.find((l) => l.code === code);
        if (!league) {
          throw new Error("No league with that code on this device. Ask the commissioner, or go online.");
        }
        if (league.members.some((m) => m.id === me.id)) {
          set({ activeCode: code, leagueName: league.name });
          return league;
        }
        const next: FantasyLeague = {
          ...league,
          members: [
            ...league.members,
            { id: me.id, teamName: teamName.trim() || "Visitor", roster: [] },
          ],
        };
        set({
          leagues: leagues.map((l) => (l.code === code ? next : l)),
          activeCode: code,
          leagueName: next.name,
        });
        return next;
      },
      addLocalManager: (teamName) => {
        const { activeCode, leagues } = get();
        if (!activeCode) return;
        const guest: LeagueMemberLike = {
          id: "mgr-" + nid(),
          teamName: teamName.trim() || "Guest",
          roster: [],
        };
        set({
          leagues: leagues.map((l) =>
            l.code !== activeCode ? l : { ...l, members: [...l.members, guest] },
          ),
        });
      },
      renameTeam: (teamName) => {
        const { activeCode, leagues, me } = get();
        if (!activeCode) {
          set({ leagueName: teamName });
          return;
        }
        set({
          leagueName: teamName,
          leagues: leagues.map((l) =>
            l.code !== activeCode
              ? l
              : {
                  ...l,
                  members: l.members.map((m) => (m.id === me.id ? { ...m, teamName } : m)),
                },
          ),
        });
      },
    }),
    { name: "xuideck-fantasy-v4" },
  ),
);

type LeagueMemberLike = { id: string; teamName: string; roster: string[] };
