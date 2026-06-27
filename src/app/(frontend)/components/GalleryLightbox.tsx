'use client'

import { useState, useEffect, useCallback } from 'react'

export type LightboxItem = {
  url: string
  alt?: string
  caption?: string
}

export default function GalleryLightbox({
  items,
  columns = 3,
}: {
  items: LightboxItem[]
  columns?: 2 | 3 | 4
}) {
  const [active, setActive] = useState<number | null>(null)

  const close = useCallback(() => setActive(null), [])
  const prev = useCallback(
    () => setActive((i) => (i !== null ? (i - 1 + items.length) % items.length : null)),
    [items.length],
  )
  const next = useCallback(
    () => setActive((i) => (i !== null ? (i + 1) % items.length : null)),
    [items.length],
  )

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, close, prev, next])

  const colClass =
    columns === 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : columns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  if (!items.length) return null

  return (
    <>
      {/* ── Thumbnail grid ── */}
      <div className={`grid ${colClass} gap-4`}>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-lg transition group focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={item.alt ?? item.caption ?? `Image ${i + 1}`}
          >
            <img
              src={item.url}
              alt={item.alt ?? item.caption ?? ''}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-3xl drop-shadow">
                ⊕
              </span>
            </div>
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs truncate">{item.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* ── Lightbox modal ── */}
      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={close}
        >
          {/* counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm tabular-nums">
            {active + 1} / {items.length}
          </div>

          {/* close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl leading-none transition"
            aria-label="Close"
          >
            ×
          </button>

          {/* prev arrow */}
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-11 h-11 flex items-center justify-center text-2xl transition"
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          {/* image */}
          <div
            className="max-w-5xl max-h-[85vh] w-full mx-4 sm:mx-16 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[active].url}
              alt={items[active].alt ?? items[active].caption ?? ''}
              className="max-w-full max-h-[78vh] object-contain rounded-lg shadow-2xl"
            />
            {items[active].caption && (
              <p className="mt-3 text-white/80 text-sm text-center px-4">
                {items[active].caption}
              </p>
            )}
          </div>

          {/* next arrow */}
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-11 h-11 flex items-center justify-center text-2xl transition"
              aria-label="Next"
            >
              ›
            </button>
          )}

          {/* dot strip */}
          {items.length > 1 && items.length <= 20 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActive(i) }}
                  className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-white scale-125' : 'bg-white/40'}`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
