import SessionTimer from "./components/SessionTimer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Stream from "./components/Stream";
import InfoDialog from "../InfoDialog";
import RoomUsers from "@/components/RoomUsers";

// hook gives all countdown functionality. handle end session/rat e session here.
export default async function Page({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const p = await params;

  



  return (
    <div
      className="w-full  h-full   pb-2 flex flex-col  justify-center items-center sm:p-0 pt-8  *:
    relative 
    
    "
    >
      <div className=" flex ml-auto gap-4 p-2 px-4 ">
        <RoomUsers name={p.room} />
        <InfoDialog
          title="It’s Timer Time! ⏳"
          desc={
            <>
              <p>
                Start a session, stay locked in, and make those promises count.{" "}
                <br />
                Go solo or jump into a Group Timer ( in public or group rooms)
                for extra accountability. <br />
                In the end, rate your sessions, earn Reward coins and Promise
                coins. Go to the Shop to know what these coins are about!
                <br />
                All the best!
              </p>
            </>
          }
        />
      </div>
      {/* Video */}
      {/* <div className="flex flex-1  w-full h-full">

      <Stream/>

      </div> */}
      {/* Timer */}
      <div className="flex flex-1  w-full h-full   sm:justify-center items-center    ">
        {/* <Tabs defaultValue="pomodoro" className=" w-full h-full flex flex-col"> */}
        {/* <TabsList className="  w-fit mx-auto justify-self-center justify-center ">
    <TabsTrigger value="pomodoro" className="">Pomodoro</TabsTrigger>
     <TabsTrigger value="record">Record</TabsTrigger> 
  </TabsList> */}
        {/* <TabsContent value="record">Make changes to your account here.</TabsContent> */}
        {/* <TabsContent value="pomodoro" className="w-full flex-1 "> */}

        <SessionTimer room={p.room} />
        {/* </TabsContent>
</Tabs> */}
      </div>
    </div>
  );
}
