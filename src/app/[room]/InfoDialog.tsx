"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import usePersistState from "@/hooks/usePersistState"
import { DialogClose } from "@radix-ui/react-dialog"
import { Info } from "lucide-react"
import { ReactNode } from "react"
 
function InfoDialog({title,desc}:{title:string;desc:string| ReactNode}) {
  const [open,setOpen]=usePersistState(true,`infoDialog${title+desc}`)
  return (
       <Dialog open={open} >
      <DialogTrigger asChild onClick={()=>setOpen(true)}>
        <Button variant="outline"><Info /></Button>
      </DialogTrigger>
      <DialogContent className=" flex flex-col gap-2 z-10000 [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle className="my-4">{title}</DialogTitle>
          <DialogDescription>
{desc}          </DialogDescription>
        </DialogHeader>
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div> */}
        <DialogFooter>
          <Button type="submit" onClick={()=>setOpen(false)}>Close</Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InfoDialog
