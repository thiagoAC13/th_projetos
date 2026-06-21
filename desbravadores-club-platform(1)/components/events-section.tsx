import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import Link from "next/link"

const upcomingEvents = [
  {
    id: 1,
    title: "Trilha na Serra",
    date: "15 de Junho, 2024",
    location: "Parque Nacional",
    description: "Caminhada de 10km com acampamento noturno",
  },
  {
    id: 2,
    title: "Workshop de Sobrevivência",
    date: "22 de Junho, 2024",
    location: "Base do Clube",
    description: "Aprenda técnicas essenciais de sobrevivência na natureza",
  },
  {
    id: 3,
    title: "Acampamento de Verão",
    date: "10-15 de Julho, 2024",
    location: "Lago Azul",
    description: "Semana completa de aventuras, esportes e comunidade",
  },
]

export function EventsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Próximos Eventos</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            Participe das nossas atividades e crie memórias inesquecíveis
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/calendario">Ver Calendário Completo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
