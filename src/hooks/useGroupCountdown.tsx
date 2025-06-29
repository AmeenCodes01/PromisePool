import React, { useRef } from 'react'
import usePersistState from './usePersistState';
import { usePromiseStore } from './usePromiseStore';

export default function useGroupCountdown(room:string) {
  const { getOrCreateTimer, setSecLeft, workMin } = usePromiseStore(state => state);

  const secLeft = usePromiseStore(state=>state.timers[room]?.secLeft)

  const [pause, setPause] = usePersistState(true, "groupPause");
  const [endTime, setEndTime] = usePersistState(Date.now(), "endTime");



  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef(endTime);
  endTimeRef.current = endTime;

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const remainingTime = endTimeRef.current - Date.now();
      const remainingSec = Math.max(0, Math.round(remainingTime / 1000));

      setSecLeft(room,remainingSec);

      if (remainingSec <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setPause(true);
      }
  }, 1000);
  };

  const onPlay = (newEndTime: number) => {
    console.log("Played", newEndTime);
    const remainingTime = newEndTime - Date.now();
    const remainingSec = Math.max(0, Math.round(remainingTime / 1000));
    setSecLeft(room,remainingSec);
    setEndTime(newEndTime);
    endTimeRef.current = newEndTime;  // Update ref immediately
    setPause(false);

    startTimer();
  };

  const onReset = () => {
    console.log("Resetting");
    setSecLeft(room, workMin * 60);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPause(true);
    
  };

  const onPause = () => {
    setPause(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return { secLeft, setSecLeft, onPlay, pause, onReset, onPause };
}
