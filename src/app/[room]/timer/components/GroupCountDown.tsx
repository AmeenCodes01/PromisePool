import useGroupCountdown from "@/hooks/useGroupCountdown";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id, Doc } from "../../../../../convex/_generated/dataModel";
import { usePromiseStore } from "@/hooks/usePromiseStore";
import TimerDisplay from "../../shop/components/TimerDisplay";

function GroupCountDown({
  room,
  userId,
  lastSeshRated,
  SettingWithProps,
  seshId,
  ownerSesh,
  setOwnerSesh,
  localTimerStatus,
  setLocalTimerStatus
}: {
  room: string;
  SettingWithProps: () => React.JSX.Element;
  seshId: Id<"sessions"> | undefined;

  localTimerStatus:string|null;
  setLocalTimerStatus:React.Dispatch<React.SetStateAction<string | null>>;
  lastSeshRated: boolean | undefined;
  userId: Id<"users">;
  ownerSesh:boolean;
  setOwnerSesh: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const {
    onOpen,
    workMin,
    setWorkMin,
    mode,
    setMode,
    setGroupSesh,
    onChangeMode,
    setGoalOpen,
    getOrCreateTimer,
    setSecLeft,
  } = usePromiseStore((state) => state);

  const roomInfo = useQuery(api.rooms.getOne, { name: room }) as Doc<"rooms">;
  const roomId = roomInfo?._id as Id<"rooms">;

  const participant = roomInfo?.participants?.find((p) => p.id === userId)
    ? true
    : false;

  const startGroupSesh = useMutation(api.rooms.startSesh);
  const endGroupSesh = useMutation(api.rooms.endSesh);

  const startSesh = useMutation(api.sessions.start);
  const resetSesh = useMutation(api.sessions.reset);
  const cancelGroupSesh = useMutation(api.rooms.cancelSesh);
  const leaveGroupSesh = useMutation(api.rooms.leaveSesh);

  const { onPlay, pause, onReset, onPause } = useGroupCountdown(room);

  const secLeft = usePromiseStore((state) => state.timers[room]?.secLeft);

  // there should be option to exit group timer.

  const onSeshReset = async () => {
    onReset();
    if (mode == "work") {
      secLeft !== workMin * 60 ? await resetSesh() : null;
      if (ownerSesh) {
        await cancelGroupSesh({ roomId });
        setGroupSesh(false);
        setOwnerSesh(false)
        setLocalTimerStatus(null)
      } else {
        await leaveGroupSesh({ userId, roomId });
      }
      // we should show session ongoing ig.
    }
  };

  const onSeshStart = async () => {
    if (!pause) return;
    // call convex function. if returns true, start session.
    if (mode == "work") {
      if (
        lastSeshRated === true ||
        (lastSeshRated === undefined && seshId === undefined)
      ) {
        const result = roomInfo.duration
          ? await startSesh({
              duration: roomInfo.duration,
              room: roomInfo.name,
            })
          : null;
if(ownerSesh){
  (await startGroupSesh({ roomId }));
  setLocalTimerStatus("running")
}
        setGoalOpen(true);
      } else {
        onOpen();
        if (!participant) {
          return;
        }
      }

      // if rating required, then update workMin to match.
    }

    if (ownerSesh) {
      const startTime = Date.now();
      const endTime = startTime + (roomInfo?.duration as number) * 60000;
      onPlay(endTime);
    }
    //roomInfo?.endTime ?onPlay(roomInfo?.endTime):null;
    //  onPause()
  };

  useEffect(() => {
    if (secLeft == 0) {
      // get progress. open progres
      if (mode == "work") {
        onOpen();
        console.log("change Mode");
        onChangeMode("break", room, onPause);
      } else {
        setWorkMin(workMin * 60);
      }

      if(ownerSesh){

        endGroupSesh({ roomId });
        setOwnerSesh(false)
        setLocalTimerStatus("ended")
      }
      setGroupSesh(false);

      const bell = new Audio("/bell.wav");

      bell.play();
    }
  }, [secLeft]);

  useEffect(() => {
    const status = ownerSesh ? localTimerStatus: roomInfo?.timerStatus;
    console.log(status, " status", roomInfo);
    if (!roomInfo || !participant) {
    } else {
      if (status === "running") {
        console.log("running useEffect");
        setMode("work");
        !ownerSesh && onSeshStart();
        onPlay(roomInfo?.endTime as number);
      }

      if (status === "ended") {
        setSecLeft(room, 0);
        onChangeMode("break", room, onPause);
      }
    }

    if (status === "not started") {
      setGroupSesh(true);
    }

    if (roomInfo && status == "ended") {
      setGroupSesh(false);
      setOwnerSesh(false)
    }

    if (status === undefined && roomInfo && !ownerSesh) {
      console.log("Undefined sesh")
      onSeshReset();
      setGroupSesh(false);
      //!ownerSesh && setOwnerSesh(false);
    }
  }, [roomInfo]);

  return (
    <div>
      <TimerDisplay
        SettingWithProps={SettingWithProps}
        pause={pause}
        showExitBtn={participant}
        onSeshStart={onSeshStart}
        onSeshReset={onSeshReset}
        ownerSesh={ownerSesh}
        room={room}
      />
    </div>
  );
}

export default GroupCountDown;
