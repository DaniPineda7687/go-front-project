"use client";

import { Bar, BarChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A stacked bar chart with a legend";

const chartData = [
  { date: "2024-07-15", benchPress: 200, pullUps: 150, rows: 100 },    // Lunes - Pecho y Espalda
  { date: "2024-07-16", bicepCurl: 120, tricepExtension: 180, dips: 100 }, // Martes - Bicep y Tricep
  { date: "2024-07-17", squats: 250, lunges: 150, legPress: 200 },     // Miércoles - Piernas
  { date: "2024-07-18", benchPress: 200, pullUps: 150, rows: 100 },    // Jueves - Pecho y Espalda
  { date: "2024-07-19", bicepCurl: 120, tricepExtension: 180, dips: 100 }, // Viernes - Bicep y Tricep
  { date: "2024-07-20", squats: 250, lunges: 150, legPress: 200 },     // Sábado - Piernas
];

const chartConfig = {
  benchPress: {
    label: "Bench Press",
    color: "hsl(var(--chart-1))",
  },
  pullUps: {
    label: "Pull-Ups",
    color: "hsl(var(--chart-2))",
  },
  rows: {
    label: "Rows",
    color: "hsl(var(--chart-3))",
  },
  bicepCurl: {
    label: "Bicep Curl",
    color: "hsl(var(--chart-4))",
  },
  tricepExtension: {
    label: "Tricep Extension",
    color: "hsl(var(--chart-5))",
  },
  dips: {
    label: "Dips",
    color: "hsl(var(--chart-6))",
  },
  squats: {
    label: "Squats",
    color: "hsl(var(--chart-7))",
  },
  lunges: {
    label: "Lunges",
    color: "hsl(var(--chart-8))",
  },
  legPress: {
    label: "Leg Press",
    color: "hsl(var(--chart-9))",
  },
} satisfies ChartConfig;

export function ExerciseDistributionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Ejercicios</CardTitle>
        <CardDescription>Ejercicios diarios por grupo muscular</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                });
              }}
            />
            <Bar dataKey="benchPress" stackId="a" fill="var(--color-benchPress)" />
            <Bar dataKey="pullUps" stackId="a" fill="var(--color-pullUps)" />
            <Bar dataKey="rows" stackId="a" fill="var(--color-rows)" />
            <Bar dataKey="bicepCurl" stackId="a" fill="var(--color-bicepCurl)" />
            <Bar dataKey="tricepExtension" stackId="a" fill="var(--color-tricepExtension)" />
            <Bar dataKey="dips" stackId="a" fill="var(--color-dips)" />
            <Bar dataKey="squats" stackId="a" fill="var(--color-squats)" />
            <Bar dataKey="lunges" stackId="a" fill="var(--color-lunges)" />
            <Bar dataKey="legPress" stackId="a" fill="var(--color-legPress)" />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
