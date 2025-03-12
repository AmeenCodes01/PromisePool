"use client"
import React, { Fragment } from "react";
import PromiseCard from "./PromiseCard";
import { Coins, Plus } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import PromiseDialog from "./PromiseDialog";
import CoinBar from "./CoinBar";
import CardList from "./CardList";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";

function Promise() {
    const user = useQuery(api.users.current);
    const promises = useQuery(api.promises.get);

    const create = useMutation(api.promises.create);
    const createPromise = async (title: string, coins: number) => {
        console.log(title, coins);
        await create({ title, coins });
      };
  return (
    <div>
        <div className="w-full flex flex-row p-2 justify-between   ">
        <div className="self-center my-auto">
          <PromiseDialog
            maxCoins={user?.pCoins as number}
            icon={<Plus />}
            header={"Create new promise"}
            btnTitle="Create"
            onClick={createPromise}
          >
            <PromiseDialog.NameInput />
            <PromiseDialog.CoinsInput />
            <PromiseDialog.Btn/>
          </PromiseDialog>
        </div>
       <CoinBar coins={user?.pCoins}/>
        {/* <span>watch coins</span>
            <div className='border-2 p-2 w-fit h-fit'>{user?.wCoins}</div> */}
      </div>
      {/* Promises */}
      <CardList data={promises as Doc<"promises">[]} type="promise"/>


    </div>
  )
}

export default Promise
