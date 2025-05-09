import { getAuthUserId } from "@convex-dev/auth/server";
import { query, QueryCtx } from "./_generated/server";
 
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



export async function getCurrentUserOrThrow(ctx: QueryCtx) {
    const userId = await getAuthUserId(ctx);
    
    if (!userId) throw new Error("Can't get current userId");
    const user = await ctx.db.get(userId); 
    if (!user) throw new Error("Can't get current user");
    return user
  }