import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { asyncMap } from "convex-helpers";
import { Doc } from "./_generated/dataModel";
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const getWeekly = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const data: { day: string; data: Doc<"sessions">[] }[] = [];

    // Get week start (Monday 00:00)
    const now = new Date();
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);

    // Loop through 7 days
    await asyncMap(days, async (label, i) => {
      const startOfDay = new Date(weekStart);
      startOfDay.setDate(weekStart.getDate() + i);

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

      const totalDuration = results.reduce((sum, doc) => sum + doc.duration, 0);
      data.push({ day: label, data: results });
    });

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
