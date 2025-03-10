"use client"
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { redirect } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import usePersistState from "@/hooks/usePersistState";

const CheckPass=({password,onVerify}:{password:string; onVerify:()=>void})=>{
 const [open, setOpen] = useState(true)
 const [pass,setPass]=useState("")
 const [error, setError] = useState<null| string>(null)


 const checkPass= ()=> {
  if(pass === password){
    setOpen(false);
    onVerify()
  }else{

    setError("Wrong password")
  }
 }
  return(
//get password.
<AlertDialog defaultOpen={true} open={open} onOpenChange={()=>setOpen(false)}>
  {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Enter Room Password</AlertDialogTitle>
      <AlertDialogDescription>
       
      </AlertDialogDescription>
    </AlertDialogHeader>
    <Input value={pass}  onChange={(e)=> setPass(e.target.value)} />
    {error &&  <p className="text-red-400 text-sm"> {error} </p>}
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <Button onClick={checkPass}>Continue</Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    
  )
}


function CheckPrivate({room}:{room:string}) {
    const { user } = useUser();
    const [verified, setVerified]= usePersistState(false, `${room}Verify`)
    console.log(user," user")
    const roomInfo = useQuery(api.rooms.getOne,{name:room})

  const onVerified = ()=> setVerified(true)

  if(roomInfo?.type ==="private"){
    if(user?.username !== room){
   
        redirect(`/${user?.username}/timer`)
    }
    
  }
if(roomInfo?.type ==="group" && !verified && roomInfo.owner_id ){
  return (
    <div>
  <CheckPass password = {roomInfo.password as string} onVerify={onVerified}/>
    </div>
  )
}



//if private, check if username & room same.
//if group, ask for password
//if public, do nothing.

  return (
    <>
      
    </>
  )
}

export default CheckPrivate
