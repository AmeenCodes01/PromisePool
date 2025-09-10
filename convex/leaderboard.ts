import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { asyncMap } from "convex-helpers";
import { Doc, Id } from "./_generated/dataModel";
import { getAll, getManyFrom, getOneFrom } from "convex-helpers/server/relationships";
import { use } from "react";


export const getGlobal = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const topRanked = await ctx.db
      .query("users")
      .withIndex("pCoins")
      .order("desc")
      .collect();

    const final = topRanked.filter(u=> u.totalDuration !== undefined || u.totalDuration === 0)
    return final
  }
});

interface userSesh {
  _id: Id<"users">;
  name: string;
  pCoins: number;
  totalDuration: number;
}


export const getRoom = query({
  args: {
    roomId: v.id("rooms")
  },
  handler: async (ctx, args) => {
    // get all sessions of that room
    const roomSesh = await getManyFrom(ctx.db, "sessions", "roomId", args.roomId);

    // group by userId
    const userSesh: userSesh[] = [];

    // 1. collect unique userIds
    const userIds = [...new Set(roomSesh.map(s => s.userId))];

    // 2. batch fetch all users (if ctx.db has a batch API)
    const users = await getAll(ctx.db, userIds);  // adjust to your DB API
    // make a map for quick lookup

    const userMap = new Map(users.filter(Boolean).map(u => [u?._id as Id<"users">, u]))

    // 3. aggregate sessions
    for (const sesh of roomSesh) {
      const existing = userSesh.find((u) => u._id === sesh.userId);

      if (existing) {
        existing.pCoins += sesh.pCoins ?? 0;
        existing.totalDuration += sesh.duration ?? 0;
      } else {
        const user = userMap.get(sesh.userId);
        if (user && user._id && user.name) {
          userSesh.push({
            _id: user._id,
            name: user.name,
            pCoins: sesh.pCoins ?? 0,
            totalDuration: sesh.duration ?? 0,
          });
        }
      }
    }



    //add name for each
    console.log(userSesh, " userSesharr")
    //sum & rank.
    userSesh.sort((a, b) => b.pCoins - a.pCoins);


   const final = userSesh.filter(u=> u.totalDuration !== undefined || u.totalDuration === 0)
    return final
  }
});


