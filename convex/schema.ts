import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    firebaseUid: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    photo: v.optional(v.string()),
  }).index("by_uid", ["firebaseUid"]),

  leagues: defineTable({
    name: v.string(),
    code: v.string(),
    commissionerUid: v.string(),
  }).index("by_code", ["code"]).index("by_commish", ["commissionerUid"]),

  members: defineTable({
    leagueId: v.id("leagues"),
    firebaseUid: v.string(),
    teamName: v.string(),
    roster: v.array(v.string()),
  })
    .index("by_league", ["leagueId"])
    .index("by_uid", ["firebaseUid"])
    .index("by_league_uid", ["leagueId", "firebaseUid"]),

  pulledPlayers: defineTable({
    handle: v.string(),
    name: v.string(),
    bio: v.string(),
    followers: v.number(),
    verified: v.boolean(),
    pfp: v.string(),
    lane: v.string(),
    weeks: v.any(),
  }).index("by_handle", ["handle"]),
});
