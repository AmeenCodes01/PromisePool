import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { asyncMap } from "convex-helpers";
import { Doc } from "./_generated/dataModel";
export const getWeekly = query({
  args: {},
  handler: async (ctx, args) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const user = await getCurrentUserOrThrow(ctx);
    
    const data: { day: string; data: Doc<"sessions">[] }[] = [];

    // Get week start (Monday 00:00)
    const now = new Date();
    const weekStart = new Date(now);
    const todayDay = weekStart.getDay(); // 0 (Sun) - 6 (Sat)
    const diffToMonday = todayDay === 0 ? -6 : 1 - todayDay;
    weekStart.setDate(weekStart.getDate() + diffToMonday ); // previous Monday
    weekStart.setHours(0, 0, 0, 0);

    const baseDateNumber = weekStart.getDate(); // cache this safely once

    await asyncMap(days, async (label, i) => {
      const startOfDay = new Date(weekStart);
      startOfDay.setDate(baseDateNumber + i);

      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(startOfDay.getDate() + 1);

      const results = await ctx.db
        .query("sessions")
        .withIndex("userId", q =>
          q.eq("userId", user._id)
            .gte("_creationTime", startOfDay.getTime())
            .lt("_creationTime", endOfDay.getTime())
        )
        .collect();
      data.push({ day: label, data: results });
    });


   await  data.sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));

      return data;
  },
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
