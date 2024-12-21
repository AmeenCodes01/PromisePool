"use client";
import usePersistState from "@/hooks/usePersistState";
import  {useEffect, useState} from "react";
import {clearInterval, setInterval} from "worker-timers";

function useCountdown({min}: {min: number}) {
  const [pause, setPause] = usePersistState(true,"pause");
  const [secLeft, setSecLeft] = usePersistState(min," secLeft");

  function tick() {
    setSecLeft(secLeft - 1 < 0 ? 0 : secLeft - 1);
  }

  const onPause = () => setPause(!pause);
  const onPlay = () => {
    setPause(!pause);
  };
  const onReset = () => {
    //del Session
    setSecLeft(min);
    setPause(true);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (!pause && secLeft > 0) {
        tick();
      } else if (secLeft === 0) {
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secLeft, pause]);

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
