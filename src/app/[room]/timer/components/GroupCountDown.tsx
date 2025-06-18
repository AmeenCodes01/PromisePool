import useGroupCountdown from "@/hooks/useGroupCountdown";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id, Doc } from "../../../../../convex/_generated/dataModel";
import {  usePromiseStore } from "@/hooks/usePromiseStore";
import TimerDisplay from "../../shop/components/TimerDisplay";
import useCountdown from "./useCountdown";

function GroupCountDown({
  room,
  userId,
  lastSeshRated,
  SettingWithProps
}: {
  room: Id<"rooms">;SettingWithProps: () => React.JSX.Element;
  
  

  lastSeshRated: boolean | undefined;
  userId: Id<"users">;
}) {
  const {onOpen,workMin,setWorkMin,mode,setMode,setGroupSesh,onChangeMode} = usePromiseStore((state) => state);

  const roomInfo = useQuery(api.rooms.getOne, { name: room }) as Doc<"rooms">;
  const roomId = roomInfo?._id as Id<"rooms">;

  const participant = roomInfo?.participants?.find((p) => p.id === userId)
    ? true
    : false;
  const ownerSesh = roomInfo?.session_ownerId === userId;

  const startGroupSesh = useMutation(api.rooms.startSesh);
  const endGroupSesh = useMutation(api.rooms.endSesh);

  const startSesh = useMutation(api.sessions.start);
  const resetSesh = useMutation(api.sessions.reset);
  const cancelGroupSesh = useMutation(api.rooms.cancelSesh);
  const leaveGroupSesh = useMutation(api.rooms.leaveSesh)

  const { secLeft, setSecLeft, onPlay, pause, onReset } = useGroupCountdown();
  
  // there should be option to exit group timer. 

  
  const onSeshReset = async () => {
    onReset();
    if (mode == "work") {
      secLeft !== workMin * 60 ? await resetSesh() : null;
      if(ownerSesh){

         (await cancelGroupSesh({ roomId }));
         setGroupSesh(false)
      }else{
        await leaveGroupSesh({userId,roomId})
      }
      // we should show session ongoing ig. 

    }
    
  };

  const onSeshStart = async () => {

    console.log("red okated  ",roomInfo?.endTime)
    // call convex function. if returns true, start session.
    if (mode == "work") {
      if (lastSeshRated === true || lastSeshRated === undefined) {
        const result = roomInfo.duration
          ? await startSesh({
              duration: roomInfo.duration,
              room: roomInfo.name,
            })
          : null;

       ownerSesh && await startGroupSesh({ roomId });
      } else {
        onOpen();
        if (!participant) {
          return;
        }
      }

      // if rating required, then update workMin to match.
    }

if(ownerSesh){
  const startTime = Date.now();
      const endTime = startTime + (roomInfo?.duration as number) * 60000;
      onPlay(endTime)
}
 //roomInfo?.endTime ?onPlay(roomInfo?.endTime):null;
    //  onPause()
  };

  useEffect(() => {
    if (secLeft == 0) {
      // get progress. open progres
      if (mode == "work") {
        onOpen();
        console.log("this ran")
        onChangeMode("break");
      } else {
        setWorkMin(workMin * 60);
      }

      endGroupSesh({ roomId });
      setGroupSesh(false);
      //   setOwnerSesh(false)

      const bell = new Audio("/bell.wav");

      bell.play();
    }
  }, [secLeft]);

console.log(pause," pause gct")

 useEffect(() => {
    const status = roomInfo?.timerStatus;
    if (!roomInfo || !participant ) {
    } else {
      if (status === "running") {
        console.log("hit running")
        setMode("work");
     !ownerSesh &&   onSeshStart();
        onPlay(roomInfo?.endTime as number)
      }

      if (status === "ended") {
        setSecLeft(0);
        onChangeMode("break" );
                console.log("ended ran")

        setGroupSesh(false)
      }
    }

    if (status === "not started") {
      setGroupSesh(true);
    }

    if (status === undefined  && roomInfo && !ownerSesh) {
      onSeshReset();
       setGroupSesh(false);
      //!ownerSesh && setOwnerSesh(false);
    }
  }, [roomInfo]);



  return <div>
     <TimerDisplay
        SettingWithProps={SettingWithProps}
        pause={pause}
        resetDisabled={false}
        onSeshStart={onSeshStart}
        onSeshReset={onSeshReset}
          
          />
  </div>;
}

export default GroupCountDown;
