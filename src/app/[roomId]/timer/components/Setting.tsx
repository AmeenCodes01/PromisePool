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
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { usePromiseStore } from "@/hooks/usePromiseStore";

import { Settings } from "lucide-react";
import { useState } from "react";

function Setting({
  onChangeSec,
  participant,
}: {
  onChangeSec: (sec: number, type: "break" | "work") => void;
  participant: boolean;
}) {
  const { workMin, breakMin, playTick, setPlayTick, secLeft, mode,  } = usePromiseStore(
    (state) => state
  );
  const [work, setWork] = useState(workMin);
  const [brk, setBrk] = useState(breakMin);
  const playing = secLeft !== 0 && mode === "work" && secLeft !== workMin * 60;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button disabled={participant || playing }>
          <Settings size={18} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex  gap-2  justify-between ">
          <div className="flex flex-col gap-[1px]">
            <span className="">work</span>
            <Input
              value={work}
            onChange={(e) => {
    const value = e.target.value;
    if (value === "") {
      setWork(0); // allow empty temporarily
    } else {
      setWork(parseInt(value));
    }
  }}
  onBlur={() => {
    // enforce minimum 1 on blur
    if (!work || isNaN(work) || work <= 0) {
      setWork(1);
    }
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
                setBrk(e.target.value === "" ? 0 : parseInt(e.target.value));
              }}
              onBlur = {()=>{
                if (!brk || isNaN(brk) || brk <= 0) {
      setBrk(1);
    }
              }}
              type="number"
              min={1}
            />
            <span className="text-xs text-gray-400 ">min</span>
          </div>
        </div>
        <div className="flex flex-row items-center gap-3">
          <span className="text-sm ">Play ticking sounds</span>
          <Switch
            checked={playTick}
            onCheckedChange={() => setPlayTick(!playTick)}
          />
        </div>

        <DialogClose asChild>
          <Button
            onClick={() => {
            workMin !== work ?   onChangeSec(work, "work"):null
            breakMin !== brk ?  onChangeSec(brk, "break"):null
            
            }}
          >
            Done
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default Setting;
