import { Input } from '@/components/ui/input'
import { usePromiseStore } from '@/hooks/usePromiseStore'
import React from 'react'
import { useShallow } from 'zustand/react/shallow'

function SeshCount() {
    const{seshCount,setSeshCount}=usePromiseStore(useShallow(state=>state))
  return (
    <div className='flex flex-row gap-3  '>
<Input type='num' min={0} value={seshCount} className='w-10 border-0 text-center border-b-2 text-primary rounded-none text-sm' onChange={(e) => {
    const value = e.target.value;
    if (value === "") {
      setSeshCount(0); // let empty value for now
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) ) {
      setSeshCount(num);
    }
  }}/>

<span className='text-muted self-center italic text-sm'>{seshCount>1 ?"sessions":"session"} smashed</span>

    </div>
  )
}

export default SeshCount