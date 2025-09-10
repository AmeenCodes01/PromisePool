import React from "react";

import CheckPrivate from "./CheckPrivate";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import PromiseCircle from "./PromiseCircle";
import RoomLog from "@/components/RoomLog";
import { notFound } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";

export default async function layout({ children, params }: { children: React.ReactNode, params: Promise<{ roomId: string }> }) {
  const p = await params
  const roomInfo = await fetchQuery(api.rooms.getOne, { id: p.roomId as Id<"rooms"> })

  if (!roomInfo) {
    console.log("inside")
    notFound()

  }

  return <div className="w-full  flex flex-1 px-2 ">
    <RoomLog roomId={p.roomId} />

    <main
      className="flex  w-full h-full 
              ">
      <CheckPrivate roomId={p.roomId} />
      {children}

      <PromiseCircle />

    </main>

  </div>;
}
