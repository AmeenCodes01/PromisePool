"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQueries, useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"

export function Board() {

function formatMinutes(totalMinutes:number| undefined) {
    if(totalMinutes==undefined)return;

  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

console.log(formatMinutes(5));   // "00 hr 05 min"

    const rankings = useQuery(api.leaderboard.get)

    const data = [rankings,rankings,rankings]
  return (
    <Table className=" ">
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader className="sticky top-0 bg-accent">
        <TableRow>
          <TableHead className="w-[100px]">Ranking</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Time <span className="text-muted-foreground text-sm"> (hh:mm) </span></TableHead>
          <TableHead className="text-right">Coins</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rankings?.map((user,i) => (
          <TableRow key={user._id}>
            <TableCell className="font-medium">{i}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatMinutes(user?.totalDuration)}</TableCell>
            <TableCell className="text-right">{user.pCoins}</TableCell>
          </TableRow>
        ))}
       
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  )
}
