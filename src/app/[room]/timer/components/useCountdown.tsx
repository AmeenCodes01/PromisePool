"use client";

import usePersistState from "@/hooks/usePersistState";
import { useEffect, useRef } from "react";
import { clearInterval, setInterval } from "worker-timers";

function useCountdown({ sec,resetDependency }: { sec: number, resetDependency:number; }) {
  const [pause, setPause] = usePersistState(true, "pause");
  const [secLeft, setSecLeft] = usePersistState(sec, "secLeft");

  // const pauseRef = useRef(pause);
  // const secLeftRef = useRef(secLeft);

  // Sync refs with state
  // useEffect(() => {
  //   pauseRef.current = pause;
  // }, [pause]);

  // useEffect(() => {
  //   secLeftRef.current = secLeft;
  // }, [secLeft]);

  // useEffect(() => {
  //   setSecLeft(sec); // Reset secLeft when sec or resetDependency changes
  // }, [sec, resetDependency]);
  
  function tick() {

    setSecLeft(secLeft -1 < 0 ? 0: secLeft-1)
    
  }

  const onPause = () => setPause(true);
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
