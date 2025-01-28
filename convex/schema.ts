import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    country: v.optional(v.string()),
    score: v.optional(v.number()),
    lastSeshId: v.optional(v.id("sessions")),
    lastSeshRated: v.optional(v.boolean()),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
    email: v.optional(v.string()),
    wCoins: v.optional(v.number()),
    pCoins: v.optional(v.number()),
  }).index("byExternalId", ["externalId"]),

  sessions: defineTable({
    duration: v.number(),
    rating: v.optional(v.number()),
    goal: v.optional(v.string()),
    wCoins: v.optional(v.number()),
    pCoins: v.optional(v.number()),
    room: v.string(),
    userId: v.id("users"),
  }).index("userId", ["userId"]),

  promises: defineTable({
    title: v.string(),
    coins: v.optional(v.number()),
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),

  rewards: defineTable({
    title: v.string(),
    price: v.number(),
    partsUnlocked: v.optional(v.number()),
    finished: v.boolean(),
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),
});
