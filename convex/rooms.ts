import { v } from "convex/values";
import { query, mutation, MutationCtx } from "./_generated/server";
import { getAll } from "convex-helpers/server/relationships";
import { Id } from "./_generated/dataModel";


export const get = query({
    handler: async ({db})=>{
        const allRooms = await db.query("rooms").collect()
        return allRooms
    }

})

export const create = mutation({
    args:{name:v.string(),
        id:v.id("users")
    },
    handler: async (ctx,{name,id})=>{
        await createRoom(ctx,name, id)
    }
})

export async function createRoom(ctx:MutationCtx,name:string,id:Id<"users">){
    
 return   await ctx.db.insert("rooms",{name, owner_id:id})
}