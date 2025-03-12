
import { getAuthToken } from "@/lib/auth";
import {redirect} from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export default async function Home() {

const token = await getAuthToken();
const user = await fetchQuery(api.users.current, {},{token})
redirect(`/${user?.name}`)
  //redirect to user default room. we get that by intaking room. 
  return <div className="">

  </div>;
}
