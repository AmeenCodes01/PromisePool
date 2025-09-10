import { v } from "convex/values";
import { mutation,query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { getManyFrom } from "convex-helpers/server/relationships";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});


export const sendImage = mutation({
  args: { storageId: v.id("_storage"), author: v.string() },

  handler: async (ctx, args) => {
  const user = await getCurrentUserOrThrow(ctx)
    await ctx.db.insert("images", {
      body: args.storageId,
      userId: user._id,
    });
  },
});

export const del = mutation({
  args: { storageId: v.id("_storage"), imageId: v.id("images") },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.imageId)
  return await ctx.storage.delete(args.storageId)
  },
});


export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const images = await getManyFrom(ctx.db, "images", "userId", user._id);
    return Promise.all(
      images.map(async (img) => ({
        ...img,
        url: await ctx.storage.getUrl(img.body),
        storageId: img.body, // Include the storageId for deletion
      }))
    );
  },
});