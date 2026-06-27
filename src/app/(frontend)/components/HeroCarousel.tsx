'use client'

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

const HEIGHT = 'h-[220px] sm:h-[400px] lg:h-[520px]'

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
    <section className="relative w-full bg-gray-800 text-white overflow-hidden sm:rounded-2xl shadow-md">
      {/* Slides */}
      {fallback ? (
        <div className={`${HEIGHT} bg-gradient-to-br from-gray-900 to-gray-600`} />
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
                className={`w-full ${HEIGHT} object-cover opacity-60`}
                draggable={false}
              />
            ) : (
              <div className={`${HEIGHT} bg-gradient-to-br from-gray-900 to-gray-600`} />
            )}
          </div>
        ))
      )}

      {/* Gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[5]" />

      {/* Overlay text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8 z-10">
        {(fallback ? schoolName : slides[active]?.heading) && (
          <h2 className="text-xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg leading-tight text-balance">
            {fallback ? schoolName : slides[active]?.heading}
          </h2>
        )}
        {(fallback ? tagline : (slides[active]?.subheading ?? tagline)) && (
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-gray-100 max-w-xl drop-shadow leading-relaxed">
            {fallback ? tagline : (slides[active]?.subheading ?? tagline)}
          </p>
        )}
      </div>

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition"
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
