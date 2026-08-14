import type { Player, Rarity, ScoredPlayer, ScoredWeek, Tier, WeekStats } from "./types";

export const CURRENT_WEEK = 33;
export const WEEKS = [32, 33] as const;
export const ROSTER_SIZE = 5;

export function tierOf(followers: number): Tier {
  if (followers >= 1_000_000) return "whale";
  if (followers >= 100_000) return "macro";
  if (followers >= 10_000) return "mid";
  return "micro";
}

export function handicapFactor(followers: number): number {
  return 10 / Math.log10(Math.max(followers, 1) + 100);
}

export function scoreWeek(stats: WeekStats, followers: number): ScoredWeek {
  const R = stats.likes;
  const H = stats.impressions / 1000;
  const HR = stats.homeRuns;
  const RBI = stats.replies + stats.quotes;
  const SB = stats.bookmarks;
  const raw = R * 1 + H * 1 + HR * 10 + RBI * 2 + SB * 3;
  const factor = handicapFactor(followers);
  const engagements = stats.likes + stats.replies + stats.quotes;
  const avg = stats.impressions > 0 ? engagements / stats.impressions : 0;
  return { ...stats, R, H, HR, RBI, SB, raw, factor, adj: raw * factor, avg };
}

export function rarityFromRank(rank: number, total: number): Rarity {
  if (rank <= 2) return "legendary";
  if (rank <= Math.max(3, Math.ceil(total * 0.25))) return "epic";
  if (rank <= Math.max(6, Math.ceil(total * 0.55))) return "rare";
  return "common";
}

export function scorePlayers(players: Player[], week: number): ScoredPlayer[] {
  const scored = players
    .map((p) => {
      const stats = p.weeks[week] ?? p.weeks[CURRENT_WEEK];
      return {
        ...p,
        week,
        score: scoreWeek(stats, p.followers),
        rarity: "common" as Rarity,
        rank: 0,
      };
    })
    .sort((a, b) => b.score.adj - a.score.adj);

  return scored.map((p, i) => ({
    ...p,
    rank: i + 1,
    rarity: rarityFromRank(i + 1, scored.length),
  }));
}

export function sumRoster(handles: string[], board: ScoredPlayer[]) {
  return handles.reduce((acc, h) => {
    const p = board.find((x) => x.handle === h);
    return acc + (p?.score.adj ?? 0);
  }, 0);
}
