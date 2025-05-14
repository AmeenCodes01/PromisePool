import { Flower } from "lucide-react";
import React from "react";
import InfoDialog from "./InfoDialog";

async function page({
  params,
}: {
  params: Promise<{ room: string }>
}) {
  const p = await params
  //get room. if room
  return <div className="w-full relative h-full justify-center items-center flex">
    <div className="absolute top-3 right-3">

    <InfoDialog title="Welcome to Your Private Room!"
    desc={
      <p>

        This is your personal space in PromisePool — a focused, distraction-free room just for you. <br/> <br/>
        <span className="italic">I'll add more to this page. For now, head over to the timer in sidebar!</span>
      </p>

}
    />
    </div>
    <span className="text-3xl font-bold flex flex-row ">

Welcome to your private room {p.room} <Flower className="ml-2 mt-auto"/> 
    </span>
  </div>;
}

export default page;
