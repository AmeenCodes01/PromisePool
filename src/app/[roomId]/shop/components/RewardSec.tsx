"use client";
import React, { useState } from "react";
import PromiseDialog from "./PromiseDialog";

import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import CoinBar from "./CoinBar";
import { Plus } from "lucide-react";
import CardList from "./CardList";
import { Button } from "@/components/ui/button";
import InfoDialog from "../../InfoDialog";
import { Input } from "@/components/ui/input";
import calcRewards from "@/lib/calcReward";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ConfirmDialog";

function RewardSec() {
  const [hours, setHours] = useState(0);
  const [rating, setRating] = useState<string|number>(7);
  const [showPrice, setShowPrice] = useState(false);
  const user = useQuery(api.users.current);
  const rewards = useQuery(api.rewards.get);
  const create = useMutation(api.rewards.create);
  const resetCoins = useMutation(api.rewards.resetCoins);

  const createReward = (title: string, price: number) => {
   typeof rating =="number" && create({ title, price, hours, rating });
  };
  return (
    <div className=" ">
      <div className=" ml-auto w-fit flex z-[1000]">
        <InfoDialog
          title="Welcome to Shop's Rewards section"
          desc={
            <>
              <p className="italic">
                🎉 Rewards — Stuff You Actually Want <br />
                This is your little stash of things to look forward to. <br />
                Add whatever you love — a K-drama episode, a gaming session, a
                snack run, or even just a nap. Set a coin price for it, and when
                you’ve earned enough coins (by studying, working, or smashing
                your tasks), you unlock it. <br />
                <br />
                Simple. Fun. A good excuse to treat yourself only when you’ve
                earned it. <br /> <br />
                <span className="text-green-400 text-sm">
                  Even if you don't use this timer, you can get coins by
                  submitting offline hours + rating by the "Submit offline
                  hours" button bottom-right".
                </span>
              </p>
            </>
          }
        />
      </div>
      <div className="w-full flex flex-row p-2 justify-between   ">
        <div className="self-center my-auto">
          <PromiseDialog
            maxCoins={user?.wCoins as number}
            icon={
              <Button className="text-sm">
                <Plus />
                Create
              </Button>
            }
            header={"Create new reward"}
            btnTitle="Create"
            onClick={createReward}
          >
            <PromiseDialog.NameInput />

            <div className="my-2">
              <span className="font-lightbold text-sm">
                Total Hours studied
              </span>

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
    if (!isNaN(num) && num <= 10) {
      setRating(num);
    }
  }}
            />
            </div>

            <span className="text-sm opacity-80">
              Price (coins required):{" "}
              {calcRewards(hours * 60, rating as number)}
            </span>
            <PromiseDialog.Btn
              wCoins={calcRewards(hours * 60, rating as number)}
            />
          </PromiseDialog>
        </div>
        <div className="flex flex-row gap-2 w-fit h-fit">
          <Dialog >
            <DialogTrigger className="mt-auto" asChild={true}>
              <Button
                className="text-xs "
                variant={"secondary"}
                size={"sm"}
              >
                Reset Reward Coins
              </Button>

            </DialogTrigger>
              <ConfirmDialog
                title="Reset Reward Coins "
                onConfirm={() => {
                  resetCoins()
                }}
                desc="Reset Reward Coins to 0 ? So you can start from scratch again to earn the next reward. "
              />
          </Dialog>
          <CoinBar coins={user?.wCoins} />
        </div>
      </div>
      <CardList
        coins={user?.wCoins ?? 0}
        data={rewards as Doc<"rewards">[]}
        type="rewards"
      />
    </div>
  );
}

export default RewardSec;

// reward has unlock part feature. user specifies as lock/unlock.
