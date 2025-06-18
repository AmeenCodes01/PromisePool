"use client";

import usePersistState from "@/hooks/usePersistState";
import { usePromiseStore } from "@/hooks/usePromiseStore";
import { useEffect, useRef } from "react";
import { clearInterval, setInterval } from "worker-timers";

function useCountdown({ sec }: { sec: number }) {
  const [pause, setPause] = usePersistState(true, "pause");
  const { secLeft, setSecLeft,decrement } = usePromiseStore((state) => state);

  const pauseRef = useRef(pause);
  pauseRef.current = pause;

  function tick() {
    if (pauseRef.current) return;
console.log("Personal timer running")
    if (secLeft <= 1) {
      setPause(true);
      setSecLeft(0);
    } else {
decrement()
    }
  }

  const onPause = () => setPause(true);
  const onPlay = () => setPause(false);
  const onReset = () => {
    setSecLeft(sec);
    setPause(true);
  };

  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

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
