import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner"
import { ConvexError } from "convex/values";
export function SignInWithPassword({
  provider,
  handleSent,
  handlePasswordReset,
  customSignUp: customSignUp,
  passwordRequirements,
}: {
  provider?: string;
  handleSent?: (email: string) => void;
  handlePasswordReset?: () => void;
  customSignUp?: React.ReactNode;
  passwordRequirements?: string;
}) {
  
    const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);


  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
         const name = formData.get("name") as string;

  if (!name || name.trim() === "") {
    toast.error("Please enter a username.");
    return;
  }
        formData.set("email",formData.get("name")as string)
       
          signIn(provider ?? "password", formData)
          .then(() => {
            handleSent?.(formData.get("email") as string);
          })
          .catch((error) => {
   
            let toastTitle: string;
            if (
              error instanceof ConvexError &&
              error.data === "INVALID_PASSWORD"
            ) {
              console.log(error.data,"data")
              toastTitle =
              "Invalid password";
            } else {
              console.log("erro")
              toastTitle =  error?.message.includes("INVALID_PASSWORD") ? "Invalid password" : flow === "signIn" ? "Invalid username or password" : "Error signing up";
         
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
      }}
    >
      <div className="hidden">

      <label htmlFor="email">Email</label>
      <Input name="email" id="email" className="mb-4" autoComplete="email" defaultValue={""}/>
      </div>
      <label htmlFor="name">Username</label>
      <Input name="name" id="name" className="mb-4" autoComplete="username"/>
      {/* <span className="text-sm italic">Please use </span> */}
      <div className="flex items-center justify-between">
        <label htmlFor="password">Password</label>
        {handlePasswordReset && flow === "signIn" ? (
          <Button
            className="p-0 h-auto"
            type="button"
            variant="link"
            onClick={handlePasswordReset}
          >
            Forgot your password?
          </Button>
        ) : null}
      </div>
      <Input
        type="password"
        name="password"
        id="password"
        autoComplete={flow === "signIn" ? "current-password" : "new-password"}
      />
      {flow === "signUp" && passwordRequirements !== null && (
        <span className="text-gray-500 font-thin text-sm">
          {passwordRequirements}
        </span>
      )}
      {flow === "signUp" && customSignUp}
      <input name="flow" value={flow} type="hidden" />
      <Button type="submit" disabled={submitting} className="mt-4">
        {flow === "signIn" ? "Sign in" : "Sign up"}
      </Button>
      <Button
        variant="link"
        type="button"
        onClick={() => {
          setFlow(flow === "signIn" ? "signUp" : "signIn");
        }}
      >
        {flow === "signIn"
          ? "Don't have an account? Sign up"
          : "Already have an account? Sign in"}
      </Button>
    </form>
  );
}