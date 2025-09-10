import { ConvexError, v } from "convex/values";
import { query, mutation, MutationCtx } from "./_generated/server";
import {
  getAll,
  getManyFrom,
  getOneFrom,
} from "convex-helpers/server/relationships";
import { Id } from "./_generated/dataModel";
import { getCurrentUserOrThrow } from "./users";
import { use } from "react";

export const get = query({
  handler: async (ctx) => {
    //get all public rooms, rooms user is in, default room.
    const user = await getCurrentUserOrThrow(ctx);
    const publicRooms = await getManyFrom(ctx.db, "rooms", "type", "public");
    const groups = user.roomIds ? await getAll(ctx.db, user.roomIds) : [];

    const priv = groups.filter(g => g?.name === user.email)
    const privGroups = groups.filter(g => g?.name !== user.email)

    return { public: publicRooms, groups: privGroups, private: priv };
  },
});

export const add = mutation({
  args: { id: v.id("rooms") },
  handler: async (ctx, { id }) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (user && !user.roomIds?.includes(id)) {

      await ctx.db.patch(user._id, { roomIds: [...(user?.roomIds ?? []), id] });
    }
  },
});

export const create = mutation({
  args: {
    name: v.string(),

    password: v.optional(v.string()),
    type: v.union(
      v.literal("private"), //default room
      v.literal("public"), //streamer's room
      v.literal("group") // friends created room.
    ),
  },
  handler: async (ctx, { name, type, password }) => {
    console.log("Helo idiot")
    const user = await getCurrentUserOrThrow(ctx);
    // const existingRoom = await ctx.db
    //   .query("rooms")
    //   .filter((q) => q.eq(q.field("name"), name))
    //   .unique();

    // if (existingRoom) {
    //   throw new ConvexError({ message: "Room with this name already exists" });
    // }
console.log("hloo create")
    return await createRoom(ctx, name, user._id, type, password, undefined);
  },
});

export const getOne = query({
  args: { id: v.id("rooms") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)

  },
});

export const createSesh = mutation({
  args: {
    roomId: v.id("rooms"),
    duration: v.number(), // Duration in minutes
  },
  handler: async (ctx, args) => {
    const { roomId, duration } = args;
    const user = await getCurrentUserOrThrow(ctx);
    const room = await ctx.db.get(roomId);
    // don't start if one already started.
    if (room && user) {
      await ctx.db.patch(roomId, {
        timerStatus: "not started",
        duration,
        session_ownerId: user._id as Id<"users">,
        participants: [{ id: user._id, name: user.name as string }],
        seshCreation: Date.now()
      });
    }
  },
});

export const startSesh = mutation({
  args: {
    roomId: v.id("rooms"),
    // Duration in minutes
  },
  handler: async (ctx, args) => {
    const { roomId } = args;
    const room = await ctx.db.get(roomId);
    const user = await getCurrentUserOrThrow(ctx);

    if (room) {
      const startTime = Date.now();
      const endTime = startTime + (room?.duration as number) * 60000; // Convert minutes to milliseconds
      await ctx.db.patch(roomId, {
        timerStatus: "running",
        startTime,
        endTime,
      });
    }
  },
});

export const participate = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
    // Duration in minutes
  },
  handler: async (ctx, args) => {
    const { roomId, userId } = args;
    const room = await ctx.db.get(roomId);
    const user = await getCurrentUserOrThrow(ctx);
    const participant = room?.participants?.find(p => p.id === userId)
    if (room && room.timerStatus === "not started" && !participant) {
      await ctx.db.patch(roomId, {
        participants: [...(room.participants ?? []), { id: userId, name: user.name as string }],
      });
    }
  },
});

export const endSesh = mutation({
  args: {
    roomId: v.id("rooms"),
    // Duration in minutes
  },
  handler: async (ctx, args) => {
    const { roomId } = args;
    const room = await ctx.db.get(roomId);
    console.log("endsESH")
    if (room) {

      await ctx.db.patch(roomId, {
        timerStatus: "ended",
        participants: undefined
      });
    }
  },
});


export const cancelSesh = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    console.log("cancelgroupsesh")
    const { roomId } = args;
    const room = await ctx.db.get(roomId);
    // don't start if one already started.
    if (room) {
      await ctx.db.patch(roomId, {
        timerStatus: undefined,
        participants: undefined,
        duration: undefined,
        startTime: undefined,
        endTime: undefined,
        session_ownerId: undefined
      });
    }
  },
})


export const leaveSesh = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    const { roomId, userId } = args;
    console.log("levegroupsesh")
    const room = await ctx.db.get(roomId);
    // don't start if one already started.
    if (room) {
      await ctx.db.patch(roomId, {

        participants: room?.participants ? room.participants?.filter((p) => p.id !== userId) : room?.participants

      });
    }
  },
})





export async function createRoom(
  ctx: MutationCtx,
  name: string,
  id: Id<"users">,
  type: "private" | "public" | "group",
  password?: string,
  mode?: "init" | undefined
) {
  const user = await ctx.db.get(id)
  const roomId = await ctx.db.insert("rooms", {
    name,
    owner_id: id,
    type: type,
    password: password,
  });
  console.log(mode, " creating room")
  mode ? await ctx.db.patch(id, { roomId }) : await ctx.db.patch(id, { roomIds: [...user?.roomIds ?? [], roomId] })
  return roomId
}
