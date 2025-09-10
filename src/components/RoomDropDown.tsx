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
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";

function RoomDropDown({
  inRoom,
  setInRoom,
}: {
  inRoom: Doc<"rooms"> | undefined;
  setInRoom: (new_state: Doc<"rooms"> | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const onCreated = () => {setOpen(false)};
  const rooms = useQuery(api.rooms.get);
  const { pause, workMin, mode, secLeft } = usePromiseStore(
    useShallow((state) => ({

      pause: state.pause,
      workMin: state.workMin,
      mode: state.mode,
      secLeft: state.secLeft
    })));


  const router = useRouter();
  const handleRoomClick = (room: Doc<"rooms">) => {
    if (mode == "work" && (!pause || (workMin * 60 !== secLeft && secLeft !== undefined))) {
      // setDialogOpen(true);
      alert("Please stop/reset any timers playing")
    } else {
      setInRoom(room);
      router.push(`/${room._id}/timer`);
    }
  };
console.log(open," open")
  
  return (
    
      <Dialog open={open} onOpenChange={(s)=>setOpen(s)} >
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              Selected Room : {inRoom?.name}
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
                      key={room._id}
                      onClick={() => handleRoomClick(room)}
                    >
                      <span>{room?.name}</span>
                    </DropdownMenuItem>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Groups</AccordionTrigger>
                <AccordionContent>
                  {rooms?.groups
                    .filter((room): room is NonNullable<typeof room> => room !== null)
                    .map((room) => (
                      <Link
                        href={`/${room._id}/timer`}
                        key={room._creationTime}
                        onClick={() => setInRoom(room)}
                      >
                        <DropdownMenuItem>
                          <span>{room.name}</span>
                        </DropdownMenuItem>
                      </Link>
                    ))}

                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Private</AccordionTrigger>
                <AccordionContent>
                  {rooms?.private
                    .filter((room): room is NonNullable<typeof room> => room !== null)
                    .map((room) => (
                      <Link
                        href={`/${room._id}/timer`}
                        key={room._creationTime}
                        onClick={() => setInRoom(room)}
                      >
                        <DropdownMenuItem>
                          <span>{room.name}</span>
                        </DropdownMenuItem>
                      </Link>
                    ))}

                </AccordionContent>
              </AccordionItem>
            </Accordion>

             
             <DialogTrigger asChild >
        <DropdownMenuItem className="bg-primary">
          Create room
        </DropdownMenuItem>
      </DialogTrigger>


        



          </DropdownMenuContent>
        </DropdownMenu>

           <CreateRoomDialog onCreated={onCreated} />
        
      </Dialog>

    );
}

export default RoomDropDown;
