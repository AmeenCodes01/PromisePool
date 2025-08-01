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
import { useState } from "react";

function GoalDialog() {

  const { goalOpen, setGoalOpen,setGoal, goal:goalprev } = usePromiseStore((state) => state);
  const [goal, setGoaltxt]=useState(goalprev)  




  return (
    <div>
      <AlertDialog open={goalOpen} defaultOpen={goalOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Set a goal for this session</AlertDialogTitle>

          <Input
            className=""
            value={goal}
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
