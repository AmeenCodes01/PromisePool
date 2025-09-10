import Password from "./CustomProfile"
import { convexAuth } from "@convex-dev/auth/server";
import { MutationCtx } from "./_generated/server";
import { PSpromise } from "./promises";
import { createRoom } from "./rooms";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password], // Or your CustomPassword provider
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) {
        return args.existingUserId;
      }
      if (!args.profile.name) {
        console.error("No name in profile", args.profile);
      }
      console.log(args.profile.name,"name")
      console.log("e n a u")
      const userId = await ctx.db.insert("users", {
        name: args.profile.name,
        email: args.profile.email,
      });

      await PSpromise(ctx,userId);
      await createRoom(ctx,args.profile.name as string,userId,"private","init")

      return userId
    },
  },
});