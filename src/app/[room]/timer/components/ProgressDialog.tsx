"use client";

import { useDialog } from "@/hooks/useDialog";
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
import { calcReward } from "@/lib/calcReward";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import usePersistState from "@/hooks/usePersistState";
import { useState } from "react";

function ProgressDialog({
  rating,
  setRating,
  duration,
onReset
}: {
  duration: number;
  rating: number | null;
  setRating: React.Dispatch<React.SetStateAction<null | number>>;
  onReset: ()=> void
}) {
  const [rated, setRated] = useState(false);
  const isOpen = useDialog((state) => state.isOpen);
  const onClose = useDialog((state) => state.onClose);
  const endSesh = useMutation(api.sessions.stop)
  const resetSesh = useMutation(api.sessions.reset)
  
  //also show the amount of coins earned.
  // watch coins + money.
  // calc function, api call from here as well.
    console.log(rated)
  return (
    <div>
      <AlertDialog
        onOpenChange={() => {
        isOpen&&  setRated(false)

          onClose();
        }}
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
            onChange={(e) => setRating(parseInt(e.target.value))}
          />
          <span className="italic text-sm ">rate out of 10</span>
          {rated ? (
            <div className="flex flex-col ">
              <span className="text-sm opacity-80">
                promise coins:{"  "}
                {calcReward(3600, rating as number)}
              </span>
              <span className="text-sm opacity-80">
                watch coins:{"  "}
                {(duration / 60).toFixed(2)}
              </span>
            </div>
          ) : null}

          <AlertDialogFooter className="sm:justify-end flex flex-row">
          <Button
            className="justify-end w-fit "
            onClick={() => {
              setRated(true);
            }}
            disabled={rating ? false : true}
          >
            Rate
          </Button>
            <Button
            className="justify-end w-fit "
            onClick={() => {
              endSesh({rating: rating as number,pCoins: calcReward(duration,rating as number), wCoins:parseFloat((duration / 60).toFixed(2))   })
            //  setRated(true);
              onClose()
            }}
            disabled={rating ? false : true}
          >
            Close
          </Button>
          <Button onClick={()=> {
            resetSesh()
            onReset()
            onClose()
            }}>Delete Sesh</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ProgressDialog;
