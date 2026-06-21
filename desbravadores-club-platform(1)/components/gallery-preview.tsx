import { Button } from "@/components/ui/button"
import Link from "next/link"

const photos = [
  { id: 1, src: "/teenagers-hiking-nature.jpg", alt: "Trilha em grupo" },
  { id: 2, src: "/camping-tents-sunset.jpg", alt: "Acampamento" },
  { id: 3, src: "/teenagers-campfire-night.jpg", alt: "Fogueira noturna" },
  { id: 4, src: "/rock-climbing-adventure.jpg", alt: "Escalada" },
  { id: 5, src: "/kayaking-lake-summer.jpg", alt: "Caiaque" },
  { id: 6, src: "/group-photo-scouts-uniform.jpg", alt: "Foto em grupo" },
]

export function GalleryPreview() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Galeria de Fotos</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            Confira os melhores momentos das nossas aventuras
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-video overflow-hidden rounded-lg">
              <img
                src={photo.src || "/placeholder.svg"}
                alt={photo.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/galeria">Ver Galeria Completa</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
