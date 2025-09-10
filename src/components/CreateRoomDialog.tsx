"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { ConvexError } from "convex/values"

const formSchema = z.object({
  name: z.string()
    .min(5, { message: "Name must be at least 5 characters & no spaces" })
    ,
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
});


 function CreateRoomDialog({onCreated}:{onCreated:()=>void}) {
    const createRoom = useMutation(api.rooms.create)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          password:"",
        },
      })
     const router = useRouter()
      async function onSubmit(values: z.infer<typeof formSchema>) {
         try{

        const roomId=  await createRoom({type:"group", name: values.name, password:values.password })
          console.log(roomId)
          onCreated()
      roomId &&    router.push(`/${roomId}`)
        
        }catch(error){
          const errorMessage = error instanceof ConvexError
          ? (error.data as { message: string }).message
          : "Unexpected error occurred";
          
          form.setError("name", {message:errorMessage})
        }
      }

  return (
    <DialogContent >
 <DialogHeader>
      <DialogTitle>Create room</DialogTitle>
      <DialogDescription>
       Create room and share to study with friends. 
      </DialogDescription>
    </DialogHeader>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room name</FormLabel>
              <FormControl>
                <Input placeholder="room name" {...field} />
              </FormControl>
               { form.formState.errors.name && <p>{form.formState.errors.name.message}</p>}
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
    <DialogFooter className="sm:justify-start  ">
        <Button type="submit">Create</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
            <span className="text-sm italic font-semibold pl-2  my-auto ">Please refresh after closing.</span>
        </DialogFooter>
      </form>

    </Form>
          </DialogContent>
  )
}
export default CreateRoomDialog