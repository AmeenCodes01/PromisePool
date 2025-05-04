"use client"
import { useMutation } from 'convex/react';
import { BadgePlus, Edit, Plus } from 'lucide-react';
import React from 'react'

import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";

import PromiseDialog from './PromiseDialog';



function PromiseCard({
    promise, 

}: {promise:Doc<"promises">}) {
  const edit = useMutation(api.promises.edit)
  const del = useMutation(api.promises.del)
  const invest = useMutation(api.promises.invest)

  const onEdit = (title:string)=>{
     edit({title, pId:promise._id})
  }
  const onDel=()=> del({pId:promise._id})

  const onInvest= (title:string,coins:number)=> invest({pId:promise._id, coins})
console.log(promise, " Promise")
  return (
    <>
      <div className="flex bg-accent flex-col h-[300px] w-[200px]  font-serif border-1 p-1">
        <PromiseDialog
        icon={ promise.title!=="Donate to Palestine" ?    <Edit className='ml-auto ' size={18}/>:<div/>}
        header='Edit promise'
        editTitle={promise.title}
        onClick={onEdit}
        btnTitle={"Edit"}
        
      
        >
          <PromiseDialog.NameInput/>
          <div className='flex flex-row gap-2 justify-end'>

          <PromiseDialog.Btn/>
          <PromiseDialog.Btn customBtnTitle={"Delete"} customOnClick={onDel} />
          </div>
        </PromiseDialog>
        <div className=" items-center justify-center p-[10px] h-[90%] flex text-md   ">
          <span className="text-center text-accent-content tracking-wide">
            {promise.title}
          </span>
        </div>
        <div className=" w-[100%] p-[5px] flex  flex-row gap-[10px] items-center justify-between bg-neutral text-white ">
          {promise.coins ?  promise.coins:0}
          <PromiseDialog
        icon={     <BadgePlus size={18}/>}
        header='Invest'
        onClick={onInvest}
        btnTitle={"Invest"}
        
      
        >
          <PromiseDialog.CoinsInput/>

          <PromiseDialog.Btn/>
        </PromiseDialog>
          
        
        </div>
      </div>
    </>
  )
}

export default PromiseCard
