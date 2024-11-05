"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const exercises = [
  {
    title: "Press de banca inclinado con barra",
    trainer: "Carlos Musculoso",
    image: "https://eresfitness.com/wp-content/uploads/Press-de-banca-inclinado-con-barra-370x210.webp",
    level: "Avanzado",
    muscleGroup: "Piernas",
  },
  {
    title: "Press de banca con barra",
    trainer: "Laura Fuerza",
    image: "https://eresfitness.com/wp-content/uploads/2020/04/Press-de-banca-plano-con-barra-370x210.webp",
    level: "Medio",
    muscleGroup: "Pecho",
  },
  {
    title: "Sentadilla sumo en máquina Smith",
    trainer: "Roberto Power",
    image: "https://eresfitness.com/wp-content/uploads/Sentadilla-sumo-en-maquina-smith-370x210.webp",
    level: "Avanzado",
    muscleGroup: "Pierna",
  },
  {
    title: "Sentadilla silla en máquina Smith",
    trainer: "María Espalda",
    image: "https://eresfitness.com/wp-content/uploads/Sentadilla-silla-en-maquina-Smith-370x210.webp",
    level: "Medio",
    muscleGroup: "Espalda",
  },
  {
    title: "Press de hombros tras nuca en máquina Smith",
    trainer: "Sofía Potente",
    image: "https://eresfitness.com/wp-content/uploads/Press-de-hombros-detras-del-cuello-en-maquina-Smith.webp",
    level: "Principiante",
    muscleGroup: "Hombros",
  },
  {
    title: "Curl predicador a una mano con mancuerna",
    trainer: "Pedro Brazo",
    image: "https://eresfitness.com/wp-content/uploads/Curl-predicador-a-una-mano-con-mancuerna-370x210.webp",
    level: "Principiante",
    muscleGroup: "Bíceps",
  },
  {
    title: "Press cerrado en banco inclinado",
    trainer: "Lucía Tríceps",
    image: "https://eresfitness.com/wp-content/uploads/Press-de-banca-cerrado-en-banco-inclinado-370x210.webp",
    level: "Medio",
    muscleGroup: "Tríceps",
  },
  {
    title: "Hollow Hold",
    trainer: "Andrea Hombros",
    image: "https://eresfitness.com/wp-content/uploads/Hollow-Hold-1-370x210.webp",
    level: "Principiante",
    muscleGroup: "Abdomen",
  },
]

export default function ExerciseGallery() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <Button variant="default">Ejercicios</Button>
          <Button variant="ghost">Rutinas</Button>
        </div>
        <Button variant="outline" className="text-sm">
          + Añadir ejercicio
        </Button>
      </div>
      <h2 className="text-2xl font-bold mb-1">Explora Ejercicios</h2>
      <p className="text-muted-foreground mb-6">Ejercicios destacados para ti. Actualizado diariamente.</p>
      <Separator className="mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {exercises.map((exercise, index) => (
          <Card key={index} className="rounded-lg overflow-hidden">
            <CardHeader className="p-0">
              <img src={exercise.image} alt={exercise.title} className="w-full h-68 object-cover" />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{exercise.title}</CardTitle>
              <div className="flex space-x-2">
                <Badge variant="outline">{exercise.level}</Badge>
                <Badge variant="outline">{exercise.muscleGroup}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
