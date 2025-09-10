import React, { useEffect } from 'react'
import TimerDisplay from './TimerDisplay';
import { usePromiseStore } from '@/hooks/usePromiseStore';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useShallow } from 'zustand/react/shallow';
import { notifyUser } from '@/lib/notifyUser';
import usePersistState from '@/hooks/usePersistState';
import { Button } from '@/components/ui/button';
import { on } from 'events';

export default function SoloCountDown({ lastSeshRated, roomId,SettingWithProps,seshId

}:{


lastSeshRated: boolean|undefined;
roomId:string;
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
  pause,
  onPlayStopWatch,
  setSecLeft,
  stopWatch,
  toggleStopWatch

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
    pause:state.pause,
    onPlayStopWatch:state.onPlayStopWatch, 
    setSecLeft: state.setSecLeft,
  stopWatch:state.stopwatch,
  toggleStopWatch:state.toggleStopWatch

  }))
);

  const playing = secLeft !== 0 && mode === "work" && secLeft !== workMin * 60;



const startSesh = useMutation(api.sessions.start);
const resetSesh = useMutation(api.sessions.reset);

const onSeshStart = async () => {
    // call convex function. if returns true, start session.
    if (mode == "work" && secLeft == workMin * 60) {
      if (lastSeshRated === true || (lastSeshRated === undefined&& seshId==undefined)) {
        const result = await startSesh({
          duration: stopWatch ? undefined: workMin,
          roomId: roomId as Id<"rooms">,
        });
        setGoalOpen(true)
      } else {
        onOpen();
      return  
      }
      
      // if rating required, then update workMin to match.
    }
    // if(stopWatch){
    // !playing ? setSecLeft(1) : null 
    //   onPlayStopWatch();
    //   return
    // }
    onPlay();
    
    
  };
console.log(stopWatch, " stpwtch")
  const onSeshReset = async () => {
    if (mode == "work") {
      secLeft !== workMin * 60 ? await resetSesh() : null;
    }
    onPause();
    onReset()
  };




  useEffect(() => {
    if (secLeft == 0&& !stopWatch) {
      
      notifyUser(`${mode=="work" ? "Break":"Work/Study"} Time`,`Your ${mode=="work" ?workMin:breakMin}m ${mode=="work"? "session":"break"} is over. Well done!`)
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
    <div className='flex  flex-col p-2 '>
  <div className="flex flex-row sm:flex-row  items-center self-center mb-2 gap-2  ">
          <Button
            className="text-xs  border-[2px]"
            disabled={playing}
            variant={stopWatch ? "outline" : "default"}
            onClick={() => toggleStopWatch()}
          >
            Countdown
          </Button>
          <Button
            className="text-xs border-[2px]  "
            variant={!stopWatch ? "outline" : "default"}
            onClick={() => toggleStopWatch()}
            disabled={playing}
          >
            Stopwatch
          </Button>
          <div className={`${playing ? "opacity-50" : ""}`} aria-disabled={!pause}>
  
</div>
        </div>
      <TimerDisplay
    SettingWithProps={SettingWithProps}
    pause={pause}
    showExitBtn={false}
    onPause={onBothCountDownPause}
    onSeshStart={onSeshStart}
      onSeshReset={onSeshReset}
      roomId={roomId}
      onStopWatchEnd= {
      ()=>{
        onPause();
        onOpen()
      }
      }
      />
      
    </div>
  )
}
