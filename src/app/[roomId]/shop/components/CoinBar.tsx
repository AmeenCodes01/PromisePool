import React from 'react'
import { Coins } from "lucide-react";

type Props = {
    coins:number| undefined;
}
function CoinBar({coins}:Props) {
  return (
    <div className=''>
    <span className="text-center my-auto text-xs mr-2"></span>
    <div className="border-2 rounded-md t justify-center p-2 w-fit h-fit flex flex-row gap-2 ">
      
        <Coins />

        <span>{coins??0}</span>
      
    </div>
  </div>
  )
}

export default CoinBar
