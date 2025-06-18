"use client";

import { usePromiseStore  } from "@/hooks/usePromiseStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import  calcReward  from "@/lib/calcReward";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useCallback, useEffect, useState } from "react";

function ProgressDialog({
  
  duration,
onReset
}: {
  duration: number;
  onReset: ()=> void
}) {
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  
  const {isOpen,onClose} = usePromiseStore((state) => state);
  const endSesh = useMutation(api.sessions.stop)
  const resetSesh = useMutation(api.sessions.reset)

  const getReward = useCallback(()=>{
      return calcReward(60,rating as number)
  },[rating,duration])
  // calc function, api call from here as well.
  return (
    <div>
      <AlertDialog 
       
        open={isOpen}
        defaultOpen={isOpen}
      > 
        <AlertDialogContent>
          <AlertDialogTitle>Rate your session</AlertDialogTitle>

          <Input
            className=""
            type="number"
            min={1}
            max={10}
            disabled={rated}
            onChange={(e)=>setRating(e.target.value ? parseFloat(e.target.value): 0)}          />
          <span className="italic text-sm ">rate out of 10</span>
          {rated ? (
  <div className="flex flex-col">
    {(() => {
      const reward = getReward();
      return (
        <>
          <span className="text-sm opacity-80">
            promise coins: {reward}
          </span>
          <span className="text-sm opacity-80">
            watch coins: {reward}
          </span>
        </>
      );
    })()}
  </div>
) : null}
          <AlertDialogFooter className="sm:justify-end flex flex-row">
          
            <Button
            className="justify-end w-fit "
            onClick={() => {
              setRated(prev=>{
                if(!prev){
                  endSesh({rating: rating as number,pCoins: getReward(), wCoins:calcReward(duration, rating as number )   })
              return true
                }
                
                  onClose();
                
                return false
              })
              if(rated){
              onClose()
                 return; 
              }
              setRated(true);
            }}
            disabled={rating ? false : true}
          >
            {rated ?"Close":"Rate"}
          </Button>
          <Button
          disabled={rated}
          onClick={()=> {
            resetSesh()
            onReset()
            setRated(false)
            onClose()
            
            }}>Delete Sesh</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ProgressDialog;
