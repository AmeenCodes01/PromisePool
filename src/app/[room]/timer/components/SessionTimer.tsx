"use client";
import React, { useEffect, useState } from "react";
import Setting from "./Setting";
import { usePromiseStore } from "@/hooks/usePromiseStore";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import usePersistState from "@/hooks/usePersistState";
import { Switch } from "@/components/ui/switch";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import GroupCountDown from "./GroupCountDown";
import SoloCountDown from "./SoloCountDown";
import ProgressDialog from "./ProgressDialog";
import BuildAnimation from "./Animation";
import { Edit } from "lucide-react";
import { useTheme } from "next-themes";
import { useShallow } from "zustand/react/shallow";

function SessionTimer({ room }: { room: string }) {
  const user = useQuery(api.users.current) as Doc<"users">;

  const [ownerSesh,setOwnerSesh]=usePersistState<boolean>(false,`${room}-seshOwner`)
  const [localTimerStatus,setLocalTimerStatus]=usePersistState<null|string>(null,`${room}-timerStatus`)
  const {
  workMin,
  setWorkMin,
  getOrCreateTimer,
  setBreakMin,
  mode,
  groupSesh,
  setGroupSesh,
  goal,
  setSecLeft,
  setGoalOpen,
  onSoloReset,
  setPause
} = usePromiseStore(
  useShallow(
  (state) => ({
    workMin: state.workMin,
    setWorkMin: state.setWorkMin,
    getOrCreateTimer: state.getOrCreateTimer,
    setBreakMin: state.setBreakMin,
    mode: state.mode,
    groupSesh: state.groupSesh,
    setGroupSesh: state.setGroupSesh,
    goal: state.goal,
    setSecLeft: state.setSecLeft,
    setGoalOpen: state.setGoalOpen,
    setPause:state.setPause,
    onSoloReset: state.onSoloReset,
  })));

  useEffect(() => {
    usePromiseStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (room !== undefined) {
      getOrCreateTimer(room);
      setGroupSesh(false)
    }
  }, [room]);
  const secLeft = usePromiseStore((state) => state.timers[room]?.secLeft);

  const roomInfo = useQuery(api.rooms.getOne, { name: room }) as Doc<"rooms">;
  const participant = roomInfo?.participants?.find((p) => p.id === user?._id)
    ? true
    : false;
  //const ownerSesh = roomInfo?.session_ownerId === user?._id;

  const createGroupSesh = useMutation(api.rooms.createSesh);

  const cancelGroupSesh = useMutation(api.rooms.cancelSesh);
  const resetSesh = useMutation(api.sessions.reset);

  const joinGroupSesh = useMutation(api.rooms.participate);
  // there are 2 states. (in session & paused), (stopped: paused & not Insesh)
  const { theme } = useTheme();

  const onChangeSec = (min: number, type?: "work" | "break") => {
    if (type === "break") {
      setBreakMin(min);
      mode == "break" && setSecLeft(room, min * 60);
    } else {
      setWorkMin(min);
      mode == "work" && setSecLeft(room, min * 60);
    }
  };

  const onGroupSesh = (start: boolean) => {

    //check if timer playing, ask user to reset it. 
    
    setGroupSesh(start);
    if (start) {

      if( workMin * 60 !== secLeft ){
onSoloReset(room)
      }
      console.log("hit",start)
      setOwnerSesh(true);
      setLocalTimerStatus("not started")
      createGroupSesh({
        duration: workMin,
        roomId: roomInfo._id as Id<"rooms">,
      });
    } else {
      cancelGroupSesh({ roomId: roomInfo._id as Id<"rooms"> });
      onSeshReset();
      setOwnerSesh(false)
      setLocalTimerStatus(null)
    }
  };

  const onSeshReset = async () => {
    if (mode == "work") {
      secLeft !== workMin * 60 ? await resetSesh() : null;
      ownerSesh &&
        (await cancelGroupSesh({ roomId: roomInfo._id as Id<"rooms"> }));
    setPause(true)
      }

    
  };
  //change mode

  useEffect(() => {
    const status = roomInfo?.timerStatus;
    if (!roomInfo) {
    } else {
      if (status === "not started") {
        setGroupSesh(true);
      }
      if(status===undefined){
        setGroupSesh(false)
      }
    }
  }, [roomInfo]);

  const SettingWithProps = () => (
    <Setting onChangeSec={onChangeSec} participant={participant} />
  );

  const onJoinGroupSesh = () => {
    //check if session ongoing, then do onSeshReset

    onSeshReset();
    joinGroupSesh({
      userId: user?._id as Id<"users">,
      roomId: roomInfo._id as Id<"rooms">,
    });
    roomInfo.duration && onChangeSec(roomInfo.duration, "work");
  };


  return (
    <div className="flex flex-col w-full h-full px-4 bg-color-background items-center pt-6l  rounded-md    ">
     
     
      <div
        className="flex gap-2 p-2 justify-center  flex-col-reverse flex-1 w-full items-center   "
        style={{
          justifyContent: goal !== "" ? "space-between" : "center",
        }}
      >
        {groupSesh && (participant)? (
          <GroupCountDown
            room={room as Id<"rooms">}
            lastSeshRated={user?.lastSeshRated}
            userId={user?._id}
            SettingWithProps={SettingWithProps}
            seshId={user?.lastSeshId}
            ownerSesh={ownerSesh}
            setOwnerSesh={setOwnerSesh}
            localTimerStatus={localTimerStatus}
            setLocalTimerStatus={setLocalTimerStatus}
          />
        ) : (
          <SoloCountDown
            lastSeshRated={user?.lastSeshRated}
            roomName={roomInfo?.name}
            seshId={user?.lastSeshId}
            SettingWithProps={SettingWithProps}
          />
        )}
        
          <div className="flex flex-col 
           items-center gap-4 w-full
            sm:w-[40%] h-fit p-6 rounded-md  border-dashed justify-center border-[2px]">
            <span className="italic text-4xl font-normal font-mono text-wrap text-primary flex mx-auto  ">
              {goal !=="" ? goal: <span className="text-muted text-lg">Enter your goal </span>}
            </span>
           {goal!=="" && <span className="text-xs text-chart-2 font-mono ml-auto">
              {" "}
              We got this, lesgoooo
            </span>}
            <Edit
              size={18}
              className="ml-auto"
              onClick={() => setGoalOpen(true)}
            />
          </div>
        
      </div>

      {/* <BuildAnimation/> */}

      <div className=" flex-1   w-full flex gap-2 flex-col  items-center sm:py-6 px-2">
        <div className="flex flex-col items-center mt-2    ">
          {mode == "work" && roomInfo?.type !== "private" ? (
            <div>
              {groupSesh ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-lightbold">
                    Group Session:{" "}
                  </span>
                  <Switch
                    checked={groupSesh}
                    onCheckedChange={(s) => {
                      //    setGroupSesh(s);
                      onGroupSesh(s);
                    }}
                    id="groupSesh"
                    disabled={groupSesh && !ownerSesh}
                  />
                </div>
              ) : (
                <Dialog >
                  <DialogTrigger asChild  className="flex items-center gap-4">
                    <span className="text-sm font-lightbold">
                      Group Session:{" "}
                    <Switch checked={groupSesh} id="groupSesh" />
                    </span>
                  </DialogTrigger>
                  <ConfirmDialog
                    title={"Start a group session"}
                    desc={`Send invite to all of a ${workMin} minutes ? `}
                    onConfirm={onGroupSesh}
                  />
                </Dialog>
              )}
            </div>
          ) : null}

          {groupSesh && !ownerSesh ? (
            roomInfo?.timerStatus === "not started" ? (
              <>
                <div className="space-x-2 mt-8">
                  {!participant ? (
                    <>
                      <Button
                        onClick={() =>
                          !participant ? onJoinGroupSesh() : null
                        }
                      >
                        Join
                      </Button>
                      <span className="text-md ">
                        {" "}
                        a {roomInfo?.duration} min session ?
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Session joined</span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* <span>session {roomInfo?.timerStatus}</span> */}
              </>
            )
          ) : null}
        </div>
        {roomInfo?.type !== "private" && participant ? (
         <>
        <span className="text-md mt-6 font-serif opacity-90 underline  ">
          Participants
        </span>
          <div
            className="flex flex-col 
          gap-2 p-3  max-h-[200px]  overflow-auto max-w-[400px] text-center w-full mx-auto border-2 border-dotted border-primary rounded-md  "
          >
            {roomInfo?.participants?.map((u, i) => (
              <div
                className="p-2 w-full min-w-[150px] rounded-sm bg-cover"
                key={u.id}
                style={{
                  backgroundImage: `url(${theme == "dark" ? (i % 2 == 0 ? "/black_1.jpg" : "/black_2.jpg") : i % 2 == 0 ? "/white_1.jpg" : "/white_2.jpg"})`,
                }}
              >
                <span className="font-serif italic    ">{u.name}</span>
              </div>
            ))}
          </div>
         </>
        
        ) : null}
      </div>

      <ProgressDialog room={room} />
    </div>
  );
}

export default SessionTimer;
