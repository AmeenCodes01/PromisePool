// import React from 'react'

// function GroupTimer() {
    
//   return (
//     <div className=" flex-1 border-2 w-full flex gap-6 flex-col  items-center py-6 px-2">
//         <div className="flex flex-col items-center">
//           {mode == "work" && roomInfo?.owner_id !== user?._id ? (
//             <div>
//               {groupSesh ? (
//                 <div className="flex items-center gap-4">
//                   <span className="text-sm font-lightbold">
//                     Group Session:{" "}
//                   </span>
//                   <Switch
//                     checked={groupSesh}
//                     onCheckedChange={(s) => {
//                       setGroupSesh(false);
//                       onGroupSesh(s);
//                     }}
//                     id="groupSesh"
//                     disabled={groupSesh && !ownerSesh}
//                   />
//                 </div>
//               ) : (
//                 <Dialog>
//                   <DialogTrigger className="flex items-center gap-4">
//                     <span className="text-sm font-lightbold">
//                       Group Session:{" "}
//                     </span>
//                     <Switch checked={groupSesh} id="groupSesh" />
//                     {/* <Button onClick={()=>setGroupSesh(prev=>!prev)}>

// </Button> */}
//                   </DialogTrigger>
//                   <ConfirmDialog
//                     title={"Start a group session"}
//                     desc={`Send invite to all of a ${workMin} minutes ? `}
//                     onConfirm={onGroupSesh}
//                   />
//                 </Dialog>
//               )}
//             </div>
//           ) : null}

//           {groupSesh && !ownerSesh ? (
//             roomInfo?.timerStatus === "not started" ? (
//               <>
//                 <div className="space-x-2">
//                   {!participant ? (
//                     <>
//                       <Button
//                         onClick={() =>
//                           !participant
//                             ? joinGroupSesh({
//                                 userId: user?._id as Id<"users">,
//                                 roomId: roomId,
//                               })
//                             : null
//                         }
//                       >
//                         Join
//                       </Button>
//                       <span className="text-md ">
//                         {" "}
//                         a {roomInfo?.duration} min session ?
//                       </span>
//                     </>
//                   ) : (
//                     <>
//                       <span>Session joined</span>
//                     </>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <span>session {roomInfo?.timerStatus}</span>
//               </>
//             )
//           ) : null}
//         </div>
// {roomInfo?.owner_id !== user?._id && participant ?
//         <div className="flex flex-col gap-2 overflow-auto max-w-[400px] text-center w-full mx-auto  ">
//           <span className="text-md font-semibold ">Participants:</span>
//           {roomInfo?.participants?.map((p) => (
//             <div key={p.id}>
//               <span className="text-sm italic">{p.name}</span>
//             </div>
//           ))}
//         </div>:null}
//       </div>
//   )
// }

// export default GroupTimer
