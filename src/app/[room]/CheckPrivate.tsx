"use client";
import { useUser } from "@clerk/clerk-react";
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

function CheckPrivate({ room }: { room: string }) {
  const user = useQuery(api.users.current);
  const [verified, setVerified] = usePersistState(
    false,
    `${room}${user?._id}Verify`
  );
  const roomInfo = useQuery(api.rooms.getOne, { name: room });
  const addRoom = useMutation(api.rooms.add);
  const onVerified = () => {
    setVerified(true);
    roomInfo ? addRoom({ id: roomInfo?._id }) : null;
  };

  if (roomInfo?.type === "private") {
    if (user?.name !== room) {
      redirect(`/${user?.name}/timer`);
    }
  }

  const onCancel = () => {
    redirect(`/${user?.name}/timer`);
  };
  
  if (
    roomInfo?.type === "group" &&
    (!(user?.roomIds && user?.roomIds.includes(roomInfo._id)) )
  ) {
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
