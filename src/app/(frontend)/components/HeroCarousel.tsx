'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'

type Slide = {
  image?: { url?: string } | null
  heading?: string | null
  subheading?: string | null
}

type Props = {
  slides: Slide[]
  schoolName?: string | null
  tagline?: string | null
}

export default function HeroCarousel({ slides, schoolName, tagline }: Props) {
  const [active, setActive] = useState(0)

  const next = useCallback(
    () => setActive((i) => (i + 1) % slides.length),
    [slides.length],
  )
  const prev = () => setActive((i) => (i - 1 + slides.length) % slides.length)

  useEffect(() => {
    if (slides.length < 2) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [slides.length, next])

  const fallback = slides.length === 0

  return (
    <section className="relative w-full bg-blue-800 text-white overflow-hidden rounded-2xl shadow-md">
      {/* Slides */}
      {fallback ? (
        <div className="h-[520px] bg-gradient-to-br from-blue-900 to-blue-600" />
      ) : (
        slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'opacity-100 relative' : 'opacity-0 pointer-events-none'}`}
            aria-hidden={i !== active}
          >
            {slide.image?.url ? (
              <img
                src={slide.image.url}
                alt={slide.heading ?? ''}
                className="w-full h-[520px] object-cover opacity-60"
                draggable={false}
              />
            ) : (
              <div className="h-[520px] bg-gradient-to-br from-blue-900 to-blue-600" />
            )}
          </div>
        ))
      )}

      {/* Overlay text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">

        {(fallback ? tagline : (slides[active]?.subheading ?? tagline)) && (
          <p className="mt-3 text-lg text-blue-100 max-w-xl drop-shadow">
            {fallback ? tagline : (slides[active]?.subheading ?? tagline)}
          </p>
        )}

      </div>

      {/* Prev / Next arrows — only when multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center transition"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center transition"
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-white scale-125' : 'bg-white/50'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
