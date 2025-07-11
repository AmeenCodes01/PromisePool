"use client";
import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PromiseSec from "./components/PromiseSec";
import RewardSec from "./components/RewardSec";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import OfflineHours from "./components/OfflineHours";

function Page() {
  return (
    <div className="w-full h-full relative  flex p-4 justify-center ">
      <Tabs defaultValue="promise" className=" w-full h-full ">
        <TabsList className="flex  justify-self-center ">
          <TabsTrigger value="promise">Promises</TabsTrigger>
          <TabsTrigger value="reward">Rewards</TabsTrigger>
        </TabsList>
        <TabsContent value="promise">
          <PromiseSec />
        </TabsContent>
        <TabsContent value="reward">
          <RewardSec />
        </TabsContent>
      </Tabs>
      {/*Watch coins*/}
      <div className="absolute bottom-10 right-0 m-0 bg-accent  rounded-md">
       
          <OfflineHours />
      </div>
    </div>
  );
}
export default Page;
