import { getPlants, text, attachments, type AirtableRecord } from '@/lib/airtable'
import { filterByField, filterPlants, many, one, sortPlants } from '@/lib/search'
import { FIELDS } from '@/lib/fields'
import { status } from '@/lib/status'
import { Suspense } from 'react'
import Link from 'next/link'
import { SearchBox } from './search-box'
import { FilterBar } from './filter-bar'

export default function Home({ searchParams }: PageProps<'/'>) {
  return (
    <>
      <div className="flex flex-col gap-4 p-8 pb-0 md:flex-row md:items-start md:gap-6">
        <div className="md:w-2/5 md:shrink-0">
          <Suspense
            fallback={<div className="h-11 rounded-xl bg-white shadow-lg ring-2 ring-gray-100" />}
          >
            <SearchBox />
          </Suspense>
        </div>
        <div className="md:flex-1">
          <Suspense
            fallback={<div className="h-12 rounded-xl bg-white shadow-lg ring-2 ring-gray-100" />}
          >
            <Filters searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<p className="p-8 text-gray-500">Loading plants…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </>
  )
}

// Narrows the full plant list down to what the URL asks for.
async function select(searchParams: Awaited<PageProps<'/'>['searchParams']>) {
  const { q, status: statusFilter, colour, sort } = searchParams
  const all = await getPlants()

  const selectedStatuses = many(statusFilter)
  const selectedColours = many(colour)

  const found = filterPlants(all, one(q))
  const byStatus = filterByField(found, FIELDS.status, selectedStatuses)
  const byColour = filterByField(byStatus, FIELDS.flowerColour, selectedColours)
  const plants = sortPlants(byColour, one(sort))

  return { all, found, plants, selectedStatuses, selectedColours }
}

async function Filters({ searchParams }: Pick<PageProps<'/'>, 'searchParams'>) {
  const resolved = await searchParams
  const { all, found, plants, selectedStatuses, selectedColours } = await select(resolved)

  const { q, status: statusFilter, colour, sort } = resolved

  return (
    <FilterBar
      statuses={facet(all, FIELDS.status)}
      colours={facet(all, FIELDS.flowerColour)}
      params={toParams({ q, status: statusFilter, colour, sort })}
      selectedStatuses={selectedStatuses}
      selectedColours={selectedColours}
      sort={one(sort) === 'common' ? 'common' : 'scientific'}
      total={found.length}
      showing={plants.length}
    />
  )
}

async function Results({ searchParams }: Pick<PageProps<'/'>, 'searchParams'>) {
  const { plants } = await select(await searchParams)

  return (
    <>
      {plants.length === 0 ? (
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
        <div className="grid gap-6 p-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {plants.map(plant => {
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

// Turns the URL's query back into URLSearchParams
function toParams(input: Record<string, string | string[] | undefined>): URLSearchParams {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(input)) {
    for (const item of many(value)) {
      params.append(key, item)
    }
  }

  return params
}
