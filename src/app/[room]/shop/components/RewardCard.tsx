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
  wCoins,
}: {
  reward: Doc<"rewards">;
  wCoins: number;
}) {
  const [finished, setFinished] = useState(reward.finished);
  const edit = useMutation(api.rewards.edit);
  const del = useMutation(api.rewards.del);
  const unlock = useMutation(api.rewards.unlock);

  const onEdit = (title: string, coins: number) => {
    console.log(coins);
    edit({ title, price: coins, finished, rId: reward._id });
    //  edit({title, rId:reward._id})
  };
  const onDel = () => del({ rId: reward._id });

  const onUnlock = () => {
    console.log(wCoins, "unlock");
    if (wCoins >= reward.price) {
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
      
          <PromiseDialog.CoinsInput title="Price"  />

          
          {/* <div className="flex flex-row gap-2 items-center text-sm">
            Finished :
          <Switch onClick={() => setFinished((prev) => !prev)}>
          </Switch>
            
             {finished ? "true" : "false"}

          </div> */}
          <div className="flex flex-row gap-2 justify-end">
            <PromiseDialog.Btn />
            <PromiseDialog.Btn
              customBtnTitle={"Delete"}
              customOnClick={onDel}
            />
          </div>
        </PromiseDialog>
        <div className=" items-center justify-center p-[10px] h-[90%] flex flex-col text-md   ">
          <span className="text-center flex flex-col text-accent-content tracking-wide">
            <span className="italic">{reward.title}</span>
           
            <span className="flex flex-row items-center gap-2"> <Unlock size={14}/> {reward.partsUnlocked}</span>
          </span>
        </div>
        <div className=" w-[100%] p-[5px] flex  flex-row gap-[10px] items-center justify-between bg-neutral text-white ">
         <span className="text-yellow-600">
           {reward.price}
          </span>
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
