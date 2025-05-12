"use client";
import React from "react";
import PromiseDialog from "./PromiseDialog";

import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import CoinBar from "./CoinBar";
import { Plus } from "lucide-react";
import CardList from "./CardList";
import { Button } from "@/components/ui/button";

function Reward() {
  const user = useQuery(api.users.current);
  const rewards = useQuery(api.rewards.get)
  const create = useMutation(api.rewards.create);
  const createReward = (title: string, price: number) => {
    create({ title, price });
  };
  return (
    <div className=" ">
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
            <PromiseDialog.CoinsInput title="price" />
            <PromiseDialog.Btn />
          </PromiseDialog>
        </div>
        <CoinBar coins={user?.wCoins} />
      </div>
        <CardList wCoins={user?.wCoins ?? 0} data={rewards as Doc<"rewards">[]} type="rewards"/>
    </div>
  );
}

export default Reward;

// reward has unlock part feature. user specifies as lock/unlock.
