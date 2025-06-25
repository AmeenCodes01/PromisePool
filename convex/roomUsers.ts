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



export const join =mutation({
  args: {
    name: v.string(),
    
  },
  handler: async (ctx, args) => {
    const { name } = args;
        const room = await getOneFrom(ctx.db,"rooms", "name", name);
        const user = await getCurrentUserOrThrow(ctx);
    if (room) {
//del old rooms if exist
 const roomUser = await getOneFrom(ctx.db,"roomUsers", "userId", user._id,);
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
})


export const get = query({
args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { name } = args; 
        const room = await getOneFrom(ctx.db,"rooms", "name", name);
        const user = await getCurrentUserOrThrow(ctx);
    // don't start if one already started.
    if(!room)return;
const results = await ctx.db.query("roomUsers").withIndex("roomId", q=>
  q.eq("roomId",room._id)
).filter(q=>q.gte(q.field("lastActive"),Date.now()- 30000)).collect()

const data = await asyncMap(results,async (r)=>{
  const user = await getOneFrom(ctx.db,"users","by_id",r.userId, "_id")
  return {...r, name:user?.email}
})

return data
  },
})



export const heartbeat =mutation({
  args: {
     
  },
  handler: async (ctx, args) => {
       
        const user = await getCurrentUserOrThrow(ctx);
        const roomUser = await getOneFrom(ctx.db,"roomUsers", "userId", user._id,);
    // don't start if one already started.
    if(roomUser){

        await ctx.db.patch(roomUser._id, {
          
          lastActive: Date.now(),
          });  
        
    }
  },
})
