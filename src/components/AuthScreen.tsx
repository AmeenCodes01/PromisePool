import {Button} from "@/components/ui/button";
import {SignInButton} from "@clerk/nextjs";

import Link from "next/link";
function AuthScreen() {
  return (
    <div className="flex items-center flex-col justify-center">

      <SignInButton >
        <Button>Login</Button>
      </SignInButton>

      <p className="text-xs mt-4 text-blue-500">
        Implementing Microsoft login soon
      </p>
    </div>
  );
}

export default AuthScreen;
