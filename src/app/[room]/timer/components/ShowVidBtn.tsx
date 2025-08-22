"use client"
import { Button } from '@/components/ui/button';
import { usePromiseStore } from '@/hooks/usePromiseStore'
import React from 'react'
import { useShallow } from "zustand/react/shallow";

function ShowVidBtn() {
     const {showVid,setShowVid}= usePromiseStore(useShallow(state=>({
        showVid: state.showVid,
        setShowVid: state.setShowVid
    })))
  return (
     <Button
     variant={"secondary"}
     size={"sm"}
        onClick={()=>setShowVid(!showVid)}
        className=""
      >
        
        {!showVid ? "Show ":"Hide "  } 
        
        Video</Button>

  )
}

export default ShowVidBtn