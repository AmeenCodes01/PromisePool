import React, { useRef } from 'react'
import usePersistState from './usePersistState';
import { usePromiseStore } from './usePromiseStore';


export default function useGroupCountdown(room:string) {
  const {secLeft, playTick, setSecLeft, workMin,pause,setPause } = usePromiseStore(state => state);


  const [endTime, setEndTime] = usePersistState(Date.now(), "endTime");
  

  const lastBellRef = useRef<number>(0); // Store last 15-min bell trigger in seconds

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef(endTime);
  endTimeRef.current = endTime;
  
  const startTimer = () => {
    console.log("srart timer interval")
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      const remainingTime = endTimeRef.current - Date.now();
      const remainingSec = Math.max(0, Math.round(remainingTime / 1000));
      
      setSecLeft(remainingSec);
      const tick = new Audio("/Tick.mp3");
      playTick && tick.play()

      const elapsed = workMin*60 -  secLeft 
        if (elapsed - lastBellRef.current >= 15 * 60 && playTick) {
        lastBellRef.current = elapsed;
        const bell = new Audio("/15min.mp3");
        bell.play();
      }

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
    setSecLeft(remainingSec);
    setEndTime(newEndTime);
    endTimeRef.current = newEndTime;  // Update ref immediately
    setPause(false);

    startTimer();
  };

  const onReset = () => {
    console.log("on Reset hit")
    setSecLeft( workMin * 60);
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

  return {  setSecLeft, onPlay, pause, onReset, onPause };
}
