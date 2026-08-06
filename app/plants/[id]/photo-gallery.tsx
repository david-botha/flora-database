'use client'

import type { Attachment } from '@/lib/airtable'
import { useCallback, useEffect, useState } from 'react'

export function PhotoGallery({ photos, alt }: { photos: Attachment[]; alt: string | null }) {
  const [index, setIndex] = useState<number | null>(null)
  const open = index === null ? null : photos[index]

  const next = useCallback(() => {
    setIndex(i => (i === null ? null : (i + 1) % photos.length))
  }, [photos.length])

  const previous = useCallback(() => {
    setIndex(i => (i === null ? null : (i - 1 + photos.length) % photos.length))
  }, [photos.length])

  useEffect(() => {
    if (index === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIndex(null)
      } else if (e.key === 'ArrowRight') {
        next()
      } else if (e.key === 'ArrowLeft') {
        previous()
      }
    }

    document.body.style.overflow = 'hidden'

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [index, photos.length, next, previous])

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2">
        {photos.map((photo, i) => (
          <button
            type="button"
            key={photo.id}
            onClick={() => setIndex(i)}
            className="cursor-pointer rounded-lg overflow-hidden"
            aria-label={`View ${alt ?? photo.filename} full size`}
          >
            <img
              src={photo.thumbnails?.large?.url ?? photo.url}
              alt={alt ?? photo.filename}
              className="w-full aspect-square object-cover"
            />
          </button>
        ))}
      </section>

      {open && (
        <div
          className="flex items-center justify-center fixed inset-0 z-50 bg-black/90"
          onClick={() => setIndex(null)}
        >
          <button
            type="button"
            onClick={() => setIndex(null)}
            aria-label="Close"
            className="flex items-center justify-center absolute top-4 right-4 z-10 size-12 sm:size-10 cursor-pointer rounded-full bg-black/40 text-white transition hover:bg-white/10"
          >
            <svg
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          {photos.length > 1 && (
            <>
              <Arrow
                side="left-[calc(50%-3.5rem)] sm:left-4"
                onClick={previous}
                label="Previous photo"
                d="m15 18-6-6 6-6"
              />
              <Arrow
                side="right-[calc(50%-3.5rem)] sm:right-4"
                onClick={next}
                label="Next photo"
                d="m9 18 6-6-6-6"
              />
            </>
          )}

          <img
            src={open.url}
            alt={alt ?? open.filename}
            onClick={e => e.stopPropagation()}
            className="max-h-[90dvh] sm:h-[90vh] max-w-[90vw] w-auto object-contain"
          />
        </div>
      )}
    </>
  )
}

function Arrow({
  side,
  onClick,
  label,
  d,
}: {
  side: string
  onClick: () => void
  label: string
  d: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
      className={`absolute bottom-6 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 ${side} z-10 flex size-12 sm:size-10 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-white/10`}
    >
      <svg
        className="size-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d={d} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
