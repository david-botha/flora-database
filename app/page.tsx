import { getPlants, text, attachments } from '@/lib/airtable'
import { FIELDS } from '@/lib/fields'
import Link from 'next/link'

export default async function Home() {
  const plants = await getPlants()

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
