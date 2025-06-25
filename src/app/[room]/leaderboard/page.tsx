import React from "react";
import { Board } from "./components/Table";

function Page() {
  return (
    <div className="w-full h-full flex p-4 items-start justify-center ">
      <div className="w-full   sm:ml-8 mt-2 flex flex-col gap-4 text-lg ">
        <h1>Global Leaderboard</h1>
        <div className="max-h-[600px] flex">
          <Board />
        </div>
      </div>
    </div>
  );
}

export default Page;
