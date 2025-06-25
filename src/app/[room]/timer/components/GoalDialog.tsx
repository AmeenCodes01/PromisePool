"use client";

import { usePromiseStore } from "@/hooks/usePromiseStore";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import calcReward from "@/lib/calcReward";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useCallback, useEffect, useState } from "react";
import useCountdown from "./useCountdown";
import useGroupCountdown from "@/hooks/useGroupCountdown";
import usePersistState from "@/hooks/usePersistState";
import { set } from "react-hook-form";

function GoalDialog() {

  const [goal, setGoaltxt]=useState("")  

  const {workMin,onChangeMode, goalOpen, setGoalOpen,setGoal } = usePromiseStore((state) => state);



  return (
    <div>
      <AlertDialog open={goalOpen} defaultOpen={goalOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Set a goal for this session</AlertDialogTitle>

          <Input
            className=""
            
            onChange={(e) =>
             setGoaltxt(e.target.value)
            }
          />
          <span className="italic text-sm ">What do you plan to achieve in this session ?</span>
          
          <AlertDialogFooter className="sm:justify-end flex flex-row">
            <Button
              className="justify-end w-fit "
             onClick={() => {
                setGoal(goal)
                    setGoalOpen(false)
}}

  
            >
               Lesgoo            </Button>
           
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default GoalDialog;
