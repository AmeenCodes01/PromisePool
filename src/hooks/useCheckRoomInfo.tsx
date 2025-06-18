import React, { useEffect } from 'react'
import { usePromiseStore } from './usePromiseStore';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';
import useGroupCountdown from './useGroupCountdown';

function useCheckRoomInfo({room,participant, onSeshStart}:{
    room:string;
    participant:boolean;
    onSeshStart:()=>void;
}) {
 

  const {setMode,setGroupSesh,onChangeMode,setSecLeft} = usePromiseStore((state) => state);

  const roomInfo = useQuery(api.rooms.getOne, { name: room }) as Doc<"rooms">;

const {onPlay} =useGroupCountdown()

  useEffect(() => {
      const status = roomInfo?.timerStatus;
      if (!roomInfo || !participant ) {
      } else {
        if (status === "running") {
          setMode("work");
          onPlay(roomInfo?.endTime as number)
          onSeshStart();
        }
  
        if (status === "ended") {
          setSecLeft(0);
          onChangeMode("break");
        }
      }
  
      if (status === "not started") {
        setGroupSesh(true);
      }
  
      // if (status === undefined  && roomInfo) {
      //   console.log("sesh reset useeffecr")
      //  onSeshReset();
      //   setGroupSesh(false);
      //   //!ownerSesh && setOwnerSesh(false);
      // }
    }, [roomInfo]);
  
  



}

export default useCheckRoomInfo
