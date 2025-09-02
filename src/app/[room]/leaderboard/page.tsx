import React from "react";
import Board from "./components/Board";

async function Page({
  params,
}: {
  params: Promise<{ room: string }>
}) {

  const p = await params
  return (
    <div className="w-full h-full flex p-4 items-start justify-center ">
      
      <div className="w-full   sm:ml-8 mt-2 flex flex-col gap-4 text-lg ">
       
        <div className="max-h-[600px] flex">
          <Board room={p.room}/>
        </div>
      </div>
    </div>
  );
}

export default Page;
