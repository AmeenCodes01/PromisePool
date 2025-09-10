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

    return(
        <Card className=" w-[300px]  pr-4 overflow-auto overflow-x-hidden max-h-[500px] "> 
            <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Today's sessions timeline</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex flex-col gap-2 ">
                    {
                        data.length> 0 ?
                    data.map((session, index) => 
                    {
                        const startTime = new Date(session._creationTime);
                        const endTime = new Date(session._creationTime + session.duration * 60000);
                        const formattedStartTime = `${startTime.getHours().toString().padStart(2,"0")}:${startTime.getMinutes().toString().padStart(2, '0')}`;
                        const formattedEndTime = `${endTime.getHours().toString().padStart(2,"0")}:${endTime.getMinutes().toString().padStart(2, '0')}`;
                       

                        return(
                        <div key={index} className="flex flex-col items-start   justify-between p-2 border-b last:border-b-0">
                            <span className="text-sm text-gray-500">{formattedStartTime}</span>
                            <div className="flex flex-row gap-8 items-center w-full justify-between pl-3 border-l-2 py-3">

                            <span className="text-sm">{session.duration}m</span>
                            <span className="text-sm">{session.rating} <span className="text-[10px] text-muted-foreground ">/ 10</span> </span>
                            <span className="text-sm flex flex-row  items-center justify-between gap-2 w-[30px]">{session.pCoins ?session.pCoins :0} <Coins size={12}/></span>
                            </div>
                            <span className="text-sm text-gray-500">{formattedEndTime}</span>
                        </div>
                    )
                    }
                    )
                : <span className="text-muted-foreground self-center text-sm ">No sessions today</span>
                }
                </div>
            </CardContent>
        </Card>
    )
}