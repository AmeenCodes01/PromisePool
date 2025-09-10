"use client"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import countryNames from "@/data/countryNames.json"
import { useMutation } from "convex/react";
import { useState } from "react"
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Doc } from "../../../../../convex/_generated/dataModel";
interface country {
    label:string;
    value:string;
    timezone:string;
    coordinates:number[]
}

export default function CountryDropDown({users}:{users:Doc<"users">[]|undefined;}){
   
   
    const [country,setCountry]=useState<country | null>(null);
    const [color,setColor]=useState("")
    const colorCountries = users?.map((u) => u?.country);

    const addToMap = useMutation(api.users.addCountry);

    const Add = async()=>{
        const newColor = country &&  !colorCountries?.includes(country.label)
        console.log(newColor)
        if(country){
            if(newColor ){

//newColor then color state else pull from users. 
color!==""?                
await addToMap({country: country.label, coords: country.coordinates, timezone:country.timezone, color:color})
           :     toast.error("Please add valid colour")
            }else{
                const sameCountryUser = users?.filter((u)=> u.country === country.label)[0]
                
                       sameCountryUser && sameCountryUser.countryprops?.color &&    await addToMap({country: country.label, coords: country.coordinates, timezone:country.timezone, color:sameCountryUser.countryprops?.color})
            }
            //get color from users.
            
        }else{
            toast.error("Please add Country")
        }
    }


    console.log(color, " color")
    return (
        <div className="w-full border-2 p-4 flex flex-row gap-16">
  <div>

  <DropdownMenu>
    <div className="flex flex-col gap-2 w-fit">

  <DropdownMenuTrigger asChild >
    <Button variant={"secondary"}>
   { country && country.label ? country.label : " Enter Your Country"}
    </Button>
    </DropdownMenuTrigger>
    </div>
    <span className="text-xs italic text-primary">Enter country to add on Map</span>
  <DropdownMenuContent>
   {countryNames.map((c)=>

    <DropdownMenuItem key={c.value} onClick={()=>setCountry(c)} >{c.label}</DropdownMenuItem>
)}
  
  </DropdownMenuContent>
</DropdownMenu>
  </div>

{ colorCountries && country && !colorCountries.includes(country.label) ?
<div className="flex flex-col gap-2">
<input type="color"  value={color} onChange={(e)=> setColor(e.target.value)} />
<span className="text-xs italic text-primary">Choose color to represent country on Map</span>
 
</div>


:null}

<Button className="ml-auto" onClick={()=>Add()}>
    Add to Map 
</Button>
        </div>
    )
}