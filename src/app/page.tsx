
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import {redirect} from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export default async function Home() {

const token = await convexAuthNextjsToken();
const user = await fetchQuery(api.users.current, {},{token})
redirect(`/${user?.name}`)
  //redirect to user default room. we get that by intaking room. 
  return <div className="">

  </div>;
}
