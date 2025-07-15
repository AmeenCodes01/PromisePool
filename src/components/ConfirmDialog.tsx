import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

function ConfirmDialog({
  title,
  desc,
  onConfirm,
}: {
  title: string;
  desc: string;
  onConfirm: (start: boolean) => void;
}) {

  
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{desc} </DialogDescription>
      </DialogHeader>

      <DialogFooter className="justify-center ">
        <DialogClose asChild={true}>
          <Button type="submit" onClick={() => onConfirm(true)}>
            Confirm
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

export default ConfirmDialog;
