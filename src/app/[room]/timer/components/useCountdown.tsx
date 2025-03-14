"use client";

import usePersistState from "@/hooks/usePersistState";
import { useEffect } from "react";
import { clearInterval, setInterval } from "worker-timers";

function useCountdown({ sec,resetDependency }: { sec: number, resetDependency?:number; }) {
  const [pause, setPause] = usePersistState(true, "pause");
  const [secLeft, setSecLeft] = usePersistState(sec, "secLeft");

  console.log(pause," pause ", secLeft)
  
  function tick() {

    setSecLeft(secLeft -1 < 0 ? 0: secLeft-1)
    
  }

  const onPause = () => {console.log("Puased");setPause(true);}
  const onPlay = () => setPause(false);
  const onReset = () => {
    setSecLeft(sec);
    setPause(true);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      if (!pause && secLeft > 0) {
        tick();
      } else if (secLeft === 0) {
          console.log("pepek")
        setPause(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secLeft,pause]); // Initialize interval only once

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
