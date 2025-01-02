import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db
      .query("promises")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    coins: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

     await ctx.db.insert("promises", {
      title: args.title,
      coins: args.coins ?? 0,
      userId: user._id,
    });
    if (args.coins && user.pCoins){

        await ctx.db.patch(user._id, {pCoins: user.pCoins - args.coins })
    }
  },
});

export const invest = mutation({
  args: {
    pId: v.id("promises"),
    coins: v.number(),
  },
  handler: async (ctx, { pId, coins }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const promise = await ctx.db.get(pId);
    await ctx.db.patch(pId, { coins: (promise?.coins as number) + coins });
    await ctx.db.patch(user._id,{pCoins:(user.pCoins ?? 0) - coins})
  },
});


export const edit = mutation({
    args: {title:v.string(), pId:v.id("promises")},
    handler: async (ctx, {title, pId}) =>{
        await ctx.db.patch(pId, {title})

    }
})

export const del = mutation({
    args: { pId:v.id("promises")},
    handler: async (ctx, { pId}) =>{
        await ctx.db.delete(pId)

    }
})