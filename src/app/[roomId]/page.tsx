import { Flower } from "lucide-react";
import React from "react";
import InfoDialog from "./InfoDialog";
import CheckPrivate from "./CheckPrivate";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { Id } from "../../../convex/_generated/dataModel";
import ShareLink from "./ShareLink";

async function Page({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const p = await params
  //get room. if room

  // join room & send heartbeat
const token = await convexAuthNextjsToken();

   const room = await fetchQuery(api.rooms.getOne, {id:p.roomId as Id<"rooms">},{token})
const user= await fetchQuery(api.users.current, {},{token})
  return <div className="w-full relative h-full justify-center items-center flex flex-row">
    <CheckPrivate roomId={p.roomId} />

    
    <div className="absolute top-3 right-3 flex flex-row gap-4">
    {room?.type !=="private" && <ShareLink roomId={p.roomId} password={room?.password}/>}
      <InfoDialog title={`Welcome to  ${room?.type === "private"?"Your Private": room?.type==="group"?"Your Private Group":room?.name} Room!`}
        desc={
          <p>

           {room?.type !=="public" ?`This is your personal space in PromisePool — a focused, distraction-free room just for you${room?.type ==="group" ? " & your friends. Invite them over!":"."} ` :"" }<br /> <br />
            <span className="italic">I'll add more to this page. For now, head over to the timer in sidebar!</span>
          </p>

        }
      />
    </div>
    <span className="text-3xl font-bold flex flex-row ">

      Welcome to {room?.name},  {user?.name} <Flower className="ml-2 mt-auto" />
    </span>
  </div>;
}

export default Page;
