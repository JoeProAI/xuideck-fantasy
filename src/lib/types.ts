export type Tier = "micro" | "mid" | "macro" | "whale";
export type Rarity = "common" | "rare" | "epic" | "legendary";
export type Lane = "Founder" | "Product" | "Engineer" | "Creator" | "Platform" | "Writer" | "Sports" | "Analyst";

export type WeekStats = {
  posts: number;
  likes: number;
  impressions: number;
  replies: number;
  quotes: number;
  bookmarks: number;
  homeRuns: number;
};

export type Player = {
  handle: string;
  name: string;
  bio: string;
  followers: number;
  verified: boolean;
  lane: Lane;
  pfp: string;
  weeks: Record<number, WeekStats>;
};

export type ScoredWeek = WeekStats & {
  R: number;
  H: number;
  HR: number;
  RBI: number;
  SB: number;
  raw: number;
  factor: number;
  adj: number;
  avg: number;
};

export type ScoredPlayer = Player & {
  week: number;
  score: ScoredWeek;
  rarity: Rarity;
  rank: number;
};
