"use client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"
import BoardTable from "./BoardTable"



export default function Board({roomId}:{roomId:string}) {

const [type,setType]=useState("global")

  return (
      <Tabs defaultValue={"global"} value={type} onValueChange={value=>setType(value)} className=" flex w-full self-center items-center flex-col">
          <TabsList >
          <TabsTrigger value="room">Room</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
        </TabsList>
        <TabsContent value="room">

      <div className="w-full   sm:ml-8 mt-2 flex flex-col gap-4 text-lg ">
        
        <div className="max-h-[600px] md:h-full flex w-full">
          <BoardTable roomId={roomId} type={type}/>
        </div>
      </div>
        </TabsContent>
        <TabsContent value="global">

      <div className="w-full   sm:ml-8 mt-2 flex flex-col gap-4 text-lg ">
       
        <div className="max-h-[600px] flex">
          <BoardTable roomId={roomId} type={type}/>
        </div>
      </div>
        </TabsContent>
      </Tabs>
  )
}
