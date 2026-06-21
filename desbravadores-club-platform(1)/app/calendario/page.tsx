import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CalendarView } from "@/components/calendar-view"

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <CalendarView />
      </main>
      <Footer />
    </div>
  )
}
