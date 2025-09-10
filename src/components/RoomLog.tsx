"use client"
import { useMutation, useQuery } from 'convex/react'
import React, { useEffect } from 'react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'

function RoomJoin({roomId}:{roomId:string}) {

const join = useMutation(api.roomUsers.join)
const heartbeat = useMutation(api.roomUsers.heartbeat)

useEffect(()=>{
    const onJoin = async()=> await join({id:roomId as Id<"rooms">})
    onJoin()
},[])

useEffect(() => {
  const interval = setInterval(() => {
heartbeat()

},60000);

  return () => clearInterval(interval);
}, [roomId]);

// const users = useQuery(api.roomUsers.get,{name})
//console.log(users,"users")
  return (
    <div></div>
  )
}

export default RoomJoin