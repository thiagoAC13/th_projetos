const photos = [
  { id: 1, src: "/teenagers-hiking-mountains.jpg", alt: "Trilha em grupo", category: "Aventuras" },
  { id: 2, src: "/camping-tents-forest.jpg", alt: "Acampamento", category: "Acampamentos" },
  { id: 3, src: "/teenagers-campfire-night-stars.jpg", alt: "Fogueira noturna", category: "Eventos" },
  { id: 4, src: "/rock-climbing-teenagers.jpg", alt: "Escalada", category: "Aventuras" },
  { id: 5, src: "/kayaking-lake-teenagers.jpg", alt: "Caiaque", category: "Esportes" },
  { id: 6, src: "/group-photo-scouts-badges.jpg", alt: "Foto em grupo", category: "Eventos" },
  { id: 7, src: "/placeholder.svg?height=400&width=600", alt: "Cozinha ao ar livre", category: "Acampamentos" },
  { id: 8, src: "/placeholder.svg?height=400&width=600", alt: "Arvorismo", category: "Aventuras" },
  { id: 9, src: "/placeholder.svg?height=400&width=600", alt: "Cerimônia de premiação", category: "Eventos" },
]

export function GalleryGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Galeria de Fotos</h1>
          <p className="max-w-2xl text-lg text-muted-foreground text-pretty">
            Momentos especiais das nossas aventuras e atividades
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-video overflow-hidden rounded-lg">
              <img
                src={photo.src || "/placeholder.svg"}
                alt={photo.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="text-sm font-medium">{photo.category}</p>
                  <p className="text-xs">{photo.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
