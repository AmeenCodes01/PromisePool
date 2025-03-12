import React, { Fragment } from 'react'
import { Doc } from '../../../../convex/_generated/dataModel'
import PromiseCard from './PromiseCard'
import RewardCard from './RewardCard'

function CardList({
    data,
    type,
    wCoins
}: {
    data: Doc<"promises">[] | Doc<"rewards">[];
    type:string;
    wCoins?:number

}) {
  return (
    <div className="  grid grid-cols-4 gap-4 ">
    {data ? (
      data.map((p) => (
        <Fragment key={p._id}>
            {
               type=="promise"?

                <PromiseCard promise={p as Doc<"promises">} />:
                <RewardCard reward={p as Doc<"rewards"> } wCoins={wCoins as number}/>
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
