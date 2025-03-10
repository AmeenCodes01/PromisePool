import React from "react";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getAuthToken } from "@/lib/auth";
import CheckPrivate from "./CheckPrivate";

export default async function layout({children, params}: {children: React.ReactNode,params: Promise<{ room: string }>}) {
  const p = await params
  return <div className="w-full h-full flex flex-1 pr-7">

            <main
              className="flex flex-1 w-full h-full 
              ">
              <CheckPrivate room={p.room}/>
              {children}
            </main>
   
  </div>;
}
