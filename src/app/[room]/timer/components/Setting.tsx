"use client";

import {
  DialogHeader,
  DialogContent,

  DialogTitle,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";

import { Settings } from "lucide-react";

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Settings size={18} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 ">
          <div>

          <span>work</span>
          <Input
            value={workMin}
            onChange={(e) => {
              console.log(e.target.value === "", "e");
              onChangeSec(
                e.target.value === "" ? 10 : parseInt(e.target.value), "work"
              );
            }}
            type="number"
            min={10}
            />
          </div>
          <div>

          <span>break</span>
          <Input
            value={breakMin}
            onChange={(e) => {
              console.log(e.target.value === "", "e");
              onChangeSec(
                e.target.value === "" ? 10 : parseInt(e.target.value), "break"
              );
            }}
            type="number"
            min={1}
            />
            </div>
            <span className="text-xs mt-auto ">min</span>
        </div>
        <div className="flex flex-col gap-2">
          <span>mode</span>

          {/* <Toggle
            onClick={() => setMode(mode == "work" ? "break" : "work")}
            className="border-[1px]"
          >
            {mode == "work" ? "Work" : "Break"}
          </Toggle> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Setting;
