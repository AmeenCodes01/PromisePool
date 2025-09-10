"use client"
import React from 'react'
import { Input } from './ui/input';
import usePersistState from '@/hooks/usePersistState';
import { Button } from './ui/button';
import { getMealResponse } from '@/lib/getMealResponse';
import { ArrowDown } from 'lucide-react';

function MealCounter() {
  const [mealCount,setMealCount]=usePersistState(0,"mealCount");
  const [mealContent,setMealContent]=usePersistState("","meal content")
  const [response,setResponse]=usePersistState("","ai-response")
const [show,setShow]=usePersistState(true, "showMeal")
  const getResponse = async ()=>{
        const response = await getMealResponse(mealCount,mealContent)
setResponse(response)
  }

    return (
        <>
        <Button className='mx-auto' variant={"ghost"} onClick={()=>setShow(prev=>!prev)}>Meals <ArrowDown/></Button>
{show ?
     <div className='flex flex-col gap-5 w-full text-xs text-nowrap justify-center items-center  '>
<div className='flex flex-row justify-center items-center gap-2 '>

        <span>I ate</span>
    <Input placeholder='1' type='num' min={0} value={mealCount} className='w-10 border-0 text-center border-b-2 text-primary rounded-none text-sm' onChange={(e) => {
    const value = e.target.value;
    if (value === "") {
      setMealCount(0); // let empty value for now
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) ) {
      setMealCount(num);
    }
}}

  />
<span>meals in which I ate/drank</span>

<Input placeholder='tea' className=' border-0 text-center border-b-2 text-primary rounded-none text-sm'
value={mealContent} onChange={(e)=>setMealContent(e.target.value)}
/>

<Button className='text-xs p-2' size={"sm"} variant={"secondary"} onClick={()=>getResponse()} >submit</Button>
</div>
{/* 
<span className='text-muted self-center italic text-sm'>{seshCount>1 ?"sessions":"session"} smashed</span> */}
<span className='text-wrap max-h-[200px] p-2 overflow-auto w-[80%] text-sm italic text-primary'>
    {response}
</span>
    </div>
:
<span>{mealCount}</span>    
}
</>
  )
}

export default MealCounter