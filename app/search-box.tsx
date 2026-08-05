'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function SearchBox() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [value, setValue] = useState(searchParams.get('q') ?? '')

  function handleChange(next: string) {
    setValue(next)
    const params = new URLSearchParams(searchParams)
    if (next) {
      params.set('q', next)
    } else {
      params.delete('q')
    }
    router.replace(`/?${params}`)
  }

  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        placeholder="Search by name or family…"
        value={value}
        onChange={e => handleChange(e.target.value)}
        aria-label="Search plants"
        className="w-full rounded-lg bg-white py-3 pl-10 pr-4 shadow-sm ring-1 ring-gray-200 transition duration-300 placeholder:text-gray-400 hover:ring-gray-300 focus:outline-none focus:ring-emerald-600/60"
      />
      {value && (
        <button
          type="button"
          onClick={() => handleChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <svg
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
