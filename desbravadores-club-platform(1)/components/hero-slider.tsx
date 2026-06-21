"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "Aventura Esperando por Você",
    description: "Junte-se a nós nas próximas expedições e acampamentos",
    image: "/group-of-teenagers-hiking-mountains-adventure.jpg",
    cta: "Próximos Eventos",
    ctaLink: "/eventos",
  },
  {
    id: 2,
    title: "Acampamento de Verão 2024",
    description: "Inscrições abertas para o maior evento do ano",
    image: "/summer-camp-tents-forest-outdoor.jpg",
    cta: "Inscreva-se Agora",
    ctaLink: "/inscricao",
  },
  {
    id: 3,
    title: "Comunidade e Crescimento",
    description: "Faça parte de uma família que compartilha valores e aventuras",
    image: "/teenagers-campfire-community-friendship.jpg",
    cta: "Conheça o Clube",
    ctaLink: "/sobre",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10" />
          <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container px-4 md:px-6">
              <div className="max-w-2xl space-y-4 text-white">
                <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">{slide.title}</h1>
                <p className="text-lg text-white/90 text-pretty md:text-xl">{slide.description}</p>
                <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                  <a href={slide.ctaLink}>{slide.cta}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/30"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/30"
        aria-label="Próximo slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
