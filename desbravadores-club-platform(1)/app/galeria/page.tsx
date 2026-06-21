import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"

export default function GalleryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <GalleryGrid />
      </main>
      <Footer />
    </div>
  )
}
