"use client";

import { usePromiseStore } from "@/hooks/usePromiseStore";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import calcReward from "@/lib/calcReward";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useCallback, useEffect, useState } from "react";
import useCountdown from "./useCountdown";
import useGroupCountdown from "@/hooks/useGroupCountdown";

function ProgressDialog() {
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState<number | null>(null);


  const { isOpen, onClose,workMin,onChangeMode,goal } = usePromiseStore((state) => state);

  const { onReset: onSoloReset } = useCountdown({ sec: workMin * 60 });
  const { onReset: onGroupReset } = useGroupCountdown();

  const onReset = () => {
    onSoloReset();
    onGroupReset();
    onChangeMode("work")
  };

  const endSesh = useMutation(api.sessions.stop);
  const resetSesh = useMutation(api.sessions.reset);

  const getReward = useCallback(() => {
    return calcReward(workMin, rating as number);
  }, [rating, workMin]);

  console.log(rating,rated,  " rating")

  return (
    <div>
      <AlertDialog open={isOpen} defaultOpen={isOpen}
      
      // onOpenChange={()=>{
      //   setRated(false)
      //   setRating(null)
      //   console.log("run")
      // }}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Rate your session</AlertDialogTitle>

          <Input
            className=""
            type="number"
            min={1}
            max={10}
            disabled={rated}
            onChange={(e) =>
             parseFloat(e.target.value) < 10 && setRating(e.target.value ? parseFloat(e.target.value) : 0)
            }
          />
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
  if (!rated) {
    endSesh({
      rating: rating as number,
      pCoins: getReward(),
      wCoins: calcReward(workMin, rating as number),
      duration:workMin,
      goal
    });
    setRated(true);
    setTimeout(() => {
      setRated(false)
        setRating(null)
      onClose()
    console.log("r")
    }, 0);
  } else {
    setRated(false)
        setRating(null)
    onClose();
  }
}}

              disabled={rating ? false : true}
            >
              {rated ? "Close" : "Rate"}
            </Button>
            <Button
              disabled={rated}
              onClick={() => {
                resetSesh();
                onReset();
                setRated(false);
                onClose();
              }}
            >
              Delete Sesh
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ProgressDialog;
