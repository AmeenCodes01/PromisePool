"use client";
import React, {  useEffect, useState } from "react";
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
  const [seshId, setSeshId] = usePersistState<null | string>(null,"seshId")
  const { onPause, onPlay, secLeft, setSecLeft, pause, onReset } = useCountdown(
    {
      sec: mode == "work" ? workMin*60 : breakMin*60,
    }
  );
  const onOpen = useDialog((state) => state.onOpen);

  const minutes = Math.floor(secLeft / 60);

  const seconds = Math.floor(secLeft % 60);
  const startSesh = useMutation(api.sessions.start);
  const resetSesh = useMutation(api.sessions.reset);
   // there are 2 states. (in session & paused), (stopped: paused & not Insesh)
  useEffect(() => {
    if (secLeft == 0 && mode == "work") {
      // get progress. open progres
      if(mode == "work"){
        onOpen();
        setBreakMin(breakMin*60)
      }else{
        setWorkMin(workMin*60)
      }
      
      
    }
  }, [secLeft]);

  useEffect(() => {
    mode == "break" ? setSecLeft(breakMin*60) : setSecLeft(workMin*60);
    onPause()
  }, [mode]);

  const onChangeSec = (min: number, type?: "work" | "break") => {
    if (type === "break") {
      setBreakMin(min);
      mode == "break" && setSecLeft(min*60);
    } else {
      setWorkMin(min);
      mode == "work" && setSecLeft(min*60);
    }
  };
  const onSeshStart = async () => {
    // call convex function. if returns true, start session.
    if (mode == "work" && secLeft == workMin*60) {
      const result = await startSesh({ duration: workMin, room: "vit" });
      console.log(result,"sesh start")
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
    const playing = secLeft !== 0 && (mode ==="work" && secLeft !== workMin*60)
  return (
    <div className="flex flex-col sm:justify-center sm:items-center border-4 p-6 rounded-md bg-green-900 border-green-700   ">
      {/* Countdown */}
      <div className="flex flex-row gap-2">

        <Toggle
        disabled={playing}
            onClick={() => setMode(mode == "work" ? "break" : "work")}
            className="border-[1px] justify-center self-center justify-self-center mb-4"
            >
            {mode == "work" ? "Work" : "Break"}
          </Toggle>
          <Setting
          workMin={workMin}
          breakMin={breakMin}
          onChangeSec={onChangeSec}
          mode={mode}
          setMode={setMode}
          />
          </div>
      <div className="flex flex-row  justify-center items-center relative ">
        <div className="flex-shrink-0 flex">
          <span className="text-4xl font-mono">
            {minutes < 10 ? "0" + minutes : minutes}:
          </span>
          <span className="text-xl font-mono">
            {seconds < 10 ? "0" + seconds : seconds}
          </span>
        </div>
    <div className=" pl-2 ">

      
          </div>
      </div>
      <div className="flex flex-row gap-2 mt-4  mx-auto justify-center ">
        {pause ? (
          <Play onClick={() => onSeshStart()} />
        ) : (
          <>
            <Pause onClick={() => onPause()} />
            <TimerReset onClick={()=>onSeshReset()} />
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
