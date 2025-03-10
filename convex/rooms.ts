import { ConvexError, v } from "convex/values";
import { query, mutation, MutationCtx } from "./_generated/server";
import { getAll, getOneFrom } from "convex-helpers/server/relationships";
import { Id } from "./_generated/dataModel";
import { getCurrentUserOrThrow } from "./users";


export const get = query({
    handler: async ({db})=>{
        const allRooms = await db.query("rooms").collect()
        return allRooms
    }

})

export const create = mutation({
    args:{name:v.string(),
      
        password:v.optional(v.string()),
        type: v.union(

            v.literal("private"), //default room
            v.literal("public"), //streamer's room
            v.literal("group"), // friends created room.
            
             
          ) 
    },
    handler: async (ctx,{name, type, password})=>{
        const user = await getCurrentUserOrThrow(ctx)
        const existingRoom = await ctx.db.query("rooms")
        .filter(q => q.eq(q.field("name"), name))
        .unique();
  
      if (existingRoom) {
        throw new ConvexError({message:"Room with this name already exists"});
      }
  
        await createRoom(ctx,name, user._id, type,password)
    }
})

export const getOne = query({
  args: {name:v.string()},
  handler: async (ctx,{name})=>{
   const room = await getOneFrom(ctx.db, "rooms","name", name);
   return room;
  }
})



export async function createRoom(ctx:MutationCtx,name:string,id:Id<"users">, type:"private" | "public" | "group", password?:string){
    
 return   await ctx.db.insert("rooms",{name, owner_id:id, type:type, password:password })
}