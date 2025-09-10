import React, { Fragment } from 'react'
import PromiseCard from './PromiseCard'
import RewardCard from './RewardCard'
import { Doc } from '../../../../../convex/_generated/dataModel';

function CardList({
    data,
    type,
    coins,

}: {
    data: Doc<"promises">[] | Doc<"rewards">[];
    type:string;
    coins:number

}) {
  return (
    <div className="grid mt-4 gap-x-12 gap-y-14 w-fit max-w-[95%] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] ">
    {data ? (
      data.map((p) => (
        <Fragment key={p._id}>
            {
               type=="promise"?

                <PromiseCard promise={p as Doc<"promises"> }coins={coins as number} />:
                <RewardCard reward={p as Doc<"rewards"> } coins={coins as number}/>
            }

          {/* <Promise promise={p.title} coins={p.coins ?? 0} key={p._id}/> */}
        </Fragment>
      ))
    ) : (
      <span>No promises</span>
    )}
  </div>
  )
}

export default CardList
