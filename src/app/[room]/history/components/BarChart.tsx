"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useEffect } from "react";

export const description = "A bar chart with a label";

const chartData = [
  { day: "Mon", total: 186, label: "3hr 6m" },
  { day: "Tue", total: 305, label: "3hr 6m" },
  { day: "Wed", total: 237, label: "3hr 6m" },
  { day: "Thu", total: 73, label: "1hr 13m" },
  { day: "Fri", total: 209, label: "3hr 6m" },
  { day: "Sat", total: 214, label: "3hr 6m" },
  { day: "Sun", total: 214, label: "3hr 6m" },
];

const chartConfig = {
  label: {
    label: "label",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

//min into dec hours.min but label different

export function ChartBarLabel() {
  const weeklyData = useQuery(api.history.getWeekly);
  console.log(weeklyData, " weeklyData");

  const maxMinutes =
    weeklyData && weeklyData.length
      ? Math.max(...weeklyData.map((d) => d.total))
      : 0;

  const maxHours = Math.ceil(maxMinutes / 60);
  const upperBound = Math.max(Math.ceil((maxHours + 2) / 2) * 2, 2); // at least 2

    const now = new Date();
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

const startMonth = weekStart.toLocaleString('default', { month: 'short' });
const endMonth = weekStart.toLocaleString('default', { month: 'short' });
const startYear = weekStart.toLocaleString('default', { year: 'numeric' });
const endYear = weekEnd.toLocaleString('default', { year: 'numeric' });


  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Total Study Time </CardTitle>
        <CardDescription>{weekStart.getDate()} {startMonth === endMonth? null:startMonth} - {weekEnd.getDate()} {endMonth} {endYear}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <ResponsiveContainer width={"100%"} height={300}> */}

        <ChartContainer
          config={chartConfig}
          className=" w-auto h-auto min-w-[300px] flex"
        >
          <BarChart
            accessibilityLayer
            data={weeklyData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <YAxis
              type="number"
              domain={[0, upperBound * 60]}
              ticks={Array.from(
                { length: upperBound / 2 + 1 },
                (_, i) => i * 120
              )}
              tickFormatter={(value) => `${value / 60}h`}
            />

            <ChartTooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              content={({ payload }) => {
                if (!payload || !payload.length) return null;
                const value = payload[0].value;
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                return (
                  <div className="p-2 rounded bg-[var(--chart-2)] shadow text-sm">
                    {/* <div className="font-medium">{payload[0].payload.day}</div> */}
                    <div className=" text-sm">
                      {hours > 0
                        ? `${hours}h${minutes ? ` ${minutes}m` : ""}`
                        : `${minutes}m`}
                    </div>
                  </div>
                );
              }}
            />

            <Bar
              dataKey="total"
              activeIndex={2}
              minPointSize={1}
              fill="var(--chart-2)"
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                dataKey="label"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
        {/* </ResponsiveContainer> */}
      </CardContent>
    </Card>
  );
}
