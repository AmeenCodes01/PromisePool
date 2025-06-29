import {
  Calendar,
  ChevronDown,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
  Store,
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

// Menu items.
const items = [
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
  const [inRoom,setInRoom]= useState<string| undefined>( params.room as string)
  const { signOut } = useAuthActions();
  useEffect(() => {
    if (params.room) {
      // If params.room is defined, use it
      setInRoom(params.room as string);
    } else if (user?.name) {
      // If params.room is undefined, use user.name as the default
      setInRoom(user.name);
    }
  }, [params.room, user?.name]);

   const { pause, workMin } = usePromiseStore((state) => state);
    const secLeft = usePromiseStore(
      (state) => state.timers[inRoom as string]?.secLeft
    ) as number;
  
    
  const data = !pause ||( workMin * 60 !== secLeft && secLeft!==undefined) ? timer:items
  
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
              <RoomDropDown inRoom={inRoom} setInRoom={setInRoom} />
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
                    <a href={"/"+inRoom + "/" + item.url}>
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
