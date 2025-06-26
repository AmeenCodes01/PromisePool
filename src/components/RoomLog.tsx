"use client"
import { useMutation, useQuery } from 'convex/react'
import React, { useEffect } from 'react'
import { api } from '../../convex/_generated/api'

function RoomJoin({name}:{name:string}) {

const join = useMutation(api.roomUsers.join)
const heartbeat = useMutation(api.roomUsers.heartbeat)

useEffect(()=>{
    const onJoin = async()=> await join({name})
    onJoin()
},[])

useEffect(() => {
  const interval = setInterval(() => {
heartbeat()

}, 15000);

  return () => clearInterval(interval);
}, [name]);

// const users = useQuery(api.roomUsers.get,{name})
//console.log(users,"users")
  return (
    <div></div>
  )
}

export default RoomJoin