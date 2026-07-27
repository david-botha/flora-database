import { getPlants, text, attachments } from '@/lib/airtable'
import { filterPlants, one } from '@/lib/search'
import { FIELDS } from '@/lib/fields'
import { Suspense } from 'react'
import Link from 'next/link'
import { SearchBox } from './search-box'

export default function Home({ searchParams }: PageProps<'/'>) {
  return (
    <>
      <div className="p-8 pb-0">
        <Suspense fallback={<div className="h-10 rounded-lg border bg-gray-50" />}>
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

        return (
          <Link
            key={plant.id}
            href={`/plants/${plant.id}`}
            className="flex flex-col rounded-lg border overflow-hidden"
          >
            {src && <img src={src} className="w-full aspect-square object-cover" />}
            <div className="p-3">
              <div className="italic font-serif font-medium line-clamp-2">
                {text(plant, FIELDS.scientificName)}
              </div>
              <div className="text-sm text-gray-600 line-clamp-1">
                {text(plant, FIELDS.commonNames) ?? '—'}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
