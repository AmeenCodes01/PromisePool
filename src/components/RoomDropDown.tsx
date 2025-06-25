"use client"
import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogTitle, DialogTrigger } from "./ui/dialog";
import { SidebarMenuButton } from './ui/sidebar';
import { ChevronDown,  } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import CreateRoomDialog from './CreateRoomDialog';
import Link from 'next/link';

  
function RoomDropDown({inRoom, setInRoom}:{inRoom:string | undefined;
    setInRoom:(new_state: string | undefined) => void
}) {
      const [open, setOpen]= useState(false)
      const onCreated = ()=> setOpen(false)
      const rooms = useQuery(api.rooms.get);

  return (
    <Dialog open={open} onOpenChange={setOpen} >
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton>
          Selected Room : {inRoom}
          <ChevronDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-popper-anchor-width) z-100  rounded-b-[3px] p-1  ">
      <Accordion type="multiple"  >
<AccordionItem value="item-1">
<AccordionTrigger>Public</AccordionTrigger>
<AccordionContent>
        {rooms?.public.map((room) => 

        (
            
            <Link href={`/${room?.name}/timer`} key={room?._creationTime} onClick={()=>setInRoom(room.name)}>
              <DropdownMenuItem onClick={()=>setInRoom(room.name)}>
                <span>{room?.name}</span>
              </DropdownMenuItem>
            </Link>
          )
        
        )}
</AccordionContent>
</AccordionItem>
<AccordionItem value="item-2">
<AccordionTrigger>Groups</AccordionTrigger>
<AccordionContent>
        {rooms?.groups.map((room) => 

        (
            
            <Link href={`/${room?.name}/timer`} key={room?._creationTime} onClick={()=>setInRoom(room?.name ?room?.name:"")}>
              <DropdownMenuItem>
                <span>{room?.name}</span>
              </DropdownMenuItem>
            </Link>
          )
        
        )}
</AccordionContent>
</AccordionItem>
</Accordion>
        <DialogTrigger asChild>
        <DropdownMenuItem className='bg-primary'>
          Create room
        </DropdownMenuItem>


        </DialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>
        <CreateRoomDialog onCreated={onCreated}/>
        </Dialog>
  )
}

export default RoomDropDown
