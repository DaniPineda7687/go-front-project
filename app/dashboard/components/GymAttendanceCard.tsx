"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A multiple bar chart"

const chartData = [
  { day: "Monday", attendance: 100 },
  { day: "Tuesday", attendance: 100 },
  { day: "Wednesday", attendance: 0 },
  { day: "Thursday", attendance: 100 },
  { day: "Friday", attendance: 0 },
  { day: "Saturday", attendance: 0 },
  { day: "Sunday", attendance: 100 },
]

const chartConfig = {
  attendance: {
    label: "attendance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function GymAttendanceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asistencia al gimnasio</CardTitle>
        <CardDescription>Datos de la ultima semana</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  )
}
