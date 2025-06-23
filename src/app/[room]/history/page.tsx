import React from "react";
import { ChartBarLabel } from "./components/BarChart";
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "../../../../convex/_generated/api";
import Component, { RatingPie } from "./components/RatingPie";
import { TimeLine } from "./components/TimeLine";

const sessionData = [
  {
    day: "Mon",
    data: [
      { duration: 60, rating: 5, room: "publicroom", userId: "user1" },
      { duration: 45, rating: 5, room: "publicroom", userId: "user4" }
    ]
  },
  {
    day: "Tue",
    data: [
      { duration: 90, rating: 4, room: "publicroom", userId: "user2" }
    ]
  },
  {
    day: "Wed",
    data: [
      { duration: 120, rating: 3, room: "publicroom", userId: "user3" }
    ]
  },
  {
    day: "Thu",
    data: [
      { duration: 30, rating: 2, room: "publicroom", userId: "user5" },
      { duration: 75, rating: 4, room: "publicroom", userId: "user6" }
    ]
  },
  {
    day: "Fri",
    data: [
      { duration: 110, rating: 5, room: "publicroom", userId: "user7" }
    ]
  },
  {
    day: "Sat",
    data: [
      { duration: 50, rating: 3, room: "publicroom", userId: "user8" }
    ]
  },
  {
    day: "Sun",
    data: []
  }
];

async function Page() {

  const token = await convexAuthNextjsToken();

  const weekly = await fetchQuery(api.history.getWeekly, {}, { token });
  
  console.log(weekly, " weekly data");
// get duration for each day and total duration

const dayTotals = weekly.map(day=>{
  const total = day.data.reduce((sum, session) => sum + session.duration, 0);
  return { day: day.day, total };
})

//sun 0 mon1 tue2 wed3   
const weeklyRatings: {rating:number;total:number}[] = []

weekly.forEach((day) => {
  day.data.forEach((session) => {
    if (session.rating) {
      const existing = weeklyRatings.find(r => r.rating === session.rating);
      if (existing) {
        existing.total += 1;
      } else {
        weeklyRatings.push({ rating: session.rating, total: 1 });
      }
    }
  });
});
console.log(weeklyRatings, " weekly rati")

const date = new Date();

const todayDay = date.getDay();
const index = todayDay === 0 ? 6 : todayDay - 1; // Convert to 0-Mon, 1-Tue, ..., 6-Sun
console.log(index, " today index");

  return <div className="w-full  h-fit  p-4 flex flex-col">
<div className="w-full justify-center items-center md:items-start md:justify-normal h-full  p-4 flex md:flex-row flex-col gap-4 " >

<div className="w-fit h-fit flex">

<ChartBarLabel data={dayTotals}/>
</div>
<div className="w-fit h-fit flex">

<RatingPie data={weeklyRatings}/>
</div>
{/* //Weekly first */}
</div>
<div className="w-fit h-fit flex min-w-[200px]">
<TimeLine data={weekly[2].data}/>
</div>

  </div>;
}

export default Page;
