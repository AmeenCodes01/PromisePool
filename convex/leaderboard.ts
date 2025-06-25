import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { asyncMap } from "convex-helpers";
import { Doc } from "./_generated/dataModel";
export const get = query({
  args: {},
  handler: async (ctx, args) => {
     const user = await getCurrentUserOrThrow(ctx);
    
const topRanked = await ctx.db
  .query("users")
  .withIndex("pCoins")
  .order("desc")
  .collect();    

  return topRanked
}
});


export const create = mutation({
  args: {
    title: v.string(),
    price: v.optional(v.number()),
  },
  handler: async (ctx, { title, price }) => {
    const user = await getCurrentUserOrThrow(ctx);

    await ctx.db.insert("rewards", {
      title: title,
      price: price ?? 0,
      partsUnlocked: 0,
      finished: false,
      userId: user._id,
    });
  },
});
