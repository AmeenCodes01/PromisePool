"use client";
import React, { useEffect, useState } from "react";
import useCountdown from "./useCountdown";
import Setting from "./Setting";
import { Play, Pause, TimerReset, Settings, UserRoundIcon } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import ProgressDialog from "./ProgressDialog";
import { useMutation, useQueries, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import usePersistState from "@/hooks/usePersistState";
import { Switch } from "@/components/ui/switch";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ConfirmDialog";

function SessionTimer({ room }: { room: string }) {
  const user = useQuery(api.users.current) as Doc<"users">;

  const [workMin, setWorkMin] = usePersistState(60, "sec");
  const [breakMin, setBreakMin] = usePersistState(10, "breakSec");
  const [mode, setMode] = usePersistState<"work" | "break">("work", "mode");

  const [groupSesh, setGroupSesh] = usePersistState<boolean>(
    false,
    `${user?._id}groupSesh`
  );

  // const [ownerSesh, setOwnerSesh] = usePersistState(
  //   false,
  //   `${user?._id}ownerSesh`
  // );

  const roomInfo = useQuery(api.rooms.getOne, { name: room }) as Doc<"rooms">;
  const roomId = roomInfo?._id as Id<"rooms">;
  const participant = roomInfo?.participants?.find((p) => p.id === user._id);
  const ownerSesh = roomInfo?.session_ownerId === user?._id;
  const { onPause, onPlay, secLeft, setSecLeft, pause, onReset } = useCountdown(
    {
      sec: mode == "work" ? workMin * 60 : breakMin * 60,
    }
  );

  const onOpen = useDialog((state) => state.onOpen);

  
  console.log(roomId,"roomid")
  const startSesh = useMutation(api.sessions.start);
  const resetSesh = useMutation(api.sessions.reset);
  const createGroupSesh = useMutation(api.rooms.createSesh);
  const startGroupSesh = useMutation(api.rooms.startSesh);
  const joinGroupSesh = useMutation(api.rooms.participate);
  const endGroupSesh = useMutation(api.rooms.endSesh);
  const cancelGroupSesh = useMutation(api.rooms.cancelSesh);
  // there are 2 states. (in session & paused), (stopped: paused & not Insesh)

  useEffect(() => {
    if (secLeft == 0 && mode == "work") {
      // get progress. open progres
      if (mode == "work") {
        console.log(" useeffect")
        onOpen();
        !groupSesh && onChangeMode("break");
      } else {
        setWorkMin(workMin * 60);
      }

      if (groupSesh) {
        endGroupSesh({ roomId });
        setGroupSesh(false);
        //   setOwnerSesh(false)
      }
    }
  }, [secLeft]);
  //to change time when mode changes.

  const onChangeSec = (min: number, type?: "work" | "break") => {
    if (type === "break") {
      setBreakMin(min);
      mode == "break" && setSecLeft(min * 60);
    } else {
      setWorkMin(min);
      mode == "work" && setSecLeft(min * 60);
    }
  };

  const onSeshStart = async () => {
    // call convex function. if returns true, start session.
    if (mode == "work" && secLeft == workMin * 60) {
      if (user?.lastSeshRated === true || user?.lastSeshRated === undefined) {
        const result = await startSesh({
          duration:
            participant && roomInfo.duration ? roomInfo.duration : workMin,
          room: roomInfo.name,
        });
        groupSesh && ownerSesh ? await startGroupSesh({ roomId }) : null;
      } else {
        console.log("open")
        onOpen();
        if(!participant){

          return;
        }
      }

      // if rating required, then update workMin to match.
    }
    if (groupSesh) {
      const remainingTime = (roomInfo.endTime as number) - Date.now(); //in ms
      setSecLeft(remainingTime / 1000);
    }
    onPlay();
  };

  const onSeshReset = async () => {
    console.log("Hitting reset")
    if (mode == "work") {
      secLeft !== workMin * 60 ? await resetSesh() : null;
      ownerSesh && (await cancelGroupSesh({ roomId }));
    }

    onReset();
  };

  console.log(secLeft," secLeft")
  const playing = secLeft !== 0 && mode === "work" && secLeft !== workMin * 60;

  const onGroupSesh = (start: boolean) => {
    setGroupSesh(start);
    // setOwnerSesh(start);

    if (start) {
      createGroupSesh({ duration: workMin, roomId });
    } else {
      cancelGroupSesh({ roomId });
      onSeshReset()
    }
  };

  //change mode
  const onChangeMode = (md: "work" | "break") => {
    onPause();
    setMode(md);
    md === "break" ? setSecLeft(breakMin * 60) : setSecLeft(workMin * 60);
    console.log(md, breakMin, " md ", secLeft);

  };

  const syncTime = () => {
    const remainingTime = (roomInfo.endTime as number) - Date.now(); //in ms
    //
    setSecLeft(remainingTime / 1000);
  };

  useEffect(() => {

    if (roomInfo?.timerStatus === "running" && participant) {
      console.log("hello  ")
      syncTime();
    }
    //sync time.
  }, []);

  useEffect(() => {
    const status = roomInfo?.timerStatus;
    if (!roomInfo || !participant) {
      console.log(roomInfo, "rooomInfo");
    } else {
      if (status === "running") {
        console.log("reset sesh")

        setMode("work");
        syncTime();
        onSeshStart();
      }

      if (status === "ended") {
        console.log("reset sesh")

        setSecLeft(0);
        onChangeMode("break");
        console.log("roomInfo  useEffect run");
      }
    }

    if (status === "not started") {
      console.log("reset sesh")

      setGroupSesh(true);
    }

    if (status === undefined && groupSesh && roomInfo) {
      console.log("reset sesh")
      onSeshReset();
      setGroupSesh(false);
      //  !ownerSesh && setOwnerSesh(false);
    }
  }, [roomInfo]);

  const hours =  Math.floor(Math.floor(secLeft/60)/60)

  const minutes = Math.floor(secLeft / 60) >= 60 ? hours*60 - Math.floor(secLeft / 60):Math.floor(secLeft / 60);

  const seconds = Math.floor(secLeft % 60);
  
  return (
    <div className="flex flex-col w-full h-full bg-color-background items-center   rounded-md    ">
      {/* Countdown */}
      <div className="items-center gap-4 flex flex-col justify-end py-6 flex-1  ">
        <div className="flex flex-row gap-2">
          <Button className="text-xs border-[2px]  " variant={mode =="break" ?"outline":"default"} onClick={()=>onChangeMode("work")}
                        disabled={playing}

            >
Work
          </Button>
          <Button className="text-xs  border-[2px]"
                      disabled={playing}

          variant={ mode =="work" ?"outline":"default"} onClick={()=>onChangeMode("break")}>
Break
          </Button>
          {/* <Toggle
            disabled={playing}
            onClick={() => onChangeMode(mode == "work" ? "break" : "work")}
            className="border-[1px] justify-center self-center justify-self-center mb-4"
          >
            {mode == "work" ? "Work" : "Break"}
          </Toggle> */}
          <Setting
            workMin={workMin}
            breakMin={breakMin}
            onChangeSec={onChangeSec}
            mode={mode}
            setMode={setMode}
          />
        </div>
        <div className="flex flex-row  justify-center items-center relative ">
          <div className="shrink-0 flex">
          {hours !==0 &&  
          <span className="text-8xl font-mono">
              {hours < 10  ? "0" + hours : hours}:
            </span>}
            <span className="text-8xl font-mono">
              {minutes < 10 ? "0" + minutes : minutes}:
            </span>
            <span className="text-6xl font-mono">
              {seconds < 10 ? "0" + seconds : seconds}
            </span>
          </div>
          <div className=" pl-2 "></div>
        </div>
        <div className="flex flex-row gap-2   mx-auto justify-center ">
          {pause ? (
            <button disabled={participant && !ownerSesh}>
              <Play onClick={() => onSeshStart()} />
            </button>
          ) : (
            <>
              {groupSesh && roomInfo?.timerStatus === "running" ? null : (
                <Pause onClick={() => onPause()} />
              )}
            </>
          )}
          <TimerReset onClick={() => onSeshReset()} />
        </div>
      </div>
      <div className=" flex-1 border-2 w-full flex gap-6 flex-col  items-center py-6 px-2">
        <div className="flex flex-col items-center mt-4">
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
                      setGroupSesh(false);
                      onGroupSesh(s);
                    }}
                    id="groupSesh"
                    disabled={groupSesh && !ownerSesh}
                  />
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger className="flex items-center gap-4">
                    <span className="text-sm font-lightbold">
                      Group Session:{" "}
                    </span>
                    <Switch checked={groupSesh} id="groupSesh" />
                    {/* <Button onClick={()=>setGroupSesh(prev=>!prev)}>

</Button> */}
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
                <div className="space-x-2">
                  {!participant ? (
                    <>
                      <Button
                        onClick={() =>
                          !participant
                            ? joinGroupSesh({
                                userId: user?._id as Id<"users">,
                                roomId: roomId,
                              })
                            : null
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
                <span>session {roomInfo?.timerStatus}</span>
              </>
            )
          ) : null}
        </div>
{roomInfo?.type!=="private" && participant ?
        <div className="flex flex-col gap-2 p-2  overflow-auto max-w-[400px] text-center w-full mx-auto border-2 border-dotted border-primary-foreground rounded-md  ">
          <span className="text-md font-serif opacity-90 underline  ">Participants</span>
          {roomInfo?.participants?.map((p) => (
            <div key={p.id}>
              <span className="text-sm italic">{p.name}</span>
            </div>
          ))}
        </div>:null}
      </div>

      {/* Play/Pause.  */}
      <ProgressDialog
        duration={workMin}
        
        onReset={onReset}
      />
      {/* session must not have started. */}
    </div>
  );
}

export default SessionTimer;
