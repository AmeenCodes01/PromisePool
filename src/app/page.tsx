
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import {redirect} from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export default async function Home() {
console.log("so ig this is running ?")

const token = await convexAuthNextjsToken();
if(!token){
  return null
}
const user= await fetchQuery(api.users.current, {},{token})
if(user){

  redirect(`/${user?.roomId}`)
}
  //redirect to user default room. we get that by intaking room.
  //migrating: we need to use roomId. 

}
