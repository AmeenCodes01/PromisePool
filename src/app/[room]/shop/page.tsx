"use client";
import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Promise from "./components/Promise";
import Reward from "./components/Reward";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import AddCoinsDialog from "./components/AddCoinsDialog";

function page() {
  return (
    <div className="w-full h-full relative  flex p-4 justify-center ">
      <Tabs defaultValue="promise" className=" w-full h-full ">
        <TabsList className="flex  justify-self-center ">
          <TabsTrigger value="promise">Promises</TabsTrigger>
          <TabsTrigger value="reward">Rewards</TabsTrigger>
        </TabsList>
        <TabsContent value="promise">
          <Promise />
        </TabsContent>
        <TabsContent value="reward">
          <Reward />
        </TabsContent>
      </Tabs>
      {/*Watch coins*/}
      <div className="absolute bottom-10 right-0 m-4 bg-accent  rounded-md">
        <Dialog>
          <DialogTrigger>
            <Button>Submit offline Hours</Button>
          </DialogTrigger>
          <AddCoinsDialog />
        </Dialog>
      </div>
    </div>
  );
}
export default page;
