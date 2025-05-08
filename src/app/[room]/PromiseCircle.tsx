"use client";
import React, { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Dollars } from "@/lib/utils";

function PromiseCircle() {
  const coins = useQuery(api.promises.total);
  const [show, setShow] = useState(false);
  return (
    <div className="absolute bottom-5 right-4  bg-transparent  text-md italic opacity-80 font-mono text-semibold tracking-tighter ">
    
    <div
  onClick={() => setShow(prev => !prev)}
  className={`fixed bottom-4 transition-all duration-700 ease-in-out
    ${show ? "right-2 w-[25%] rounded-md" : "right-4 w-12 h-12 rounded-full"}
    bg-primary p-3 cursor-pointer overflow-hidden flex items-center`}
>
  <span
    className={`text-white text-sm whitespace-nowrap transition-all duration-300 ease-in-out 
      ${show ? "opacity-100 ml-3" : "opacity-0 w-0"}
    `}
  >
    Our Shared Promise: ${coins ? Dollars(coins) :0} for PS
  </span>

  {!show && (
    <span className="text-white mx-auto">${coins ? Dollars(coins) : 0}</span>
  )}
</div>



      
        {/* <div className="w-full transition-all  delay-150 duration-300 ease-in-out">
         
        </div> */}
      
    </div>
  );
}

export default PromiseCircle;
