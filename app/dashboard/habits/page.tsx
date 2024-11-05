"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DoughnutChart from "../components/CicleGraph"
import BarGraph from "../components/BarGraph"

// Datos de asistencia simulados
const attendanceData = {
  this_week: [
    { day: "Monday", attended: true },
    { day: "Tuesday", attended: false },
    { day: "Wednesday", attended: true },
    { day: "Thursday", attended: true },
    { day: "Friday", attended: false },
    { day: "Saturday", attended: true },
    { day: "Sunday", attended: false },
  ]
}
const exercises = [
  { name: 'Push-ups', count: 30 },
  { name: 'Squats', count: 20 },
  { name: 'Pull-ups', count: 10 },
  { name: 'Lunges', count: 15 },
  { name: 'Planks', count: 25 },
  { name: 'Burpees', count: 18 },
  { name: 'Sit-ups', count: 22 },
  { name: 'Deadlifts', count: 12 },
  { name: 'Bench Press', count: 14 },
  { name: 'Bicep Curls', count: 16 },
]
const initialGraphData = {
  last_week: 70,
  last_month: 75
}

export default function Habits() {
  const [days, setDays] = useState(attendanceData.this_week)
  const [graphData, setGraphData] = useState({
    this_week: calculateAttendancePercentage(attendanceData.this_week),
    ...initialGraphData
  })

  function calculateAttendancePercentage(weekData:any) {
    const attendedDays = weekData.filter((day:any)=> day.attended).length
    return Math.round((attendedDays / weekData.length) * 100)
  }

  const toggleAttendance = (index:any) => {
    const updatedDays = [...days]
    updatedDays[index].attended = !updatedDays[index].attended
    setDays(updatedDays)
    
    setGraphData(prevGraphData => ({
      ...prevGraphData,
      this_week: calculateAttendancePercentage(updatedDays)
    }))
  }

  return (
    <>
    <h1 className="text-2xl font-semibold">Habits</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        
        {/* Columna de Gráficos */}
        <div>
          <hr />
          <h2 className="text-lg font-semibold">History Attendance</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 p-4">
            <DoughnutChart percentage={graphData.this_week} title="Current Week" color="#4caf50" />
            <DoughnutChart percentage={graphData.last_week} title="Last Week" color="#0683C1" />
            <DoughnutChart percentage={graphData.last_month} title="Last Month" color="#C8BE04" />
          </div>
          <hr />
          <h2 className="text-lg font-semibold">Top Exercises</h2>
          <BarGraph data={exercises} />
        </div>

        {/* Columna de Asistencias Semanales */}
        <div>
          <hr></hr>
          <h2 className="text-lg font-semibold">Current Week Attendance</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 p-4">
            {days.map((item, index) => (
              <Card key={index} className="flex flex-col items-center">
                <CardHeader className="text-center">
                  <CardTitle>{item.day}</CardTitle>
                  <CardDescription>Gym Attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant={item.attended ? "default" : "outline"}
                    className="w-full"
                    onClick={() => toggleAttendance(index)}
                  >
                    {item.attended ? (
                      <>
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Attended
                      </>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4 text-red-500" />
                        Not Attended
                      </>
                    )}
                  </Button>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  Tap to mark attendance
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
