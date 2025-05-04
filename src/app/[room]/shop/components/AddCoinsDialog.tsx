import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import calcRewards from "@/lib/calcReward";
import { DialogClose } from "@radix-ui/react-dialog";
import { useParams } from "next/navigation";
function AddCoinsDialog() {
  const [hours, setHours] = useState(0);
  const [rating, setRating] = useState(7);
  const startSesh = useMutation(api.sessions.start);
  const endSesh = useMutation(api.sessions.stop);
  const {room} = useParams<{room:string}>()
  return (
    <DialogContent className="space-y-4 flex gap-4">
      <DialogHeader>
        <DialogTitle>Offline Study hours</DialogTitle>
        <DialogDescription className="italic text-sm">
          Add the study time you completed offline and earn your promise and
          watch coins just like usual
        </DialogDescription>

        <div className="my-2">
          <span className="font-lightbold text-sm">Total Hours studied</span>

          <Input
            value={hours}
            onChange={(e) =>
              setHours(e.target.value ? parseFloat(e.target.value) : 0)
            }
          />
        </div>
        <div className="my-2 mb-3">
          <span className="font-lightbold text-sm">
            Average Rating ( out of 10 )
          </span>

          <Input
            min={1}
            max={10}
            value={rating}
            onChange={(e) =>
              setRating(e.target.value ? parseFloat(e.target.value) : 0)
            }
          />
        </div>
        <DialogClose className="ml-auto w-fit h-fit ">
          <Button
            className=""
            onClick={async () => {
              const coins = calcRewards(hours * 60, rating, true);
              await startSesh({ duration: hours * 60, room: room });
              await endSesh({wCoins:coins, pCoins:coins, rating})
            }}
          >
            Submit
          </Button>
        </DialogClose>
      </DialogHeader>
    </DialogContent>
  );
}

export default AddCoinsDialog;
