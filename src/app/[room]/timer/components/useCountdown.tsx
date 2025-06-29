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
    console.log("run")
    if (pause) return;

    if (secLeft <= 1) {
      setPause(true);
      setSecLeft(room, 0);
    } else {
      console.log(room, " decrement room");
      decrement(room);
    }
  };

  const onPause = () => {
    setPause(true);
  };

  const onPlay = () => {
    setPause(false);
  };

  const onReset = () => {
    setSecLeft(room, sec);
    setPause(true);
  };

  // Handle interval based on pause & room
  useEffect(() => {
    // If paused, clear existing interval
    if (pause) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // If not paused, start ticking
    intervalRef.current = setInterval(() => {
      tickRef.current();
    }, 1000);

    // Cleanup when room changes or on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pause, room]);

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
