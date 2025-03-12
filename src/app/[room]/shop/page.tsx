"use client";
import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Promise from "./components/Promise";
import Reward from "./components/Reward";

function page() {

 

  return (
    <div className="w-full h-full  flex p-4 justify-center ">
    <Tabs defaultValue="promise" className=" w-full h-full ">
      <TabsList className="flex  justify-self-center ">
        <TabsTrigger value="promise">Promises</TabsTrigger>
        <TabsTrigger value="reward">Rewards</TabsTrigger>
      </TabsList>
      <TabsContent value="promise">
        <Promise/>
      </TabsContent>
      <TabsContent value="reward">
        <Reward/>
      </TabsContent>
    </Tabs>
      {/*Watch coins*/}
    </div>
  );
}

export default page;
