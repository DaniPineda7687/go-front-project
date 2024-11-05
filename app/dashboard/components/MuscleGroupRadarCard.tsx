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
  { muscleGroup: "Chest", desktop: 186 },
  { muscleGroup: "Back", desktop: 285 },
  { muscleGroup: "Legs", desktop: 237 },
  { muscleGroup: "Shoulders", desktop: 203 },
  { muscleGroup: "Arms", desktop: 209 },
  { muscleGroup: "Core", desktop: 264 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
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
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid className="fill-[--color-desktop] opacity-20" />
            <PolarAngleAxis dataKey="muscleGroup" />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  )
}
