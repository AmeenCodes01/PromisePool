import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendImage = mutation({
  args: { storageId: v.id("_storage"), title: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("emojis", {
      body: args.storageId,
      title: args.title,
    });
  },
});
