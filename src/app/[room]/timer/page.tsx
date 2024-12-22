import SessionTimer from "./components/SessionTimer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Stream from "./components/Stream";

// hook gives all countdown functionality. handle end session/rat e session here.
function page() {
 
  return (
    <div className="w-full h-full flex justify-center items-center ">
      {/* Video */}
      <div className="flex flex-1 bg-gray-600">{/* Yt video embed, simple */}

      <Stream/>

      </div>
      {/* Timer */}
      <div className="flex flex-1  ">

      <Tabs defaultValue="pomodoro" className="">
  <TabsList>
    <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
    <TabsTrigger value="record">Record</TabsTrigger>
  </TabsList>
  <TabsContent value="record">Make changes to your account here.</TabsContent>
  <TabsContent value="pomodoro">

      <SessionTimer/>
  </TabsContent>
</Tabs>
      </div>

   
    </div>
  );
}

export default page;
