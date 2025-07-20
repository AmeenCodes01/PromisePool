import { ConvexError, v } from "convex/values";
import { query, mutation, MutationCtx } from "./_generated/server";
import {
  getAll,
  getManyFrom,
  getOneFrom,
} from "convex-helpers/server/relationships";
import { Id } from "./_generated/dataModel";
import { getCurrentUserOrThrow } from "./users";
import { asyncMap } from "convex-helpers";

export const join = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { name } = args;
    const room = await getOneFrom(ctx.db, "rooms", "name", name);
    const user = await getCurrentUserOrThrow(ctx);
    if (room) {
      //del old rooms if exist
      const roomUser = await getOneFrom(
        ctx.db,
        "roomUsers",
        "userId",
        user._id
      );
      if (roomUser) {
        await ctx.db.delete(roomUser._id);
      }
      // don't start if one already started.

      await ctx.db.insert("roomUsers", {
        userId: (await getCurrentUserOrThrow(ctx))._id,
        roomId: room._id as Id<"rooms">,
        lastActive: Date.now(),
      });
    }
  },
});

export const get = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { name } = args;
    const room = await getOneFrom(ctx.db, "rooms", "name", name);
    const user = await getCurrentUserOrThrow(ctx);
    // don't start if one already started.
    if (!room) return;
    const results = await ctx.db
      .query("roomUsers")
      .withIndex("roomId", (q) => q.eq("roomId", room._id))
      .filter((q) => q.gte(q.field("lastActive"), Date.now() - 30000))
      .collect();

    const data = await asyncMap(results, async (r) => {
      const user = await getOneFrom(ctx.db, "users", "by_id", r.userId, "_id");
      return { ...r, name: user?.email };
    });

    return data;
  },
});

export const heartbeat = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const roomUser = await getOneFrom(ctx.db, "roomUsers", "userId", user._id);
    if (!roomUser) return;
    await ctx.db.patch(roomUser._id, {
      lastActive: Date.now(),
    });

    const room = await getOneFrom(
      ctx.db,
      "rooms",
      "by_id",
      roomUser.roomId,
      "_id"
    );
    if (!room) return;

    // Only proceed if timer is active and not ended
    if (room.timerStatus !== undefined && room.timerStatus !== "ended") {
      const ownerSesh = await getOneFrom(
        ctx.db,
        "roomUsers",
        "userId",
        room.session_ownerId as Id<"users">
      );

      // If session owner is inactive or has left the room → clear session
      const ownerInactive =
        ownerSesh?.lastActive && Date.now() - ownerSesh.lastActive > 45000;

      const ownerLeft = ownerSesh?.roomId !== room._id;

      
      if (ownerSesh && (ownerInactive || ownerLeft)) {
        //if no participants, clear
     
        if (room.participants?.length == 0) {
          await ctx.db.patch(room._id, {
            timerStatus: undefined,
            participants: undefined,
            duration: undefined,
            startTime: undefined,
            endTime: undefined,
            session_ownerId: undefined,
          });
        } else {
          if (room.participants) {
            const newParticipants = room.participants.filter(
              (u) => u.id !== room.session_ownerId
            );

const newOwner = newParticipants[
  Math.floor(Math.random() * newParticipants.length)
];
            await ctx.db.patch(room._id, {
              participants: newParticipants,
              session_ownerId: newOwner.id,
            });
          }
        }
      }
    }

    // Always update current user's heartbeat
  },
});
