import React from "react";
import Cam from "./Cam";

async function Page({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const p =  await params
  //get room. if room
  // join room & send heartbeat



  return <div className="w-full relative h-full justify-center items-center flex">
   <Cam roomId={p.roomId}/>
  </div>;
}

export default Page;
