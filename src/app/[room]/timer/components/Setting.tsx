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
  const { workMin, breakMin, playTick, setPlayTick } = usePromiseStore(
    (state) => state
  );
  const [work, setWork] = useState(workMin);
  const [brk, setBrk] = useState(breakMin);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button disabled={participant}>
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
                isNaN(parseInt(e.target.value)) || parseInt(e.target.value) == 0
                  ? setWork(0)
                  : setWork(parseInt(e.target.value));
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
