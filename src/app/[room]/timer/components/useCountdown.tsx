  "use client";

  import { usePromiseStore } from "@/hooks/usePromiseStore";
  import { useEffect, useRef } from "react";
  import { clearInterval, setInterval } from "worker-timers";


  function useCountdown({ sec, room }: { sec: number; room: string }) {
    const {secLeft, setSecLeft, decrement, pause, setPause, playTick } = usePromiseStore(
      (state) => state
    );

    
    const intervalRef = useRef<number | null>(null);

    // keep tick in a ref to avoid stale closures
    const tickRef = useRef(() => {});


    const lastBellRef = useRef<number>(0); // Store last 15-min bell trigger in seconds

    tickRef.current = () => {
      if (pause) return;

      if (secLeft <= 1) {
        setPause(true);
        setSecLeft(0);
      } else {
        const tick = new Audio("/Tick.mp3");
        playTick &&  tick.play();

        const elapsed = sec - secLeft;

        // Play 15-min bell every 900 seconds (15*60)
        if (elapsed - lastBellRef.current >= 15 * 60 && playTick) {
          lastBellRef.current = elapsed;
          const bell = new Audio("/15min.mp3");
          bell.play();
        }
        decrement();
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
