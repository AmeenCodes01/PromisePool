"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { SidebarMenuButton } from "./ui/sidebar";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CreateRoomDialog from "./CreateRoomDialog";
import Link from "next/link";
import { usePromiseStore } from "@/hooks/usePromiseStore";
import ConfirmDialog from "./ConfirmDialog";
import { DialogContent } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

function RoomDropDown({
  inRoom,
  setInRoom,
}: {
  inRoom: string | undefined;
  setInRoom: (new_state: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const onCreated = () => setOpen(false);
  const rooms = useQuery(api.rooms.get);
  const { pause, workMin,mode } = usePromiseStore(
    useShallow((state) => ({
    
  pause:  state.pause,
  workMin: state.workMin,
  mode: state.mode
  
  })));
  const secLeft = usePromiseStore(
    (state) => state.timers[inRoom as string]?.secLeft
  ) as number;

  const router = useRouter();
  const handleRoomClick = (roomName: string) => {
    if (mode=="work" && (!pause || (workMin * 60 !== secLeft && secLeft !== undefined))) {
     // setDialogOpen(true);
     alert("Please stop/reset any timers playing")
    } else {
      setInRoom(roomName);
      router.push(`/${roomName}/timer`);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              Selected Room : {inRoom}
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-popper-anchor-width) z-100  rounded-b-[3px] p-1  ">
            <Accordion type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger>Public</AccordionTrigger>
                <AccordionContent>
                  {rooms?.public.map((room) => (
                    <DropdownMenuItem
                      key={room.name}
                      onClick={() => handleRoomClick(room.name)}
                    >
                      <span>{room?.name}</span>
                    </DropdownMenuItem>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Groups</AccordionTrigger>
                <AccordionContent>
                  {rooms?.groups.map((room) => (
                    <Link
                      href={`/${room?.name}/timer`}
                      key={room?._creationTime}
                      onClick={() => setInRoom(room?.name ? room?.name : "")}
                    >
                      <DropdownMenuItem>
                        <span>{room?.name}</span>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Private</AccordionTrigger>
                <AccordionContent>
                  {rooms?.private.map((room) => (
                    <Link
                      href={`/${room?.name}/`}
                      key={room?._creationTime}
                      onClick={() => setInRoom(room?.name ? room?.name : "")}
                    >
                      <DropdownMenuItem>
                        <span>{room?.name}</span>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <DialogTrigger asChild>
              <DropdownMenuItem className="bg-primary">
                Create room
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <CreateRoomDialog onCreated={onCreated} />
      </Dialog>

      {/* Centralized Dialog */}
      {/* <Dialog open={dialogOpen} modal={true} onOpenChange={setDialogOpen}>
        <DialogContent>
          <ConfirmDialog
            title="Timer running"
            desc="Please reset/finish any ongoing session before switching."
            onConfirm={() => {
              setDialogOpen(false);
              // optionally, reset timer / leave room etc
            }}
          />
        </DialogContent>
      </Dialog> */}
    </>
  );
}

export default RoomDropDown;
