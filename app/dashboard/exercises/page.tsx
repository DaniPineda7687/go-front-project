"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { get } from "@/lib/api"
import { useRouter } from "next/navigation";
const getExercises = async () => {
  try {
    const response = await get("/exercise/get")
    return response.data
  } catch (error) {
    console.error("Error fetching exercises:", error)
    return []
  }
}

export default function ExerciseGallery() {
  const [exercises, setExercises] = useState([])
  const router = useRouter(); 
  useEffect(() => {
    const fetchExercises = async () => {
      const data = await getExercises()
      setExercises(data)
    }
    fetchExercises()
  }, [])

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <Button variant="default">Ejercicios</Button>
          <Button variant="ghost" onClick={() => router.push("/dashboard/routines")}>
            Rutinas</Button>
        </div>
        <Button variant="outline" className="text-sm">
          + Añadir ejercicio
        </Button>
      </div>
      <h2 className="text-2xl font-bold mb-1">Explora Ejercicios</h2>
      <p className="text-muted-foreground mb-6">Ejercicios destacados para ti. Actualizado diariamente.</p>
      <Separator className="mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {exercises.map((exercise:any, index) => (
          <Card
            key={index}
            className="relative rounded-lg overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="p-0 transition-transform duration-300 group-hover:scale-105">
              <img src={exercise.image} alt={exercise.title} className="w-full h-68 object-cover" />
            </CardHeader>
            <CardContent className="p-4 group-hover:hidden transition-opacity duration-300">
              <CardTitle className="text-lg font-semibold mb-2">{exercise.title}</CardTitle>
              <Badge variant="outline" className="mb-2">{exercise.level}</Badge>
            </CardContent>
            <div className="absolute inset-0 p-4 bg-black bg-opacity-60 backdrop-blur-sm text-white flex-col hidden group-hover:flex items-center justify-center transition-opacity duration-300">
              <h3 className="text-xl font-semibold mb-4">{exercise.title}</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {exercise.muscles.map((muscle:any, i:any) => (
                  <Badge key={i} variant="outline" className="bg-white bg-opacity-20 border-white text-white">
                    {muscle.name}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
