import SessionTimer from "./components/SessionTimer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Stream from "./components/Stream";

// hook gives all countdown functionality. handle end session/rat e session here.
async function page({children, params}: {children: React.ReactNode,params: Promise<{ room: string }>}) {
  const p = await params
 
  return (
    <div className="w-full h-full flex flex-col-reverse sm:flex-row justify-center items-center sm:p-0 pt-8  ">
      {/* Video */}
      <div className="flex flex-1  w-full h-full">{/* Yt video embed, simple */}

      <Stream/>

      </div>
      {/* Timer */}
      <div className="flex flex-1  w-full h-full  sm:justify-center items-center    ">

      <Tabs defaultValue="pomodoro" className="">
   <TabsList className="flex  justify-self-center ">
    <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
    {/* <TabsTrigger value="record">Record</TabsTrigger> */}
  </TabsList>
  {/* <TabsContent value="record">Make changes to your account here.</TabsContent> */}
  <TabsContent value="pomodoro">

      <SessionTimer room={p.room}/>
  </TabsContent>
</Tabs>
      </div>

   
    </div>
  );
}

export default page;
