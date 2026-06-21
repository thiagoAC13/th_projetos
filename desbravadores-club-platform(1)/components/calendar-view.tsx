import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Trilha na Serra",
    date: "2024-06-15",
    time: "08:00",
    location: "Parque Nacional",
    participants: 25,
    description: "Caminhada de 10km com acampamento noturno",
  },
  {
    id: 2,
    title: "Workshop de Sobrevivência",
    date: "2024-06-22",
    time: "14:00",
    location: "Base do Clube",
    participants: 30,
    description: "Aprenda técnicas essenciais de sobrevivência na natureza",
  },
  {
    id: 3,
    title: "Acampamento de Verão",
    date: "2024-07-10",
    time: "09:00",
    location: "Lago Azul",
    participants: 50,
    description: "Semana completa de aventuras, esportes e comunidade",
  },
]

export function CalendarView() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Calendário de Eventos</h1>
          <p className="max-w-2xl text-lg text-muted-foreground text-pretty">
            Confira todos os eventos programados e não perca nenhuma aventura
          </p>
        </div>

        <div className="space-y-6">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">{event.title}</CardTitle>
                    <CardDescription className="text-base">{event.description}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 text-sm md:text-right">
                    <div className="flex items-center gap-2 md:justify-end">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(event.date).toLocaleDateString("pt-BR")} às {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 md:justify-end">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 md:justify-end">
                      <Users className="h-4 w-4" />
                      <span>{event.participants} participantes</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
