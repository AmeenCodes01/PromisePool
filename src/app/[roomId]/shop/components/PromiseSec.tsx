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
import { Button } from "@/components/ui/button";
import InfoDialog from "../../InfoDialog";

function PromiseSec() {
    const user = useQuery(api.users.current);
    const promises = useQuery(api.promises.get);

    const create = useMutation(api.promises.create);
    const createPromise = async (title: string, coins: number) => {
        console.log(title, coins);
        await create({ title, coins });
      };

      
  return (
    <div className="">
      <div className=" ml-auto w-fit flex z-[1000]">

      <InfoDialog title="Welcome to Shop's Promises section"
      
      desc={
        <>
        <p className="italic">
A quiet space for your personal promises — little goals, dreams, and intentions you keep for yourself. You can add coins to them, giving your promises depth, worth, and a sense of progress as you move toward them.          <br/><br/>

There’s one special collective promise here too: <br/>
“Coins for Palestine” — a shared self-promise by everyone using this platform to donate real money for Palestine.<br/><br/>

Each user decides how much they’ll pledge, and their promise adds to the total.<br/>
350 coins = $1 — and together, we track our collective intent to give.<br/><br/>

It’s not a donation platform — it’s a promise to yourself that you’ll follow through in real life.

<br/><br/>

<span className="text-green-400 text-sm">Even if you don't use this timer, you can get coins by submitting offline hours + rating by
  the "Submit offline hours" button bottom-right".
</span>
        </p>
        </>
      }
      />
      </div>
        <div className="w-full flex flex-row p-2 justify-between   ">
        <div className="self-center my-auto">
          <PromiseDialog
            maxCoins={user?.pCoins as number}
            icon={
            <Button className="text-sm">
            <Plus />
            Create
            </Button>
            
          }
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
      <CardList data={promises as Doc<"promises">[]} coins={user?.pCoins ?? 0} type="promise"/>


    </div>
  )
}

export default PromiseSec
