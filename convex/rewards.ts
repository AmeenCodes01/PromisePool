import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db
      .query("rewards")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    price: v.optional(v.number()),
     hours:v.number(),
    rating:v.number()
  },
  handler: async (ctx, { title, price, hours, rating }) => {
    const user = await getCurrentUserOrThrow(ctx);

    await ctx.db.insert("rewards", {
      title: title,
      price: price ?? 0,
      partsUnlocked: 0,
      finished: false,
      userId: user._id,
      hours,
      rating
    });
  },
});

export const resetCoins = mutation({
  args: {
   
  },
  handler: async (ctx, { }) => {
    console.log("Unlock")
    const user = await getCurrentUserOrThrow(ctx);
    
    await ctx.db.patch(user._id, {
      wCoins: 0,
    });
  },  
});


export const unlock = mutation({
  args: {
    rId: v.id("rewards"),
    // coins: v.number(),
  },
  handler: async (ctx, { rId }) => {
    console.log("Unlock")
    const user = await getCurrentUserOrThrow(ctx);
    const reward = await ctx.db.get(rId);
    await ctx.db.patch(rId, {
      partsUnlocked: (reward?.partsUnlocked ?? 0) + 1,
    });
    await ctx.db.patch(user._id, {
      wCoins: (user.wCoins as number) - (reward?.price as number),
    });
  },  
});

export const edit = mutation({
  args: {
    title: v.string(),
    hours: v.number(),
    rating: v.number(),
    price: v.number(),
    finished: v.boolean(),
    rId: v.id("rewards"),
  },
  handler: async (ctx, { title, rId, finished, price }) => {
      await ctx.db.patch(rId, {
        title,
        finished,
        price,
        
      });
    
  },
});

// //coins really
// export const addCoins = mutation({
//   args: { coins: v.number() },
//   handler: async (ctx, { coins }) => {
//     const user = await getCurrentUserOrThrow(ctx);
//     if(user){
//       await ctx.db.patch(user._id,{pCoins:(user.pCoins ?? 0) + coins, wCoins:(user.wCoins??0)+coins})

//     }
//   },
// });


export const del = mutation({
  args: { rId: v.id("rewards") },
  handler: async (ctx, { rId }) => {
    await ctx.db.delete(rId);
  },
});



