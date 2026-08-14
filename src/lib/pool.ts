import { useMemo } from "react";
import { opponentOf } from "./pairing";
import { DESK_SEVEN } from "./players";
import { CURRENT_WEEK, WEEKS, scorePlayers, sumRoster } from "./scoring";
import { mergePool, useLeague } from "./store";
import type { ScoredPlayer } from "./types";

export function usePool() {
  const custom = useLeague((s) => s.custom);
  const week = useLeague((s) => s.week);
  const soloRoster = useLeague((s) => s.roster);
  const soloName = useLeague((s) => s.leagueName);
  const me = useLeague((s) => s.me);
  const leagues = useLeague((s) => s.leagues);
  const activeCode = useLeague((s) => s.activeCode);

  return useMemo(() => {
    const board = scorePlayers(mergePool(custom), week);
    const league = leagues.find((l) => l.code === activeCode) ?? null;
    const mine = league?.members.find((m) => m.id === me.id);
    const roster = mine?.roster ?? soloRoster;
    const name = mine?.teamName ?? soloName;
    const ids = league?.members.map((m) => m.id) ?? [];
    const oppId = league ? opponentOf(ids, me.id, week) : "desk";
    const oppMember = league?.members.find((m) => m.id === oppId);
    const oppRoster = oppMember?.roster ?? DESK_SEVEN;
    const oppName = oppMember?.teamName ?? "Desk Seven";

    const you = sumRoster(roster, board);
    const them = sumRoster(oppRoster, board);
    const yours = roster
      .map((h) => board.find((p) => p.handle === h))
      .filter((p): p is ScoredPlayer => Boolean(p));
    const theirs = oppRoster
      .map((h) => board.find((p) => p.handle === h))
      .filter((p): p is ScoredPlayer => Boolean(p));

    let wins = 0;
    let losses = 0;
    for (const w of WEEKS) {
      const b = scorePlayers(mergePool(custom), w);
      const oid = league ? opponentOf(ids, me.id, w) : "desk";
      const om = league?.members.find((m) => m.id === oid);
      const a = sumRoster(roster, b);
      const d = sumRoster(om?.roster ?? DESK_SEVEN, b);
      if (a > d) wins += 1;
      else if (d > a) losses += 1;
    }

    const taken = new Set(
      (league?.members ?? [])
        .filter((m) => m.id !== me.id)
        .flatMap((m) => m.roster),
    );

    return {
      board,
      you,
      them,
      yours,
      theirs,
      winning: you > them,
      live: week === CURRENT_WEEK,
      name,
      week,
      roster,
      wins,
      losses,
      league,
      oppName,
      taken,
    };
  }, [custom, week, soloRoster, soloName, me, leagues, activeCode]);
}
