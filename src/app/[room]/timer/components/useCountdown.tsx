"use client";

import { usePromiseStore } from "@/hooks/usePromiseStore";
import { useEffect, useRef } from "react";
import { clearInterval, setInterval } from "worker-timers";

function useCountdown({ sec, room }: { sec: number; room: string }) {
  const { setSecLeft, decrement, pause, setPause } = usePromiseStore((state) => state);

  const secLeft = usePromiseStore((state) => state.timers[room]?.secLeft);

  const intervalRef = useRef<number | null>(null);

  // keep tick in a ref to avoid stale closures
  const tickRef = useRef(() => {});

  tickRef.current = () => {
    if (pause) return;

    if (secLeft <= 1) {
      setPause(true);
      setSecLeft(room, 0);
    } else {
      decrement(room);
    }
  };

  const onPause = () => {
    setPause(true);
  };

  const onPlay = () => {
    setPause(false);
  };

  

useEffect(() => {
  if (pause) {
    // If paused, clear the interval if it's running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return;
  }

  // Only start a new interval if one doesn't exist
  if (!intervalRef.current) {
    console.log("Interval created");
    intervalRef.current = setInterval(() => {
      tickRef.current();
    }, 1000);
  }

  // Cleanup function — clears interval on unmount or dependency change
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
}, [pause]);

  return {
    pause,
    onPause,
    onPlay,
    secLeft,
    setSecLeft,
  };
}

export default useCountdown;
