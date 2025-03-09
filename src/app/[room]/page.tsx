import React from "react";
import CheckPrivate from "./CheckPrivate";

async function page({
  params,
}: {
  params: Promise<{ room: string }>
}) {
  //get room. if room
const p = await params

console.log(p.room," params")
  return <div className="w-full h-full">
    <CheckPrivate room={p.room}/>
    This is your private room.
  </div>;
}

export default page;
