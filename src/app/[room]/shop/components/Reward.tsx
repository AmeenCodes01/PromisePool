"use client";
import React, { useState } from "react";
import PromiseDialog from "./PromiseDialog";

import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import CoinBar from "./CoinBar";
import { Plus } from "lucide-react";
import CardList from "./CardList";
import { Button } from "@/components/ui/button";
import InfoDialog from "../../InfoDialog";
import { Input } from "@/components/ui/input";
import calcRewards from "@/lib/calcReward";

function Reward() {
  
    const [hours, setHours] = useState(0);
      const [rating, setRating] = useState(7);
      const [showPrice,setShowPrice]=useState(false)
  const user = useQuery(api.users.current);
  const rewards = useQuery(api.rewards.get)
  const create = useMutation(api.rewards.create);
  
  const createReward = (title: string, price: number) => {
    create({ title,  price});
  };
  return (
    <div className=" ">
        <div className=" ml-auto w-fit flex z-[1000]">
      
            <InfoDialog title="Welcome to Shop's Rewards section"
            
            desc={
              <>
              <p className="italic">
      🎉 Rewards — Stuff You Actually Want <br/>
This is your little stash of things to look forward to. <br/>
Add whatever you love — a K-drama episode, a gaming session, a snack run, or even just a nap. Set a coin price for it, and when you’ve earned enough coins (by studying, working, or smashing your tasks), you unlock it. <br/><br/>

Simple. Fun. A good excuse to treat yourself only when you’ve earned it. <br/> <br/>
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

                 {/* <div className="my-2">
                      <span className="font-lightbold text-sm">Hours of study before reward:</span>
            
                      <Input
                        value={hours}
                        onChange={(e) =>
                          setHours(e.target.value ? parseFloat(e.target.value) : 0)
                        }
                      />
                        <div className="my-2 mb-3">
                                <span className="font-lightbold text-sm">
                                  Average Rating ( out of 10 )
                                </span>
                      
                                <Input
                                  min={1}
                                  max={10}
                                  value={rating}
                                  onChange={(e) =>
                                    setRating(e.target.value ? parseFloat(e.target.value) : 0)
                                  }
                                />
                              </div>

                              <Button onClick={()=>setShowPrice(true)}>
                                Calculate Coins
                              </Button>
                              
                              <p>price: {showPrice?calcRewards(hours,rating):null}</p>
                    </div> */}

                    <div className="border rounded-lg p-4 w-full max-w-xl mx-auto  shadow">
  <h2 className="text-lg font-bold mb-3">🎁 How Rewards Are Calculated</h2>
  
  <div className="grid grid-cols-4 font-semibold border-b pb-2 mb-2 text-sm">
    <div>Minutes</div>
    <div>Rating</div>
    <div>Manual/Timer</div>
    <div>Coins Earned</div>
  </div>

  {/* Row Example */}
  <div className="grid grid-cols-4 text-sm py-2 border-b">
    <div>60</div>
    <div>7</div>
    <div>Timer</div>
    <div>{calcRewards(60, 7, false)}</div>
  </div>

  <div className="grid grid-cols-4 text-sm py-2 border-b">
    <div>120</div>
    <div>9</div>
    <div>Manual</div>
    <div>{calcRewards(120, 9, true)}</div>
  </div>

  <div className="grid grid-cols-4 text-sm py-2 border-b">
    <div>150</div>
    <div>4</div>
    <div>Timer</div>
    <div>{calcRewards(150, 4, false)}</div>
  </div>

  <div className="grid grid-cols-4 text-sm py-2">
    <div>30</div>
    <div>5</div>
    <div>Timer</div>
    <div>{calcRewards(30, 5, false)}</div>
  </div>
</div>


            <PromiseDialog.CoinsInput title="price" 
            //  presetCoins={showPrice? calcRewards(hours,rating):undefined} 
             />
            <PromiseDialog.Btn />
          </PromiseDialog>
        </div>
        <CoinBar coins={user?.wCoins} />
      </div>
        <CardList coins={user?.wCoins ?? 0} data={rewards as Doc<"rewards">[]} type="rewards"/>
    </div>
  );
}

export default Reward;

// reward has unlock part feature. user specifies as lock/unlock.
