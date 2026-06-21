import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Compass, Heart } from "lucide-react"

const values = [
  {
    icon: Users,
    title: "Comunidade",
    description: "Faça parte de uma família unida por valores e aventuras",
  },
  {
    icon: Award,
    title: "Crescimento",
    description: "Desenvolva habilidades e conquiste especialidades",
  },
  {
    icon: Compass,
    title: "Aventura",
    description: "Explore a natureza e desafie seus limites",
  },
  {
    icon: Heart,
    title: "Valores",
    description: "Cultive princípios cristãos e cidadania",
  },
]

export function AboutSection() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Quem Somos</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            Clube de Desbravadores é uma organização mundial dedicada ao desenvolvimento integral de adolescentes
            através de atividades ao ar livre, ensino de valores e formação de caráter.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title} className="border-none bg-card/50 backdrop-blur">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="rounded-full bg-primary p-3">
                  <value.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
