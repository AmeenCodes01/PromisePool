"use client";
import { useMutation } from "convex/react";
import { BadgePlus, Edit, Plus, ShoppingCart, Unlock } from "lucide-react";
import React, { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";
import PromiseDialog from "./PromiseDialog";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Dollars } from "@/lib/utils";
import calcRewards from "@/lib/calcReward";

function RewardCard({
  reward,
  coins,
}: {
  reward: Doc<"rewards">;
  coins: number;
}) {
  const [finished, setFinished] = useState(reward.finished);
  const [hours, setHours] = useState(reward.hours);
  const [rating, setRating] = useState(reward.rating);
  const edit = useMutation(api.rewards.edit);
  const del = useMutation(api.rewards.del);
  const unlock = useMutation(api.rewards.unlock);

  const onEdit = (title: string, coins: number) => {
    console.log(coins);
    edit({ title, price: coins, finished, rId: reward._id ,hours,rating});
    //  edit({title, rId:reward._id})
  };
  const onDel = () => del({ rId: reward._id });

  const onUnlock = () => {
    if (coins >= reward.price) {
      unlock({ rId: reward._id });
    } else {
      toast.error("not enough reward coins");
    }
  };
  return (
    <>
      <div
        className={`flex bg-accent flex-col h-[250px] w-[200px] flower font-serif border-1 p-1  ${reward.finished ? null : ""}`}
      >
        <PromiseDialog
          icon={<Edit className="ml-auto " size={18} />}
          header="Edit reward"
          editTitle={reward.title}
          onClick={onEdit}
          btnTitle={"Edit"}
          editCoins={reward.price}
        >
          <PromiseDialog.NameInput />

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
              onChange={(e) =>
                setRating(e.target.value ? parseFloat(e.target.value) : 0)
              }
            />
          </div>

          <span className="text-sm opacity-80">
            Price (coins required): {calcRewards(hours * 60, rating as number)}
          </span>

          {/* <div className="flex flex-row gap-2 items-center text-sm">
            Finished :
          <Switch onClick={() => setFinished((prev) => !prev)}>
          </Switch>
            
             {finished ? "true" : "false"}

          </div> */}
          <div className="flex flex-row gap-2 justify-end">
            <PromiseDialog.Btn
              wCoins={calcRewards(hours * 60, rating as number)}
            />{" "}
            <PromiseDialog.Btn
              customBtnTitle={"Delete"}
              customOnClick={onDel}
            />
          </div>
        </PromiseDialog>
        <div className=" items-center justify-center p-[10px] h-[90%] flex flex-col text-md   ">
          <span className="text-center flex flex-col text-accent-content tracking-wide">
            <span className="italic">{reward.title}</span>

            <span className="flex flex-row items-center gap-2">
              {" "}
              <Unlock size={14} /> {reward.partsUnlocked}
            </span>
          </span>
        </div>
        <div className=" w-[100%] p-[5px] flex  flex-row gap-[10px] items-center justify-between bg-neutral text-white ">
          <span className="text-yellow-600">{reward.price}</span>
          <PromiseDialog
            icon={<ShoppingCart size={18} />}
            header="Unlock"
            onClick={onUnlock}
            btnTitle={"Buy"}
          >
            <PromiseDialog.Btn />
          </PromiseDialog>
        </div>
      </div>
    </>
  );
}

export default RewardCard;
