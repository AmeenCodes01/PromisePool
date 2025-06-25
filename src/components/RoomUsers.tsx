"use client";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../convex/_generated/api";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Users } from "lucide-react";
function RoomUsers({ name }: { name: string }) {
  const users = useQuery(api.roomUsers.get, { name });
  const { theme } = useTheme();
  const user = useQuery(api.users.current);

  return (
    <Sheet>
      <SheetTrigger>
        <Button className="text-xs " size={"sm"}>
          Room Users
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px]   overflow-y-auto ">
        <SheetHeader>
          <SheetTitle>Users in room</SheetTitle>
        </SheetHeader>

        <div className=" flex flex-col  w-full  mt-4 gap-3 ">
          {users?.map((u, i) => (
            <div
              className="p-2 w-full min-w-[150px] rounded-sm bg-cover"
              key={u._id}
              style={{
                backgroundImage: `url(${theme == "dark" ? (i % 2 == 0 ? "/black_1.jpg" : "/black_2.jpg") : i % 2 == 0 ? "/white_1.jpg" : "/white_2.jpg"})`,
              }}
            >
              <span className="font-mono    ">{u.name}</span>
            </div>
          ))}

          <div className="min-h-20"></div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default RoomUsers;
