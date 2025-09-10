"use client"; // for Next.js 13+ app directory

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ShareLink({password, roomId}:{password:string| undefined;roomId:string }) {
  const [copied, setCopied] = useState(false);
    console.log(roomId, password, " sharelink props")
  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(`Heyy, join my private group at https://promise-pool.vercel.app/${roomId}. ${password && `The password is: ${password}. Keep it secure!`} `);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div  className="">
      
      <Button
        onClick={copyText}
      >
        {copied ? "Copied!" : "Click to copy invite"}
      </Button>
    </div>
  );
}
