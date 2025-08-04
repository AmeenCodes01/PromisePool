import React from "react";
import Cam from "./camin/Cam";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const Joinbtn = ({room}:{room:string})=>{
"use client"
return (
  <Link href={`pixelcam/camin`}>
  Join Room
  </Link>
)

}


async function Page({
  params,
}: {
  params: Promise<{ room: string }>
}) {
  const p =  await params
  //get room. if room

//   // join room & send heartbeat
// const response = await fetch('http://localhost:3000/api/terminate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         // Send the room name in the request body
//         body: JSON.stringify({ roomName:"publicroom" }),
//       });



  return <div className="w-full relative h-full justify-center items-center flex">
  <Joinbtn room={p.room}/>
  </div>;
}

export default Page;
