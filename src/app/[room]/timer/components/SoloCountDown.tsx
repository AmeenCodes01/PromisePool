import React, { useEffect } from 'react'
import TimerDisplay from '../../shop/components/TimerDisplay';
import useCountdown from './useCountdown';
import { usePromiseStore } from '@/hooks/usePromiseStore';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import useGroupCountdown from '@/hooks/useGroupCountdown';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useShallow } from 'zustand/react/shallow';

export default function SoloCountDown({ lastSeshRated, roomName,SettingWithProps,seshId

}:{


lastSeshRated: boolean|undefined;
roomName:string;
  seshId: Id<"sessions">| undefined,
SettingWithProps: () => React.JSX.Element;
}) {
  // use the useCountDown hook here with pause,play,reset functionality
console.log("solo")
const {
  workMin,
  onOpen,
  mode,
  breakMin,
  setGoalOpen,
  onChangeMode,
  onSoloReset,
} = usePromiseStore(
 useShallow( (state) => ({
    workMin: state.workMin,
    onOpen: state.onOpen,
    mode: state.mode,
    breakMin: state.breakMin,
    setGoalOpen: state.setGoalOpen,
    onChangeMode: state.onChangeMode,
    onSoloReset: state.onSoloReset,
  }))
);

const startSesh = useMutation(api.sessions.start);
const resetSesh = useMutation(api.sessions.reset);


const onSeshStart = async () => {
    // call convex function. if returns true, start session.
    if (mode == "work" && secLeft == workMin * 60) {
      if (lastSeshRated === true || (lastSeshRated === undefined&& seshId==undefined)) {
        const result = await startSesh({
          duration: workMin,
          room: roomName,
        });
        setGoalOpen(true)
      } else {
        onOpen();
      return  
      }
      
      // if rating required, then update workMin to match.
    }
    onPlay();
  
    //  onPause()
    
    
  };

  const onSeshReset = async () => {
    if (mode == "work") {
      secLeft !== workMin * 60 ? await resetSesh() : null;
    }
    onPauseGroup();
    onSoloReset(roomName)
  };

  const { onPause, onPlay, secLeft, setSecLeft, pause } = useCountdown(
    {
      sec: mode == "work" ? workMin * 60 : breakMin * 60,
    room:roomName
    }
  );

  const {onPause:onPauseGroup}= useGroupCountdown(roomName)


  useEffect(() => {
    if (secLeft == 0) {
      // get progress. open progres
      if (mode == "work") {
        onOpen();
        onChangeMode("break",roomName,onPause);
      } else {
        onChangeMode("work",roomName,onPause);
         }

      const bell = new Audio("/bell.wav");

      bell.play();
    }
  }, [secLeft]);


  const onBothCountDownPause= ()=>{
    onPause()
  //  onPauseGroup()
  }
  
    return (
    <div>
      <TimerDisplay
    SettingWithProps={SettingWithProps}
    pause={pause}
    showExitBtn={false}
    onPause={onBothCountDownPause}
    onSeshStart={onSeshStart}
    onSeshReset={onSeshReset}
      room={roomName}
      />
    </div>
  )
}
