import React from "react";

async function page({
  params,
}: {
  params: Promise<{ room: string }>
}) {
  //get room. if room
  return <div className="w-full h-full">
    This is your private room.
  </div>;
}

export default page;
