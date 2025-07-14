import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import calcRewards from "@/lib/calcReward";
import { DialogClose } from "@radix-ui/react-dialog";
import { useParams } from "next/navigation";
import { number } from "zod";


export function Coins(){
  
}


function OfflineHours() {
  const [hours, setHours] = useState(0);
  const [rating, setRating] = useState<number|string>(7);
  const [showCoins, setShowCoins]= useState(false);
  const startSesh = useMutation(api.sessions.start);
  const endSesh = useMutation(api.sessions.stop);
  
  const {room} = useParams<{room:string}>()

   const getReward = useCallback(() => {
      return calcRewards(hours*60, rating as number);
    }, [rating, hours]);
  
   
  return (
     <Dialog onOpenChange={(open)=> {
    if(!open){

      setShowCoins(false)
      setRating(7)
      setHours(2)
    }
    }
    
    }
      >
              <DialogTrigger>
                <Button>Submit offline Hours</Button>
              </DialogTrigger>
    <DialogContent className="space-y-4 flex gap-4" >
      <DialogHeader>
        <DialogTitle>Offline Study hours</DialogTitle>
        <DialogDescription className="italic text-sm">
          Add the study time you completed offline and earn your promise and
          watch coins just like usual
        </DialogDescription>
{!showCoins?
<>
        <div className="my-2">
          <span className="font-lightbold text-sm">Total Hours studied</span>

          <Input
                       value={hours}
                       type="number"
                       onBlur={(e) => {
                         const clean = e.target.value.replace(/^0+(?=\d)/, "");
                         setHours(Number(clean));
                       }}
                       onChange={(e) => setHours(Number(e.target.value) || 0)}
                     />
        </div>
        <div className="my-2 mb-3">
          <span className="font-lightbold text-sm">
            Average Rating ( out of 10 )
          </span>

          <Input
            min={1}
            max={11}
            value={rating}
            onChange={(e) => {
    const value = e.target.value;
    if (value === "") {
      setRating(""); // let empty value for now
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) && num < 10) {
      setRating(num);
    }
  }}
            />
        </div>
          <Button
            className=""
            onClick={async () => {
              if(typeof rating === "number"){

                const coins = calcRewards(hours * 60, rating as number, true);
                await startSesh({ duration: hours * 60, room: room });
                await endSesh({wCoins:coins, pCoins:coins, rating:rating as number,duration:hours*60})
                setShowCoins(true)
              }
            }}
            >
            Submit
          </Button>
            </>
          :
          <>
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
        <DialogClose className="ml-auto w-fit h-fit ">
          <Button>Close</Button>
        </DialogClose>
            </>
          }
      </DialogHeader>
    </DialogContent>
            </Dialog>

  );
}

export default OfflineHours;
