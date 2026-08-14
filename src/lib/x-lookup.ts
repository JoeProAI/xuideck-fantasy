import { createServerFn } from "@tanstack/react-start";
import { modelWeekStats } from "./model-week";
import { CURRENT_WEEK } from "./scoring";
import type { Lane, Player } from "./types";

type FxUser = {
  screen_name: string;
  name: string;
  description?: string;
  followers: number;
  tweets?: number;
  avatar_url?: string;
  verification?: { verified?: boolean };
};

function hiResPfp(url?: string) {
  if (!url) return "";
  return url.replace("_normal.", ".").replace("_bigger.", ".");
}

function guessLane(bio: string): Lane {
  const t = bio.toLowerCase();
  if (/(engineer|eng|c\+\+|assembly|infra)/.test(t)) return "Engineer";
  if (/(product|pm\b)/.test(t)) return "Product";
  if (/(golf|nfl|nba|fantasy|sports)/.test(t)) return "Sports";
  if (/(writer|essay|newsletter|journalist)/.test(t)) return "Writer";
  if (/(found|ceo|build)/.test(t)) return "Founder";
  if (/(design|creator)/.test(t)) return "Creator";
  if (/(analyst|markets|quant)/.test(t)) return "Analyst";
  return "Creator";
}

export const lookupXUser = createServerFn({ method: "POST" })
  .validator((input: { handle: string }) => {
    const handle = input.handle.replace(/^@/, "").trim();
    if (!/^[A-Za-z0-9_]{1,15}$/.test(handle)) {
      throw new Error("Enter a valid X handle");
    }
    return { handle };
  })
  .handler(async ({ data }) => {
    const res = await fetch(`https://api.fxtwitter.com/${data.handle}`, {
      headers: { "user-agent": "XuideckFantasy/1.0" },
    });
    if (!res.ok) {
      return { ok: false as const, error: `Could not find @${data.handle}` };
    }
    const body = (await res.json()) as { code?: number; user?: FxUser };
    if (!body.user) {
      return { ok: false as const, error: `No public profile for @${data.handle}` };
    }
    const u = body.user;
    const handle = u.screen_name;
    const followers = u.followers ?? 0;
    const player: Player = {
      handle,
      name: u.name || handle,
      bio: (u.description || "").split("\n")[0]?.slice(0, 120) || "X account",
      followers,
      verified: Boolean(u.verification?.verified),
      lane: guessLane(u.description || ""),
      pfp: hiResPfp(u.avatar_url) || "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
      weeks: {
        [CURRENT_WEEK - 1]: modelWeekStats(handle, followers, CURRENT_WEEK - 1),
        [CURRENT_WEEK]: modelWeekStats(handle, followers, CURRENT_WEEK),
      },
    };
    return { ok: true as const, player, live: true as const };
  });
