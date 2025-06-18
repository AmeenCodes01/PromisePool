import { Button } from "@/components/ui/button";
import React from "react";
import Setting from "../../timer/components/Setting";
import { Play, Pause, TimerReset } from "lucide-react";
import { usePromiseStore } from "@/hooks/usePromiseStore";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function TimerDisplay({
  SettingWithProps,
  pause,
  showExitBtn,
  onPause,
  onSeshStart,
  onSeshReset,
}: {
  pause: boolean;
  showExitBtn: boolean;
  onPause?: () => void;
  onSeshStart: () => void;
  onSeshReset: () => void;
  SettingWithProps: () => React.JSX.Element;
}) {
  const { secLeft, workMin, mode, onChangeMode, groupSesh } = usePromiseStore(
    (state) => state
  );

  const playing = secLeft !== 0 && mode === "work" && secLeft !== workMin * 60;

  const hours = Math.floor(Math.floor(secLeft / 60) / 60);

  const minutes =
    Math.floor(secLeft / 60) >= 60
      ? hours * 60 - Math.floor(secLeft / 60)
      : Math.floor(secLeft / 60);

  const seconds = Math.floor(secLeft % 60);

  return (
    <div className="items-center gap-4 flex flex-col justify-end py-6 flex-1  ">
      <div className="flex flex-row  gap-2 ml-6 ">
        <Button
          className="text-xs border-[2px]  "
          variant={mode == "break" ? "outline" : "default"}
          onClick={() => onChangeMode("work")}
          disabled={playing}
        >
          Work
        </Button>
        <Button
          className="text-xs  border-[2px]"
          disabled={playing}
          variant={mode == "work" ? "outline" : "default"}
          onClick={() => onChangeMode("break")}
        >
          Break
        </Button>

        <SettingWithProps />
      </div>
      <div className="flex flex-row  relative ">
        <div className="shrink-0 flex">
          {hours !== 0 && (
            <span className="text-8xl font-mono">
              {hours < 10 ? "0" + hours : hours}:
            </span>
          )}
          <span className="text-8xl font-mono">
            {minutes < 10 ? "0" + minutes : minutes}:
          </span>
          <span className="text-6xl font-mono">
            {seconds < 10 ? "0" + seconds : seconds}
          </span>
        </div>
        <div className=" pl-2 "></div>
      </div>
      <div className="flex flex-row gap-4 ml-8   ">
        {pause ? (
          <button>
            <Play onClick={() => onSeshStart()} />
          </button>
        ) : (
          <>{onPause ? <Pause onClick={() => onPause()} /> : null}</>
        )}
        {groupSesh ?
        <Dialog>
          <DialogTrigger>
            <button>{groupSesh && showExitBtn? <Button size={"sm"}>Exit/End</Button> :<TimerReset />} </button>
          </DialogTrigger>
          <ConfirmDialog
            title="Exit Group Session"
            desc="Do you want to exit group session ?"
            onConfirm={onSeshReset}
          />
        </Dialog>:
                    <button onClick={()=>onSeshReset()}><TimerReset /> </button>

        }
      </div>
    </div>
  );
}
