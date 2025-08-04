import React from "react";
import Cam from "./Cam";

async function Page({
  params,
}: {
  params: Promise<{ room: string }>
}) {
  const p =  await params
  //get room. if room
console.log(p.room," room")
  // join room & send heartbeat



  return <div className="w-full relative h-full justify-center items-center flex">
   <Cam room={p.room}/>
  </div>;
}

export default Page;
