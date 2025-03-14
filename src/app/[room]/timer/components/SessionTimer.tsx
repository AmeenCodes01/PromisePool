"use client";
import React, {  useEffect, useRef, useState } from "react";
import useCountdown from "./useCountdown";
import Setting from "./Setting";
import { Play, Pause, TimerReset, Settings } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import ProgressDialog from "./ProgressDialog";
import { useMutation, useQueries, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import usePersistState from "@/hooks/usePersistState";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

function SessionTimer({room}:{room:string}) {
  const user = useQuery(api.users.current)


  const [workMin, setWorkMin] = usePersistState(60, "sec");
  const [breakMin, setBreakMin] = usePersistState(10, "breakSec");
  const [rating, setRating] = useState<number | null>(null);
  const [mode, setMode] = usePersistState<"work" | "break">("work", "mode");
  const [groupSesh,setGroupSesh]=usePersistState<boolean>(false,`${user?._id}groupSesh`)
  const [ownerSesh,setOwnerSesh]=usePersistState(false,`${user?._id}ownerSesh`)

  const roomInfo = useQuery(api.rooms.getOne,{name:room}) as Doc<"rooms">
  const roomId = roomInfo?._id as Id<"rooms">;
  const isInitialRender = useRef(true);


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
  const createGroupSesh = useMutation(api.rooms.createSesh)
  const cancelGroupSesh = useMutation(api.rooms.cancelSesh)
  const joinGroupSesh = useMutation(api.rooms.participate)
  const startGroupSesh = useMutation(api.rooms.startSesh)
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
  
  //to change time when mode changes.

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
      const result = await startSesh({ duration: workMin, room: roomInfo.name });
      console.log("Hello", groupSesh,ownerSesh)
       groupSesh && ownerSesh ? await startGroupSesh({roomId}) : null 
    


    
      console.log(result,"sesh start")
      if (result?.message) {
        console.log("prev sesh not rated");

        onOpen();
        // if rating required, then update workMin to match. 
        return;
      }
    }
    if(groupSesh){
      const remainingTime =  (roomInfo.endTime as number) - Date.now()  //in ms
      setWorkMin(remainingTime/60000)

    }
    onPlay();
  };

  const onSeshReset = async () => {
    mode == "work" && (await resetSesh());
    onReset();
  };
    const playing = secLeft !== 0 && (mode ==="work" && secLeft !== workMin*60)

  const onGroupSesh = (s:boolean)=>{
    console.log(s)
    if(s){
      setOwnerSesh(true)
      setGroupSesh(true)
      createGroupSesh({duration:workMin, roomId: roomId })
    }else{
      setOwnerSesh(false);
      setGroupSesh(false);
      cancelGroupSesh({roomId: roomId})
    }
    //a modal to ask.
  }

//change mode
const onChangeMode = (md:"work"|"break")=>{
  setMode(md)
  md === "break" ? setSecLeft(breakMin*60) : setSecLeft(workMin*60);
onPause()


  
}


  // useEffect(()=>{
  // const status = roomInfo?.timerStatus
  // console.log(roomInfo,"info")
  //  if(status=="not started"){
  //   setGroupSesh(true);
  //  } 

  //  if(status =="running"){
  //   setMode("work");
  //   const remainingTime =  (roomInfo.endTime as number) - Date.now()  //in ms
  //   // 
  //   setSecLeft(remainingTime/1000)
  //   console.log(workMin,"workMin", remainingTime/60000)
  //   onSeshStart()
    
  //  }

  //  if(status =="ended"){
  //   setSecLeft(0)
  //  }

  // }, [roomInfo])

  return (
    <div className="flex flex-col w-full h-full sm:justify-center sm:items-center border-4 p-6 rounded-md bg-green-900 border-green-700   ">
      {/* Countdown */}
      <div className="flex flex-row gap-2">




        <Toggle
        disabled={playing}
            onClick={() => onChangeMode(mode == "work" ? "break" : "work")}
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

<Switch checked={groupSesh} onCheckedChange={onGroupSesh}  id="groupSesh" />

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
{/* session must not have started. */}
      { groupSesh && !ownerSesh ?
      <div>
       <Button onClick={()=>joinGroupSesh({userId:user?._id as Id<"users">, roomId: roomId})    }>Opt in</Button>   
      </div> : null

      }
    </div>
  );
}

export default SessionTimer;
