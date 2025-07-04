"use client";
import { useMutation } from "convex/react";
import {  Coins, Edit, Plus } from "lucide-react";
import React from "react";

import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";

import PromiseDialog from "./PromiseDialog";
import { Dollars } from "@/lib/utils";
import { toast } from "sonner";

function PromiseCard({ promise ,coins}: { promise: Doc<"promises">  ;coins: number;
 }) {
  const edit = useMutation(api.promises.edit);
  const del = useMutation(api.promises.del);
  const invest = useMutation(api.promises.invest);
console.log("coins ",coins)
  const onEdit = (title: string,coins?:number) => {
    edit({ title, pId: promise._id });
  };
  const onDel = () => del({ pId: promise._id });

  const onInvest = (title:string, inputCoins: number) =>{
    console.log(inputCoins," pcoins")
     inputCoins <= coins ?invest({ pId: promise._id,coins: inputCoins }):toast.error("Not enough coins")
     };
  console.log(promise, " Promise");
  return (
    <div className="border-2 flex flex-col relative size-[200px] ">
      <div
        className={`flex absolute inset-0 m-auto bg-accent flex-col h-[120px] w-[120px] 
      rotate-45 
      font-serif  p-1 ${promise.title.toLowerCase().includes("palestine") ? "blink" : "blue-diamond"} `}
      >
      <div className=" items-center justify-center pt-3 pr-2 h-[90%] flex text-md -rotate-45 flex-col ">
        <span
          className="text-center text-accent-content 
          text-sm font-extrabold font-mono
          "
        >
          {promise.title}
        </span>{promise.title.toLowerCase().includes("palestine") &&
        <span className="bg-gray-700 mt-2 w-[30px] h-[15px] text-xs font-mono font-semibold text-center rounded-sm"
        title="$ you promised to donate. "
        >
          $ { " "}
          {promise.coins? Dollars(promise.coins):0} 
        </span>}
      </div>
      </div>
{ promise.title=="Coins for Palestine"&&
  <span className="text-xs bg-gray-800 text-gray-300 italic w-fit p-[2px] border-2 gap-1 flex flex-row">350 <Coins size={12} className="mt-auto"  />= 1$</span>
}
      <div className="ml-auto   ">
      <PromiseDialog
          icon={
            promise.title !== "Coins for Palestine" ? (
              <Edit className="ml-auto " size={18} />
            ) : (
              <div />
            )
          }
          header="Edit promise"
          editTitle={promise.title}
          onClick={onEdit}
          btnTitle={"Edit"}
        >
          <PromiseDialog.NameInput />
          <div className="flex flex-row gap-2 justify-end">
            <PromiseDialog.Btn />
            <PromiseDialog.Btn
              customBtnTitle={"Delete"}
              customOnClick={onDel}
            />
          </div>
        </PromiseDialog>
     
      </div>
      <div className="  w-[100%] p-[5px]  mt-auto flex flex-row gap-[10px]  justify-between bg-neutral text-white ">
        <div className="flex flex-row gap-1" title="Study coins">
        {promise.coins ? promise.coins : 0} 

        <Coins size={15} className=" z-100 my-auto" />
        </div>
        <PromiseDialog
          icon={<Plus size={18} />}
          header="Invest"
          onClick={onInvest}
          btnTitle={"Invest"}
        >
          <PromiseDialog.CoinsInput />

          <PromiseDialog.Btn />
        </PromiseDialog>
      </div>
    </div>
  );
}

export default PromiseCard;
