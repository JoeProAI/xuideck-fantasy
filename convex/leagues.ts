import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function code6() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function requireUid(ctx: { auth: { getUserIdentity: () => Promise<{ subject: string } | null> } }) {
  const id = await ctx.auth.getUserIdentity();
  if (!id) throw new Error("Sign in first.");
  return id.subject;
}

export const myLeagues = query({
  args: {},
  handler: async (ctx) => {
    const uid = await requireUid(ctx);
    const seats = await ctx.db.query("members").withIndex("by_uid", (q) => q.eq("firebaseUid", uid)).collect();
    const out = [];
    for (const seat of seats) {
      const league = await ctx.db.get(seat.leagueId);
      if (!league) continue;
      const members = await ctx.db.query("members").withIndex("by_league", (q) => q.eq("leagueId", league._id)).collect();
      out.push({ ...league, members });
    }
    return out;
  },
});

export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const league = await ctx.db.query("leagues").withIndex("by_code", (q) => q.eq("code", code.toUpperCase())).unique();
    if (!league) return null;
    const members = await ctx.db.query("members").withIndex("by_league", (q) => q.eq("leagueId", league._id)).collect();
    return { ...league, members };
  },
});

export const createLeague = mutation({
  args: { name: v.string(), teamName: v.string() },
  handler: async (ctx, { name, teamName }) => {
    const uid = await requireUid(ctx);
    let code = code6();
    for (let i = 0; i < 8; i++) {
      const hit = await ctx.db.query("leagues").withIndex("by_code", (q) => q.eq("code", code)).unique();
      if (!hit) break;
      code = code6();
    }
    const leagueId = await ctx.db.insert("leagues", {
      name: name.trim() || "New league",
      code,
      commissionerUid: uid,
    });
    await ctx.db.insert("members", {
      leagueId,
      firebaseUid: uid,
      teamName: teamName.trim() || "Home",
      roster: [],
    });
    return { code, leagueId };
  },
});

export const joinLeague = mutation({
  args: { code: v.string(), teamName: v.string() },
  handler: async (ctx, { code, teamName }) => {
    const uid = await requireUid(ctx);
    const league = await ctx.db.query("leagues").withIndex("by_code", (q) => q.eq("code", code.toUpperCase().trim())).unique();
    if (!league) throw new Error("No league with that code.");
    const existing = await ctx.db.query("members").withIndex("by_league_uid", (q) => q.eq("leagueId", league._id).eq("firebaseUid", uid)).unique();
    if (existing) return { code: league.code, leagueId: league._id };
    await ctx.db.insert("members", {
      leagueId: league._id,
      firebaseUid: uid,
      teamName: teamName.trim() || "Visitor",
      roster: [],
    });
    return { code: league.code, leagueId: league._id };
  },
});

export const setRoster = mutation({
  args: { code: v.string(), roster: v.array(v.string()) },
  handler: async (ctx, { code, roster }) => {
    const uid = await requireUid(ctx);
    const league = await ctx.db.query("leagues").withIndex("by_code", (q) => q.eq("code", code.toUpperCase())).unique();
    if (!league) throw new Error("League missing.");
    const seat = await ctx.db.query("members").withIndex("by_league_uid", (q) => q.eq("leagueId", league._id).eq("firebaseUid", uid)).unique();
    if (!seat) throw new Error("You are not in this league.");
    const others = await ctx.db.query("members").withIndex("by_league", (q) => q.eq("leagueId", league._id)).collect();
    const taken = new Set(others.filter((m) => m._id !== seat._id).flatMap((m) => m.roster));
    for (const h of roster) {
      if (taken.has(h)) throw new Error(`@${h} is already rostered.`);
    }
    await ctx.db.patch(seat._id, { roster });
  },
});

export const setTeamName = mutation({
  args: { code: v.string(), teamName: v.string() },
  handler: async (ctx, { code, teamName }) => {
    const uid = await requireUid(ctx);
    const league = await ctx.db.query("leagues").withIndex("by_code", (q) => q.eq("code", code.toUpperCase())).unique();
    if (!league) throw new Error("League missing.");
    const seat = await ctx.db.query("members").withIndex("by_league_uid", (q) => q.eq("leagueId", league._id).eq("firebaseUid", uid)).unique();
    if (!seat) throw new Error("You are not in this league.");
    await ctx.db.patch(seat._id, { teamName: teamName.trim() || seat.teamName });
  },
});

export const upsertProfile = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    photo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const uid = await requireUid(ctx);
    const existing = await ctx.db.query("profiles").withIndex("by_uid", (q) => q.eq("firebaseUid", uid)).unique();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return ctx.db.insert("profiles", { firebaseUid: uid, ...args });
  },
});
