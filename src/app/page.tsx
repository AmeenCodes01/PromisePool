
import CheckRedirect from "@/components/CheckRedirect";
import {redirect} from "next/navigation";

export default async function Home() {


  //redirect to user default room. we get that by intaking room. 
  return <div className="">

    <CheckRedirect/>
  </div>;
}
