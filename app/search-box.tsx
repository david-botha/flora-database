'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function SearchBox() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    router.replace(`/?${params}`)
  }

  return (
    <input
      type="search"
      placeholder="Search by name or family…"
      defaultValue={searchParams.get('q') ?? ''}
      onChange={e => handleChange(e.target.value)}
      className="w-full rounded-lg border px-4 py-2"
    />
  )
}
