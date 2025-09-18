import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import Setting from "../../timer/components/Setting";
import { Play, Pause, TimerReset } from "lucide-react";
import { usePromiseStore } from "@/hooks/usePromiseStore";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import GoalDialog from "../../timer/components/GoalDialog";
import { useShallow } from "zustand/react/shallow";
import SeshCount from "../../timer/components/SeshCount";

export default function TimerDisplay({
  SettingWithProps,
  pause,
  showExitBtn,
  onPause,
  onSeshStart,
  onSeshReset,
  ownerSesh,
  roomId,
  onStopWatchEnd
}: {
  pause: boolean;
  showExitBtn: boolean;
  onPause?: () => void;
  onSeshStart: () => void;
  onSeshReset: () => void;
  SettingWithProps: () => React.JSX.Element;
  ownerSesh?: boolean;
  roomId: string;
  onStopWatchEnd?: ()=>void;
}) {
  const { workMin, mode, onChangeMode, groupSesh, secLeft,stopwatch } = usePromiseStore(
    useShallow((state) => {
      return {
        workMin: state.workMin,
        mode: state.mode,
        onChangeMode: state.onChangeMode,
        groupSesh: state.groupSesh,
        secLeft: state.secLeft,
        stopwatch:state.stopwatch
      };
    })
  );

  //  const secLeft = usePromiseStore(state=> state.timers[room]?.secLeft)

  const playing = secLeft !== 0 && mode === "work" && secLeft !== workMin * 60;

  const hours = Math.floor(Math.floor(secLeft / 60) / 60);

  const minutes =
    hours > 0
      ? Math.floor(secLeft / 60 - hours * 60)
      : Math.floor(secLeft / 60);
  const seconds = Math.floor(secLeft % 60);

  return (
    <>
      <div
        className="items-center justify-center gap-10   border-dashed 
    border-[2px] p-2 rounded-md flex flex-col sm:flex-row  py-6 bg-cover  "
    
      >
        <div className="flex flex-row sm:flex-col-reverse  items-center  gap-2  ">
          <Button
            className="text-xs  border-[2px]"
            disabled={playing}
            variant={mode == "work" ? "outline" : "default"}
            onClick={() => onChangeMode("break")}
          >
            Break
          </Button>
          <Button
            className="text-xs border-[2px]  "
            variant={mode == "break" ? "outline" : "default"}
            onClick={() => onChangeMode("work")}
            disabled={playing}
          >
            Work
          </Button>
          <div className={`${playing ? "opacity-50" : ""}`} aria-disabled={!pause}>
  <SettingWithProps  />
</div>
        </div>
        <div className="flex flex-row  ">
          <div className=" flex ">
            {hours !== 0 && (
              <span className="md:text-8xl text-6xl font-mono">
                {hours < 10 ? "0" + hours : hours}:
              </span>
            )}
            <span className="md:text-8xl text-6xl font-mono ">
              {minutes < 10 ? "0" + minutes : minutes}:
            </span>
            <span className="md:text-6xl text-4xl font-mono">
              {seconds < 10 ? "0" + seconds : seconds}
            </span>
          </div>
          <div className=" pl-2 "></div>
        </div>
        <div className="flex flex-row   sm:flex-col items-center gap-4   ">
          {pause ? (
            ownerSesh !== undefined ? (
              ownerSesh ? (
                <button className="">
                  <Play onClick={() => onSeshStart()} color="var(--primary)" />
                </button>
              ) : (
                <></>
              )
            ) : (
              <button className="">
                <Play onClick={() => onSeshStart()} color="var(--primary)" />
              </button>
            )
          ) : (
            <>
              {onPause ? (
                <Pause onClick={() => onPause()} color="var(--primary)" />
              ) : null}
            </>
          )}
          {groupSesh && showExitBtn ? ( //showExitBtn is participant
            <Dialog>
              <DialogTrigger asChild>
                
                  {showExitBtn ? (
                    <Button size={"sm"}>Exit/End</Button>
                  ) : (
                    <TimerReset color="var(--destructive)" />
                  )}
                
              </DialogTrigger>
              <ConfirmDialog
                title="Exit Group Session"
                desc="Do you want to exit group session ?"
                onConfirm={onSeshReset}
              />
            </Dialog>
          ) : (
            <button onClick={() => onSeshReset()}>
              <TimerReset color="var(--destructive)" />
            </button>
          )}

          { onStopWatchEnd && mode!=="break" ? <Button onClick={onStopWatchEnd}>End</Button>:null}
        </div>
      </div>
      <div className="mx-auto flex  justify-center mt-4" >

        <SeshCount/>
      </div>
      <GoalDialog />
    </>
  );
}
