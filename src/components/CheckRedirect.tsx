"use client"
import { useUser } from "@clerk/clerk-react";
import { redirect } from "next/navigation";

function CheckRedirect() {
    const { user } = useUser();
    console.log(user," user")

        redirect(`/${user?.username}`)
  return (
    <div>
      
    </div>
  )
}

export default CheckRedirect
