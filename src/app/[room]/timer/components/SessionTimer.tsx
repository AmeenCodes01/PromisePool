"use client";
import React, { use, useEffect, useState } from "react";
import useCountdown from "./useCountdown";
import Setting from "./Setting";
import { Play, Pause, TimerReset, Settings } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import ProgressDialog from "./ProgressDialog";
import { useMutation, useQueries, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import usePersistState from "@/hooks/usePersistState";
import { Toggle } from "@/components/ui/toggle";

function SessionTimer() {
  const [workMin, setWorkMin] = usePersistState(60, "sec");
  const [breakMin, setBreakMin] = usePersistState(10, "breakSec");
  const [rating, setRating] = useState<number | null>(null);
  const [mode, setMode] = usePersistState<"work" | "break">("work", "mode");
  const { onPause, onPlay, secLeft, setSecLeft, pause, onReset } = useCountdown(
    {
      min: mode == "work" ? workMin : breakMin,
    }
  );
  const onOpen = useDialog((state) => state.onOpen);

  const minutes = Math.floor(secLeft / 60);

  const seconds = Math.floor(secLeft % 60);
  const startSesh = useMutation(api.sessions.start);
  const resetSesh = useMutation(api.sessions.reset);
  8; // there are 2 states. (in session & paused), (stopped: paused & not Insesh)
  useEffect(() => {
    if (secLeft == 0 && mode == "work") {
      // get progress. open progres
      onOpen();
      
    }
  }, [secLeft]);
console.log(secLeft,"SECLEFT")
  useEffect(() => {
    mode == "break" ? setSecLeft(breakMin) : setSecLeft(workMin);
    onPause()
  }, [mode]);

  const onChangeSec = (min: number, type?: "work" | "break") => {
    if (type === "break") {
      setBreakMin(min);
      mode == "break" && setSecLeft(min);
    } else {
      setWorkMin(min);
      mode == "work" && setSecLeft(min);
    }
  };

  const onSeshStart = async () => {
    // call convex function. if returns true, start session.
    if (mode == "work" && secLeft == workMin) {
      const result = await startSesh({ duration: workMin, room: "vit" });
      if (result?.message) {
        console.log("prev sesh not rated");
        onOpen();
        return;
      }
    }
    onPlay();
  };

  const onSeshReset = async () => {
    mode == "work" && (await resetSesh());
    onReset();
  };

  return (
    <div className="flex flex-col">
      {/* Countdown */}
        <Toggle
            onClick={() => setMode(mode == "work" ? "break" : "work")}
            className="border-[1px] justify-center self-center justify-self-center mb-4"
          >
            {mode == "work" ? "Work" : "Break"}
          </Toggle>
      <div className="flex flex-row  justify-center items-center relative ">
        <div className="flex-shrink-0 flex">
          <span className="text-3xl">
            {minutes < 10 ? "0" + minutes : minutes}:
          </span>
          <span className="text-3xl">
            {seconds < 10 ? "0" + seconds : seconds}
          </span>
        </div>
    <div className=" pl-2">

        <Setting
          workMin={workMin}
          breakMin={breakMin}
          onChangeSec={onChangeSec}
          mode={mode}
          setMode={setMode}
          />
          </div>
      </div>
      <div className="flex flex-row gap-2 mt-4  mx-auto justify-center ">
        {pause ? (
          <Play onClick={() => onSeshStart()} />
        ) : (
          <>
            <Pause onClick={() => onPause()} />
            <TimerReset onClick={onSeshReset} />
          </>
        )}
      </div>
      {/* Play/Pause.  */}
      <ProgressDialog
        duration={workMin}
        rating={rating}
        setRating={setRating}
        onReset={onReset}
      />
    </div>
  );
}

export default SessionTimer;
