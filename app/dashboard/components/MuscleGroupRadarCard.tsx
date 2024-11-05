"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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

export const description = "A radar chart with muscle groups worked"

const chartData = [
  { muscleGroup: "Chest", weight: 186 },
  { muscleGroup: "Back", weight: 285 },
  { muscleGroup: "Legs", weight: 237 },
  { muscleGroup: "Shoulders", weight: 203 },
  { muscleGroup: "Arms", weight: 209 },
  { muscleGroup: "Core", weight: 264 },
]

const chartConfig = {
  weight: {
    label: "Weight",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function MuscleGroupRadarCard() {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Grupos musculares trabajados</CardTitle>
        <CardDescription>
            Mostrando la intensidad para diferentes grupos musculares
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid className="fill-[--color-weight] opacity-20" />
            <PolarAngleAxis dataKey="muscleGroup" />
            <Radar
              dataKey="weight"
              fill="var(--color-weight)"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  )
}
