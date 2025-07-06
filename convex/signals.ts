import { ConvexError, v } from "convex/values";
import { query, mutation, MutationCtx } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { getOne } from "./rooms";
import { getOneFrom } from "convex-helpers/server/relationships";


export const sendSignal = mutation({
  args: {
    room: v.string(),

    type: v.union(v.literal("offer"), v.literal("answer"), v.literal("candidate")),
    data: v.any(),
  },
  handler: async (ctx, { room, type, data }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const roomInfo = await getOneFrom(ctx.db,"rooms","name",room,"name")
    if(!roomInfo)return
    await ctx.db.insert("signals", {
      roomId:roomInfo._id,
      senderId:user._id,
      type,
      data,
      timestamp: Date.now(),
    });
  },
});

export const getSignals = query({
  args: {
    room:  v.string()
,
    since: v.number(),
  },
  handler: async (ctx, { room, since }) => {
    const roomInfo = await getOneFrom(ctx.db,"rooms","name",room,"name")
    if(!roomInfo)return
    return await ctx.db
      .query("signals")
      .withIndex("roomId", (q) => q.eq("roomId", roomInfo._id))
      .filter((q) => q.gte(q.field("timestamp"), since))
      .collect();
  },
});
