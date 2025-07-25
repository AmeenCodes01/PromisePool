import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { Id } from "./_generated/dataModel";
import {
  getAll,
  getOneFrom,
  getManyFrom,
  getManyVia,
} from "convex-helpers/server/relationships";

export const get = query({
  args:{}, 
  handler: async (ctx, args)=>{
    const user = await getCurrentUserOrThrow(ctx)
    const sessions = await getManyFrom(ctx.db, "sessions","userId", user._id)
    return sessions
  }
})



export const start = mutation
({
  args: {
    duration: v.number(),
    room: v.string(),
    goal: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    //need to check if prev session
    const user = await getCurrentUserOrThrow(ctx)
    if (user.lastSeshRated == false){
      return {message:"previous session not rated"}
    }
    const sesh= {...args, userId:user._id}
    const sessionId = await ctx.db.insert("sessions", sesh)
    await ctx.db.patch(user._id, {lastSeshId: sessionId, lastSeshRated:false} )
   
  },
});



export const stop =  mutation({
  args: {
    duration:v.number(),
    rating: v.number(),
    pCoins: v.number(),
    wCoins: v.number(),
    goal: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    //need to check if prev session
    const user = await getCurrentUserOrThrow(ctx)
 //   await ctx.db.patch(user.lastSeshId as Id<"sessions">, args)
    await ctx.db.patch(user._id, {lastSeshRated : true, score: (user.score ?? 0) + args.pCoins,
      wCoins: (user.wCoins ?? 0) + args.wCoins,
      pCoins: (user.pCoins ?? 0) + args.pCoins,
      totalDuration: (user.totalDuration??0) + args.duration
    })
// patch session rating
    user.lastSeshId &&  await ctx.db.patch(user.lastSeshId,{rating:args.rating, goal:args.goal,
      pCoins:args.pCoins, wCoins:args.wCoins
    })
  
  },
});

export const reset =  mutation({
  args: {
   
   
  },
  handler: async (ctx, args) => {
    //need to check if prev session
    const user = await getCurrentUserOrThrow(ctx)
    if(user.lastSeshId){
//get that session and check if rated. If already rated, then don't delete
const Currentsession = await getOneFrom(ctx.db,"sessions","by_id",user.lastSeshId,"_id")

if(!Currentsession?.rating){
console.log("sesison reset & deleted")
  await ctx.db.delete(user.lastSeshId as Id<"sessions">)
  const session = await ctx.db.query("sessions").withIndex("userId", q=> q.eq("userId", user._id)).order("desc").first()
  await ctx.db.patch(user._id, {lastSeshId: session?._id ?? undefined, lastSeshRated:true })
}

}
  
  
  },
});