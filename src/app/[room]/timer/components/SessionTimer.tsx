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
import FileUploader from "@/components/FileUploader";
import MealCounter from "@/components/MealCounter";

function SessionTimer({ room }: { room: string }) {
  const user = useQuery(api.users.current) as Doc<"users">;
  const bgImages = useQuery(api.images.list);

  const [ownerSesh, setOwnerSesh] = usePersistState<boolean>(
    false,
    `${room}-seshOwner`
  );
  const [localTimerStatus, setLocalTimerStatus] = usePersistState<
    null | string
  >(null, `${room}-timerStatus`);
  const [participant, setParticipant] = usePersistState(false, "participant");
  const [bgImage, setbgImage] = usePersistState("", "bgImage");

  const {
    workMin,
    setWorkMin,
    setBreakMin,
    mode,
    groupSesh,
    setGroupSesh,
    goal,
    setSecLeft,
    setGoalOpen,
    onReset,
    setPause,
    secLeft,
    recoverInterval
  } = usePromiseStore(
    useShallow((state) => ({
      workMin: state.workMin,
      setWorkMin: state.setWorkMin,
      secLeft: state.secLeft,

      setBreakMin: state.setBreakMin,
      mode: state.mode,
      groupSesh: state.groupSesh,
      setGroupSesh: state.setGroupSesh,
      goal: state.goal,
      setSecLeft: state.setSecLeft,
      setGoalOpen: state.setGoalOpen,
      setPause: state.setPause,
      onReset: state.onReset,
      
    recoverInterval: state.recoverInterval
    }))
  );

  useEffect(() => {
    console.log("store hydratted");
    usePromiseStore.persist.rehydrate();
  }, []);


  useEffect(()=>{
    console.log("Hello, recoverInternal")
recoverInterval()
  },[])
  useEffect(() => {
    if (room !== undefined) {
   
      setGroupSesh(false);
    }
  }, [room]);


  const roomInfo = useQuery(api.rooms.getOne, { name: room }) as Doc<"rooms">;

  const createGroupSesh = useMutation(api.rooms.createSesh);

  const cancelGroupSesh = useMutation(api.rooms.cancelSesh);
  const resetSesh = useMutation(api.sessions.reset);

  const joinGroupSesh = useMutation(api.rooms.participate);
  // there are 2 states. (in session & paused), (stopped: paused & not Insesh)
  const { theme } = useTheme();

  const onChangeSec = (min: number, type?: "work" | "break") => {
    if (type === "break") {
      setBreakMin(min);
      mode == "break" && setSecLeft(min * 60);
    } else {
      setWorkMin(min);
      mode == "work" && setSecLeft( min * 60);
    }
  };

  const onGroupSesh = (start: boolean) => {
    //check if timer playing, ask user to reset it.

    setGroupSesh(start);
    if (start) {
      if (workMin * 60 !== secLeft) {
        onReset();
      }
      console.log("hit", start);
      setOwnerSesh(true);
      setLocalTimerStatus("not started");
      createGroupSesh({
        duration: workMin,
        roomId: roomInfo._id as Id<"rooms">,
      });
      setParticipant(true);
    } else {
      setParticipant(false);
      setLocalTimerStatus(null);
      onSeshReset();
    }
  };

  const onSeshReset = async () => {
    console.log("sessiontimer resset")
    if (mode == "work") {
      setPause(true);
      onReset();
      secLeft !== workMin * 60 ? await resetSesh() : null;
      if (ownerSesh) {
        await cancelGroupSesh({ roomId: roomInfo._id as Id<"rooms"> });
        setOwnerSesh(false);
      }
    }
  };
  //change mode

  useEffect(() => {
    const status = roomInfo?.timerStatus;
    if (!roomInfo) {
    } else {
      if (status === "not started") {
        setGroupSesh(true);
        console.log(user._id, roomInfo.session_ownerId);
        setOwnerSesh(user._id === roomInfo.session_ownerId);
      }
      if (!ownerSesh && (status === undefined || status == "ended")) {
        if (participant) {
      status ===undefined &&    onSeshReset();
    }
  }
  
  if(status ===undefined){
    setGroupSesh(false);
    setParticipant(false);

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
    setParticipant(true);
  };

  return (
    <div
      style={{
        backgroundImage: bgImage !== "" ? `url('${bgImage}')` : undefined,
      }}
      className="flex flex-1   flex-col w-full h-full px-4 bg-color-background items-center pt-6l  rounded-md bg-cover   "
    >
      <div
        className="flex gap-2 p-2 justify-center  flex-col-reverse flex-1 w-full items-center   "
        style={{
          justifyContent: goal !== "" ? "space-between" : "center",
        }}
      >
        {groupSesh && participant ? (
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
            participant={participant}
            setParticipant={setParticipant}
          />
        ) : (
          <SoloCountDown
            lastSeshRated={user?.lastSeshRated}
            roomName={roomInfo?.name}
            seshId={user?.lastSeshId}
            SettingWithProps={SettingWithProps}
          />
        )}

        <div
          className="flex flex-col 
           items-center gap-4 w-full
            sm:w-[40%] h-fit p-6 rounded-md  border-dashed justify-center border-[2px]"
        >
          <span className="italic text-4xl font-normal font-mono text-wrap text-primary flex mx-auto  ">
            {goal !== "" ? (
              goal
            ) : (
              <span className="text-muted text-lg">Enter your goal </span>
            )}
          </span>
          {goal !== "" && (
            <span className="text-xs text-chart-2 font-mono ml-auto">
              {" "}
              We got this, lesgoooo
            </span>
          )}
          <Edit
            size={18}
            className="ml-auto"
            onClick={() => setGoalOpen(true)}
          />
        </div>
      </div>

      {/* <BuildAnimation/> */}

<div className="my-6">
{ user?._id == "jd705x68bazm0wvqsd1bqymaw97jh1yh" &&  <MealCounter/>}
</div>

      <div className=" flex-1   w-full flex gap-2 flex-col  items-center sm:py-6 px-2">
        <div className="flex flex-col items-center mt-2    ">
          {mode == "work" && roomInfo?.type !== "private" ? (
            <div>
              {groupSesh ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-lightbold">
                    Group Session:{" "}
                    <span className="text-primary ml-2 text-xs">Ongoing</span>
                  </span>

                  {/* <Switch
                    checked={groupSesh}
                    onCheckedChange={(s) => {
                      //    setGroupSesh(s);
                      onGroupSesh(s);
                    }}
                    id="groupSesh"
                    disabled={!ownerSesh}
                  /> */}
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild className="flex items-center gap-4">
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
                      <span className="text-sm">Session joined</span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>{/* <span>session {roomInfo?.timerStatus}</span> */}</>
            )
          ) : null}
        </div>
        {roomInfo?.type !== "private" && participant && groupSesh ? (
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
                  <span className="font-serif italic space-x-2   ">
                    {u.name}{" "}
                    {u.id === roomInfo.session_ownerId
                      ? "     (owner)"
                      : null}{" "}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="pt-12 sm:pt-0 pb-2 sm:pb-0">


      {/* BgImages */}
      {bgImages && bgImages?.length > 0 && (
        <div className=" mt-4 border-2 rounded-md p-2 max-w-[300px] overflow-y-auto gap-2 flex flex-row">
          <div
            className="h-[60px] min-w-[60px] border-[2px] text-xs font-mono text-center flex justify-center items-center"
            onClick={() => setbgImage("")}
          >
            remove
          </div>
          {bgImages.map((i) => {
            return (
              <img
                src={i.url as string}
                key={i.url}
                className="h-[60px]"
                onClick={() => setbgImage(i.url as string)}
              />
            );
          })}
        </div>
      )}
      <div className="mt-2">

      <FileUploader/>
      </div>
      </div>
    
      <ProgressDialog room={room} />
    </div>
  );
}

export default SessionTimer;
