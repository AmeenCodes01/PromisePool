"use client"
import { useUser } from "@clerk/clerk-react";
import { redirect } from "next/navigation";

function CheckPrivate({room}:{room:string}) {
    const { user } = useUser();
    console.log(user," user")
 if(user?.username !== room){

     redirect(`/${user?.username}/timer`)
 }
  return (
    <div>
      
    </div>
  )
}

export default CheckPrivate
