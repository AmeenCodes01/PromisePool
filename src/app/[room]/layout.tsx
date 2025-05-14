import React from "react";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import CheckPrivate from "./CheckPrivate";
import { Dollars } from "@/lib/utils";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import PromiseCircle from "./PromiseCircle";

export default async function layout({children, params}: {children: React.ReactNode,params: { room: string }}) {
  const p =  params
  return <div className="w-full h-full flex flex-1 pr-7 relative">

            <main
              className="flex flex-1 w-full h-full 
              ">
              <CheckPrivate room={p.room}/>
              {children}

<PromiseCircle/>
              
            </main>
   
  </div>;
}
