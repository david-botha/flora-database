import { getPlants, text, attachments } from '@/lib/airtable'
import { filterPlants, one } from '@/lib/search'
import { FIELDS } from '@/lib/fields'
import { status } from '@/lib/status'
import { Suspense } from 'react'
import Link from 'next/link'
import { SearchBox } from './search-box'

export default function Home({ searchParams }: PageProps<'/'>) {
  return (
    <>
      <div className="p-8 pb-0">
        <Suspense
          fallback={
            <div className="h-11 max-w-md rounded-xl bg-white shadow-lg ring-2 ring-gray-100" />
          }
        >
          <SearchBox />
        </Suspense>
      </div>
      <Suspense fallback={<p className="p-8">Loading plants…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </>
  )
}

async function Results({ searchParams }: Pick<PageProps<'/'>, 'searchParams'>) {
  const { q } = await searchParams
  const plants = filterPlants(await getPlants(), one(q))

  return (
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
  )
}
