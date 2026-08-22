import type { WeekStats } from "./types";

function hash32(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic weekly box score from public account size.
 * Volume scales with log(followers) so a hot 10k week can beat a sleepy whale.
 * Same handle+week always matches.
 */
export function modelWeekStats(
  handle: string,
  followers: number,
  week: number,
): WeekStats {
  const rng = mulberry32(hash32(`${handle.toLowerCase()}:${week}`));
  const size = Math.max(followers, 20);
  const reach = Math.pow(Math.log10(size + 100), 3.15) * 22;
  const posts = 4 + Math.floor(rng() * 14);
  let heat = 0.28 + rng() * 1.05;
  if (rng() < 0.14) heat *= 2.4;
  const likes = Math.max(6, Math.round(reach * heat * (0.65 + posts / 16)));
  const er = 0.007 + rng() * 0.03;
  const impressions = Math.max(likes * 14, Math.round(likes / er));
  const replies = Math.round(likes * (0.04 + rng() * 0.12));
  const quotes = Math.round(likes * (0.008 + rng() * 0.03));
  const bookmarks = Math.round(likes * (0.02 + rng() * 0.08));
  const homeRuns =
    impressions >= 100_000
      ? Math.min(6, Math.max(0, Math.round((impressions - 90_000) / 1_400_000)))
      : 0;
  return { posts, likes, impressions, replies, quotes, bookmarks, homeRuns };
}

export function isoWeek(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
