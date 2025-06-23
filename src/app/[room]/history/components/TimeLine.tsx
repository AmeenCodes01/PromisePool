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
console.log(data, "timeline data")

    return(
        <Card className="w-full ">
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
                        <div key={index} className="flex items-center justify-between p-2 border-b last:border-b-0">
                            <span className="text-sm text-gray-500">{formattedStartTime} - {formattedEndTime} </span>
                            <span className="text-sm">{session.duration}m</span>
                            <span className="text-sm">{session.rating} </span>
                            <span className="text-sm">{session.pCoins} <Coins size={10}/></span>
                        </div>
                    )
                    }
                    )}
                </div>
            </CardContent>
        </Card>
    )
}