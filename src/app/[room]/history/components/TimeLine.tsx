"use client"

import { Doc } from "../../../../../convex/_generated/dataModel"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Coins } from "lucide-react";


export function TimeLine({data}:{data:Doc<"sessions">[]}){
     data.reverse()
    console.log(data, "timeline data")
    return(
        <Card className=" w-[300px]  pr-4 overflow-scroll overflow-x-hidden max-h-[500px]"> 
            <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Timeline of today</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex flex-col gap-2 ">
                    {data.map((session, index) => 
                    {
                        const startTime = new Date(session._creationTime);
                        const endTime = new Date(session._creationTime + session.duration * 60000);
                        const formattedStartTime = `${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}`;
                        const formattedEndTime = `${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`;
                       

                        return(
                        <div key={index} className="flex flex-col items-start   justify-between p-2 border-b last:border-b-0">
                            <span className="text-sm text-gray-500">{formattedStartTime}</span>
                            <div className="flex flex-row gap-8 items-center w-full justify-between pl-3 border-l-2 py-3">

                            <span className="text-sm">{session.duration}m</span>
                            <span className="text-sm">{session.rating} <span className="text-[10px] text-muted-foreground ">/ 10</span> </span>
                            <span className="text-sm">{session.pCoins} <Coins size={12}/></span>
                            </div>
                            <span className="text-sm text-gray-500">{formattedEndTime}</span>
                        </div>
                    )
                    }
                    )}
                </div>
            </CardContent>
        </Card>
    )
}