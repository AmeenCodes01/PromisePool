import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getManyFrom, getOneFrom } from "convex-helpers/server/relationships";
import { v } from "convex/values";
 
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
        throw new Error("Can't get current user");
    }
    return await ctx.db.get(userId);
  },
});

export const room = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
        throw new Error("Can't get current user");
    }
    return await getOneFrom(ctx.db,"rooms","owner_id",userId)
  },
});
 

export const addCountry = mutation({
  args: {
    country: v.string(), 
    coords: v.array(v.number()),
    color:v.string(),
    timezone:v.string()
  },
  handler: async (ctx, {country, coords, color, timezone}) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
        throw new Error("Can't get current user");
    }

    await ctx.db.patch(userId, {country, countryprops: {coords, color, timezone}} )
  },
});

export const getForMap = query({
  args: {},
  handler: async (ctx) => {
  //   const userId = await getAuthUserId(ctx);
  //   if (userId === null) {
  //       throw new Error("Can't get current user");
  //   }
  //   return await ctx.db.get(userId);
  // },
const usersWithCountry = await ctx.db
  .query("users")
  .filter(q => q.neq(q.field("country"), undefined))
  .collect();


return usersWithCountry
  }
});


export async function getCurrentUserOrThrow(ctx: QueryCtx) {
    const userId = await getAuthUserId(ctx);
    
    if (!userId) throw new Error("Can't get current userId");
    const user = await ctx.db.get(userId); 
    if (!user) throw new Error("Can't get current user");
    return user
  }