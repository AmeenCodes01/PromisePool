import {
  Calendar,
  ChevronDown,
  Home,
  Inbox,
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

import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogTrigger } from "./ui/dialog";
import CreateRoomDialog from "./CreateRoomDialog";

// Menu items.
const items = [
  {
    title: "Map",
    url: "/map",
    icon: Inbox,
  },
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

export function AppSidebar() {
  
  const rooms = useQuery(api.rooms.get);
  const inRoom = rooms ? rooms[0]?.name : "citrus"
  console.log("re render")
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
                <Dialog>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Select Room
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width] z-[100] bg-green-900 rounded-b-[3px] p-1  ">
                {rooms?.map((room) => (
                  <Link href={`/${room.name}/timer`} key={room._creationTime}>
                    <DropdownMenuItem>
                      <span>{room.name}</span>
                    </DropdownMenuItem>
                  </Link>
                ))}
                <DialogTrigger asChild>
                <DropdownMenuItem>
                  Open
                </DropdownMenuItem>


                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
                <CreateRoomDialog/>
                </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
            <UserButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
