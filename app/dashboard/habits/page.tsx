"use client"

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

const days = [
  { day: "Monday", visited: false },
  { day: "Tuesday", visited: false },
  { day: "Wednesday", visited: false },
  { day: "Thursday", visited: false },
  { day: "Friday", visited: false },
  { day: "Saturday", visited: false },
  { day: "Sunday", visited: false },
]

export default function Habits() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
      {days.map((item, index) => (
        <Card key={index} className="flex flex-col items-center">
          <CardHeader className="text-center">
            <CardTitle>{item.day}</CardTitle>
            <CardDescription>Gym Attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant={item.visited ? "default" : "outline"}
              className="w-full"
            >
              {item.visited ? (
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
  )
}
