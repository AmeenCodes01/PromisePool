"use client";

import usePersistState from "@/hooks/usePersistState";
import { useEffect } from "react";
import { clearInterval, setInterval } from "worker-timers";

function useCountdown({ sec,resetDependency }: { sec: number, resetDependency?:number; }) {
  const [pause, setPause] = usePersistState(true, "pause");
  const [secLeft, setSecLeft] = usePersistState(sec, "secLeft");

  
  function tick() {

    setSecLeft(prev=> prev -1 < 0 ? 0: prev-1)
    
  }

  const onPause = () => {setPause(true);}
  const onPlay = () => setPause(false);
  const onReset = () => {
    setSecLeft(sec);
    setPause(true);
  };

  useEffect(() => {
    if (pause || secLeft <= 0) return;
  
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [pause, secLeft]);
  
//   useEffect(() => {
//   setSecLeft(sec);
//   setPause(true);
// }, [sec]); // reset timer when mode changes


  return {
    pause,
    onPause,
    onReset,
    onPlay,
    secLeft,
    setSecLeft,
  };
}

export default useCountdown;
