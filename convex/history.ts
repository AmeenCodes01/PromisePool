import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { asyncMap } from "convex-helpers";
import { Doc } from "./_generated/dataModel";

// I want to send prev week total time.
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

      const thisWeek = await ctx.db
        .query("sessions")
        .withIndex("userId", q =>
          q.eq("userId", user._id)
            .gte("_creationTime", startOfDay.getTime())
            .lt("_creationTime", endOfDay.getTime())
        )
        .collect();
      data.push({ day: label, data: thisWeek });
    });


     data.sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));

     //get prev week data as well.
     // Previous week range
const prevWeekStart = new Date(weekStart);
prevWeekStart.setDate(prevWeekStart.getDate() - 7);

const prevWeekEnd = new Date(weekStart);

// Get previous week sessions
const prevWeekSessions = await ctx.db
  .query("sessions")
  .withIndex("userId", q =>
    q.eq("userId", user._id)
      .gte("_creationTime", prevWeekStart.getTime())
      .lt("_creationTime", prevWeekEnd.getTime())
  )
  .collect();

// Calculate total time (assuming you have a 'duration' field in each session)
const prevWeekTotalMinutes = prevWeekSessions.reduce(
  (acc, session) => acc + (session.duration || 0),
  0
);

// Return both this week’s data and prev week total
return {
  thisWeek: data,
  prevWeekTotalMinutes,
};
},
});

