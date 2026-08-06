'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { text, attachments } from '@/lib/plant'
import type { AirtableRecord } from '@/lib/airtable'
import { filterByField, filterPlants, sortPlants } from '@/lib/search'
import { FIELDS } from '@/lib/fields'
import { status } from '@/lib/status'
import { SearchBox } from './search-box'
import { FilterBar } from './filter-bar'

export function PlantGrid({ plants }: { plants: AirtableRecord[] }) {
  const router = useRouter()
  const params = useSearchParams()

  const [q, setQ] = useState(params.get('q') ?? '')
  const [statuses, setStatuses] = useState(params.getAll('status'))
  const [colours, setColours] = useState(params.getAll('colour'))
  const [sort, setSort] = useState(params.get('sort') ?? 'scientific')

  /* 
    Keep the URL in step with the filters so going back to the grid
    from a plant page restores what was originally filtered
  */
  useEffect(() => {
    const next = new URLSearchParams()
    if (q) next.set('q', q)
    for (const value of statuses) next.append('status', value)
    for (const value of colours) next.append('colour', value)
    if (sort !== 'scientific') next.set('sort', sort)

    const query = next.toString()
    router.replace(query ? `/?${query}` : '/', { scroll: false })
  }, [q, statuses, colours, sort, router])

  const found = filterPlants(plants, q || undefined)
  const byStatus = filterByField(found, FIELDS.status, statuses)
  const byColour = filterByField(byStatus, FIELDS.flowerColour, colours)
  const visible = sortPlants(byColour, sort)

  return (
    <>
      <div className="flex flex-col gap-4 p-8 pb-0 md:flex-row md:items-start md:gap-6">
        <div className="md:w-2/5 md:shrink-0">
          <SearchBox value={q} onChange={setQ} />
        </div>
        <div className="md:flex-1">
          <FilterBar
            statuses={facet(plants, FIELDS.status)}
            colours={facet(plants, FIELDS.flowerColour)}
            selectedStatuses={statuses}
            selectedColours={colours}
            sort={sort}
            total={found.length}
            showing={visible.length}
            onToggleStatus={value => setStatuses(toggle(statuses, value))}
            onToggleColour={value => setColours(toggle(colours, value))}
            onSort={setSort}
            onClear={() => {
              setStatuses([])
              setColours([])
            }}
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="flex flex-col items-center gap-3 min-h-[50vh] justify-center p-8 text-center text-gray-500">
          <svg
            className="size-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 21V9" strokeLinecap="round" />
            <path d="M12 9c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6Z" strokeLinejoin="round" />
            <path d="M12 14c0-3-2.2-5-5-5 0 3 2.2 5 5 5Z" strokeLinejoin="round" />
          </svg>
          No plants match these filters.
        </p>
      ) : (
        <div className="grid gap-6 p-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visible.map(plant => {
            const photo = attachments(plant, FIELDS.photos)[0]
            const src = photo?.thumbnails?.large?.url ?? photo?.url
            const badge = status(text(plant, FIELDS.status))

            return (
              <Link
                key={plant.id}
                href={`/plants/${plant.id}`}
                className="group flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:ring-gray-300 motion-reduce:hover:translate-y-0"
              >
                {src && (
                  <img
                    src={src}
                    alt={text(plant, FIELDS.scientificName) ?? ''}
                    loading="lazy"
                    className="w-full aspect-square object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <div className="italic font-serif font-medium line-clamp-2">
                    {text(plant, FIELDS.scientificName)}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-1">
                    {text(plant, FIELDS.commonNames) ?? '—'}
                  </div>
                  {badge && (
                    <div className="mt-auto">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badge.chip}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )

  // Adds a value if it's missing, removes it if it's there.
  function toggle(values: string[], value: string): string[] {
    return values.includes(value) ? values.filter(v => v !== value) : [...values, value]
  }

  // Every different value a field has across the plants, sorted A–Z.
  function facet(plants: AirtableRecord[], field: string): string[] {
    const values = new Set<string>()

    for (const plant of plants) {
      const value = text(plant, field)
      if (value) values.add(value)
    }

    return [...values].sort((a, b) => a.localeCompare(b))
  }
}
