"use client"

import { Divide, TrendingUp } from "lucide-react"
import { Pie, PieChart, Cell } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// 10 rating colors
const ratingColors = [
  "#FF595E",
  "#FF924C",
  "#FFCA3A",
  "#8AC926",
  "#52B788",
  "#1982C4",
  "#6A4C93",
  "#B388EB",
  "#FFB5A7",
  "#D62828",
]

const chartConfig = {
  total: {
    label: "Session ratings",
  },
} satisfies ChartConfig

export function RatingPie({ data }: { data: { rating: number; total: number }[] }) {
  // Filter out zero totals and add a placeholder if no data
  const filteredData = data.filter((item) => item.total > 0)
  const displayData = filteredData.length > 0 ? filteredData : [{ rating: 0, total: 1 }]

  return (
    <Card className="flex flex-col mb-6 sm:mb-0 w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Session Ratings Distribution</CardTitle>
        <CardDescription>This Week's Study Sessions</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
{filteredData.length> 0 &&            <ChartTooltip content={<ChartTooltipContent hideLabel={false} />} />}
            <Pie
              data={displayData}
              dataKey="total"
              nameKey="rating"
             // label={filteredData.length > 0 ? true : false}
              outerRadius={80}
              innerRadius={40}
              paddingAngle={3}
            >
              {
                displayData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={filteredData.length > 0 ? ratingColors[index % ratingColors.length] : "#e5e7eb"}
                />
              ))
              
              }
              
            </Pie>

           {filteredData.length>0 && <ChartLegend
              content={({payload}) => {
                
  if (!payload || !payload.length) return null;
  return(
    <div className="flex flex-row gap-2 text-sm items-center justify-center" key={Date.now()}>
        {payload.map((entry, index) => (
           <div className="flex gap-2 flex-row items-center mr-2">
            <div 
            style={{ backgroundColor: entry.color }}
            className={`  w-3 h-3 rounded-sm inline-block `} />

            
            <div className="self-center ">
                {entry.value}
            </div>
           </div>
        ))}
    </div>
  )
              }}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />}
          </PieChart>
        </ChartContainer>
         {/* {filteredData.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {filteredData.map((entry, index) => (
                <div key={entry.rating} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ratingColors[index % ratingColors.length] }}
                  />
                  <span className="font-medium">Rating {entry.rating}</span>
                  <span className="text-muted-foreground">({entry.total})</span>
                </div>
              ))}
            </div>
          )} */}
        {filteredData.length === 0 && (
          <div className="text-center text-muted-foreground text-sm mt-4">No session ratings available</div>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="text-muted-foreground leading-none">Showing rating distribution for this week's sessions</div>
      </CardFooter>
    </Card>
  )
}

// // Example usage with sample data
// export default function Component() {
//   const sampleData = [
//     {
//       rating: 5,
//       total: 3,
//     },
//     {
//       rating: 4,
//       total: 2,
//     },
//     {
//       rating: 3,
//       total: 2,
//     },
//     {
//       rating: 2,
//       total: 1,
//     },
//     {
//       rating: 8,
//       total: 1,
//     },
//   ]

//   return <RatingPie data={sampleData} />
// }
