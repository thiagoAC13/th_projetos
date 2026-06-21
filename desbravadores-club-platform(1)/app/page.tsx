import { Header } from "@/components/header"
import { HeroSlider } from "@/components/hero-slider"
import { EventsSection } from "@/components/events-section"
import { AboutSection } from "@/components/about-section"
import { GalleryPreview } from "@/components/gallery-preview"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSlider />
        <EventsSection />
        <AboutSection />
        <GalleryPreview />
      </main>
      <Footer />
    </div>
  )
}
