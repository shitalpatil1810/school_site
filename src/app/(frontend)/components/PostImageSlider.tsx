'use client'

import { useState, useEffect, useCallback } from 'react'

type Slide = {
  image?: { url?: string } | null
  caption?: string | null
}

const HEIGHT: Record<string, string> = {
  small: 'h-[300px]',
  medium: 'h-[450px]',
  large: 'h-[600px]',
}

export default function PostImageSlider({
  slides,
  height = 'medium',
}: {
  slides: Slide[]
  height?: string
}) {
  const [active, setActive] = useState(0)
  const h = HEIGHT[height] ?? HEIGHT.medium

  const next = useCallback(() => setActive((i) => (i + 1) % slides.length), [slides.length])
  const prev = () => setActive((i) => (i - 1 + slides.length) % slides.length)

  useEffect(() => {
    if (slides.length < 2) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [slides.length, next])

  if (!slides.length) return null

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100 my-6">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`transition-opacity duration-700 ${i === active ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
          aria-hidden={i !== active}
        >
          {slide.image?.url ? (
            <img
              src={slide.image.url}
              alt={slide.caption ?? ''}
              className={`w-full ${h} object-cover`}
              draggable={false}
            />
          ) : (
            <div className={`${h} flex items-center justify-center text-gray-300 text-5xl`}>🖼️</div>
          )}
          {slide.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
              <p className="text-white text-sm">{slide.caption}</p>
            </div>
          )}
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center transition"
            aria-label="Previous"
          >‹</button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center transition"
            aria-label="Next"
          >›</button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-white scale-125' : 'bg-white/50'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
