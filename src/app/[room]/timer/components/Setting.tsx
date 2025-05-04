"use client";

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Settings } from "lucide-react";
import { useState } from "react";

function Setting({
  workMin,
  breakMin,
  onChangeSec,
  mode,
  setMode,
}: {
  workMin: number;
  breakMin: number;
  onChangeSec: (sec: number, type: "break" | "work") => void;
  mode: "work" | "break";
  setMode: (new_state: "work" | "break") => void;
}) {
  const [work, setWork] = useState(workMin);
  const [brk, setBrk] = useState(breakMin);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Settings size={18} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2  justify-between ">
          <div className="flex flex-col gap-[1px]">
            <span className="">work</span>
            <Input
              value={work}
              onChange={(e) => {
                isNaN(parseInt(e.target.value))|| parseInt(e.target.value)==0 ?
                setWork(0)
                :
                   setWork(
                       parseInt(e.target.value)
                    )
                 
                
                  }}
              type="number"
              min={10}
            />
                      <span className="text-xs mt-auto text-gray-400 ">min</span>

          </div>
          <div className="flex  flex-col gap-[1px]">
            <span>break</span>
            <Input
              value={brk}
              onChange={(e) => {
                setBrk(
                  e.target.value === "" ? 0 : parseInt(e.target.value),
                  
                );
              }}
              type="number"
              min={1}
            />
          <span className="text-xs text-gray-400 ">min</span>
          </div>
        </div>
       
        <DialogClose asChild>

        <Button 
        onClick={()=>{
          onChangeSec(work, "work")
          onChangeSec(brk, "break")
        }}
        >Done</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default Setting;
