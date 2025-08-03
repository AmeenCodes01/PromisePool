import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";import { authTables } from "@convex-dev/auth/server";


export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    country: v.optional(v.string()),
    score: v.optional(v.number()),
    lastSeshId: v.optional(v.id("sessions")),
    lastSeshRated: v.optional(v.boolean()),
    totalDuration:v.optional(v.number()),
    email: v.optional(v.string()),
    wCoins: v.optional(v.number()),
    pCoins: v.optional(v.number()),
    roomIds : v.optional(v.array(v.id("rooms")))

  }).index("pCoins",["pCoins"]),

  sessions: defineTable({
    duration: v.number(),
    rating: v.optional(v.number()),
    goal: v.optional(v.string()),
    wCoins: v.optional(v.number()),
    pCoins: v.optional(v.number()),
    room: v.string(),
    userId: v.id("users"),
  }).index("userId", ["userId"])
  ,

  promises: defineTable({
    title: v.string(),
    coins: v.optional(v.number()),
    userId: v.id("users"),
  }).index("by_userId", ["userId"]).index("title",["title"]),

  rewards: defineTable({
    title: v.string(),
    hours:v.number(),
    rating:v.number(),
    price: v.number(),
    partsUnlocked: v.optional(v.number()),
    finished: v.boolean(),
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),
  
  rooms: defineTable({
    name: v.string(),
    owner_id: v.id("users"),
    session_ownerId:v.optional(v.id("users")),
    type: v.union(

    v.literal("private"), //default room
    v.literal("public"), //streamer's room
    v.literal("group"), // friends created room.

  ),
  startTime: v.optional(v.number()),
  endTime: v.optional(v.number()),
  duration: v.optional(v.number()),
  seshCreation: v.optional(v.number()),
  timerStatus:v.optional(v.union(v.literal("running"),v.literal("ended"),v.literal("not started"))),
  participants: v.optional(v.array(v.object({
    id: v.id("users"),
    name: v.string()
  }))), 
  password:v.optional(v.string())
  }).index("name",["name"])
  .index("type",["type"]),

 signals: defineTable({
  roomId: v.id("rooms"),
  senderId: v.string(),
  receiverId: v.optional(v.string()),  // <-- New
  type: v.union(v.literal("offer"), v.literal("answer"), v.literal("candidate")),
  data: v.any(),
  timestamp: v.number(),
}).index("roomId", ["roomId"])
,

  
  roomUsers:defineTable({
    userId: v.id("users"),
    roomId: v.id("rooms"),
    lastActive:v.number()
  }).index("userId", ["userId"]).index("roomId",["roomId"])
},{
  
});
