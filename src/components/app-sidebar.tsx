import {
  Calendar,
  ChevronDown,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
  Store,
  Phone,
  HomeIcon
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import RoomDropDown from "./RoomDropDown";
import { useParams } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { usePromiseStore } from "@/hooks/usePromiseStore";
import { Doc, Id } from "../../convex/_generated/dataModel";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  // {
  //   title: "Map",
  //   url: "/map",
  //   icon: Inbox,
  // },
  {
    title: "Timer",
    url: "/timer",
    icon: Calendar,
  },
  {
    title: "Leaderboard",
    url: "/leaderboard",
    icon: Search,
  },
  {
    title: "History",
    url: "/history",
    icon: Settings,
  },
  {
    title: "Shop",
    url: "/shop",
    icon: Store,
  },
  {
    title: "Call",
    url: "/pixelcam",
    icon: Phone,
  },
];

const timer = [
  {
    title: "Timer",
    url: "/timer",
    icon: Calendar,
  },
]

export function AppSidebar() {
  // if no room is chosen, default is user name. for that, we need user from clerk/convex? 
  const user = useQuery(api.users.current)
  const params = useParams()
  const [inRoom,setInRoom]= useState<Doc<"rooms">| undefined>()

  const room = useQuery(api.rooms.getOne, {id:params.roomId ? params.roomId as Id<"rooms"> : user?.roomId as Id<"rooms">})
  const { signOut } = useAuthActions();

  useEffect(() => {
    if (room) {
      // If params.room is defined, use it
      setInRoom(room);
    }
  }, [params.roomId, room]);

   const {secLeft, pause, workMin , mode} = usePromiseStore((state) => state);
  
    
  //const data =  (mode=="work"&& (!pause ||( workMin * 60 !== secLeft && secLeft!==undefined))) ? timer:items
  const data = items
  // const handleRoomClick = (roomName: string) => {
  //     if (!pause ||( workMin * 60 !== secLeft && secLeft!==undefined)) {
  //       } else {
  //         }
  //   };
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
              <RoomDropDown inRoom={inRoom??undefined} setInRoom={setInRoom} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={"/"+inRoom?._id + "/" + item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className=" justify-end flex">
            <ModeToggle />
          </SidebarMenuItem>
          <SidebarMenuItem className=" justify-end flex">
            <Button  onClick={() => void signOut()}>

          <LogOut />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
