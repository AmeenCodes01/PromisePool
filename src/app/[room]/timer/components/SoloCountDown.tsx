import React, { useEffect } from 'react'
import TimerDisplay from '../../shop/components/TimerDisplay';
import { usePromiseStore } from '@/hooks/usePromiseStore';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useShallow } from 'zustand/react/shallow';
import { notifyUser } from '@/lib/notifyUser';

export default function SoloCountDown({ lastSeshRated, roomName,SettingWithProps,seshId

}:{


lastSeshRated: boolean|undefined;
roomName:string;
  seshId: Id<"sessions">| undefined,
SettingWithProps: () => React.JSX.Element;
}) {
console.log("solo")
const {
  workMin,
  onOpen,
  mode,
  breakMin,
  setGoalOpen,
  onChangeMode,
  onReset,
 onPlay,onPause,
   secLeft,
  pause

} = usePromiseStore(
 useShallow( (state) => ({
    workMin: state.workMin,
    onOpen: state.onOpen,
    mode: state.mode,
    breakMin: state.breakMin,
    setGoalOpen: state.setGoalOpen,
    onChangeMode: state.onChangeMode,
    onReset: state.onReset,
    onPlay: state.onPlay,
    onPause: state.onPause,
    secLeft:state.secLeft,
    pause:state.pause

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
    
    
  };

  const onSeshReset = async () => {
    if (mode == "work") {
      secLeft !== workMin * 60 ? await resetSesh() : null;
    }
    onPause();
    onReset()
  };




  useEffect(() => {
    if (secLeft == 0) {
      notifyUser("Break Time",`Your ${workMin}m session is over. Well done! `)
      // get progress. open progres
      if (mode == "work") {
        onOpen();
        //changed pause to stop
        onChangeMode("break",onPause);
      } else {
        onChangeMode("work",onPause);
         }

      const bell = new Audio("/bell.wav");
         console.log("Hitting useEffect")
      bell.play();
    }
  }, [secLeft]);


  const onBothCountDownPause= ()=>{
   onPause()
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
