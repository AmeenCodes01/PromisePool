"use client";
import { useMutation, useQuery } from "convex/react";
import { notFound, redirect } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import usePersistState from "@/hooks/usePersistState";
import { Id } from "../../../convex/_generated/dataModel";

const CheckPass = ({
  password,
  onVerify,
  onCancel,
}: {
  password: string;
  onVerify: () => void;
  onCancel: () => void;
}) => {
  const [open, setOpen] = useState(true);
  const [pass, setPass] = useState("");
  const [error, setError] = useState<null | string>(null);

  const checkPass = () => {
    if (pass === password) {
      setOpen(false);
      // add to owner rooms.
      onVerify();
    } else {
      setError("Wrong password");
    }
  };
  return (
    //get password.
    <AlertDialog
      defaultOpen={true}
      open={open}
      onOpenChange={() => setOpen(false)}
    >
      {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter Room Password</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <Input value={pass} onChange={(e) => setPass(e.target.value)} />
        {error && <p className="text-red-400 text-sm"> {error} </p>}
        <AlertDialogFooter>
          <AlertDialogCancel asChild={true} onClick={onCancel}>Cancel</AlertDialogCancel>
          <Button onClick={checkPass}>Continue</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

function CheckPrivate({ roomId }: { roomId: string }) {
  const user = useQuery(api.users.current);
  const [verified, setVerified] = usePersistState(
    false,
    `${user?.roomId}Verify`
  );
  const roomInfo = useQuery(api.rooms.getOne, { id: roomId as Id<"rooms"> });
  const addRoom = useMutation(api.rooms.add);
  const onVerified = () => {
    setVerified(true);
    roomInfo ? addRoom({ id: roomInfo?._id }) : null;
  };

  if (roomInfo?.type === "private") {
    if (user?._id !== roomInfo?.owner_id) {
    // if it's not user's private room, redirect to user private room.s
      redirect(`/${user?.roomId}/timer`);
    }
  }

  const onCancel = () => {
    redirect(`/${user?.roomId}/timer`);
  };
  
  if (
    roomInfo?.type === "group" &&
    (!(user?.roomIds && user?.roomIds.includes(roomInfo._id)) )
  ) {
    console.log(roomInfo, " roominfo")
    return (
      <div>
        <CheckPass
          password={roomInfo.password as string}
          onVerify={onVerified}
          onCancel={onCancel}
        />
      </div>
    );
  }

  //if private, check if username & room same.
  //if group, ask for password
  //if public, do nothing.

  return <></>;
}

export default CheckPrivate;
