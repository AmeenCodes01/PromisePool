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

function ProgressDialog({ room }: { room: string }) {
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState<number | string>("");

  const {
    isOpen,
    onClose,
    workMin,
    onChangeMode,
    goal,
    onSoloReset,
    incSeshCount,
  } = usePromiseStore((state) => state);

  const { onReset: onGroupReset } = useGroupCountdown(room);

  const onReset = () => {
    onSoloReset(room);
    onGroupReset();
    onChangeMode("work");
  };

  const endSesh = useMutation(api.sessions.stop);
  const resetSesh = useMutation(api.sessions.reset);

  const getReward = useCallback(() => {
    return calcReward(workMin, rating as number);
  }, [rating, workMin]);

  return (
    <div>
      <AlertDialog
        open={isOpen}
        defaultOpen={isOpen}

        // onOpenChange={()=>{
        //   setRated(false)
        //   setRating(null)
        //   console.log("run")
        // }}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Rate your session</AlertDialogTitle>
          <span className="text-sm italic text-muted-foreground">
            If this appears before starting session, kindly rate previous
            session.
          </span>
          <Input
            className=""
            value={rating}
            type="number"
            min={1}
            max={11}
            disabled={rated}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setRating(""); // let empty value for now
                return;
              }
              const num = parseFloat(value);
              if (!isNaN(num) && num <= 10) {
                setRating(num);
              }
            }}
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
                  //means it's now rated.
                  endSesh({
                    rating: rating as number,
                    pCoins: getReward(),
                    wCoins: calcReward(workMin, rating as number),
                    duration: workMin,
                    goal,
                  });
                  setRated(true);
                  incSeshCount();
                } else {
                  setRated(false);
                  setRating("");
                  onClose();
                }
              }}
              disabled={rating !== "" ? false : true}
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
