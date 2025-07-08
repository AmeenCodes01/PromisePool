import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { asyncMap } from "convex-helpers";
import { Doc } from "./_generated/dataModel";



export const get = query({
  args: {},
  handler: async (ctx, args) => {
     const user = await getCurrentUserOrThrow(ctx);

     // get last 10 sessions with {user,room, seshInfo}
}
});

