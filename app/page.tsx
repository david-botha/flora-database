import { getPlants, text, attachments } from '@/lib/airtable'
import { FIELDS } from '@/lib/fields'

export default async function Home() {
  const plants = await getPlants()

  return (
    <div className="grid gap-6 p-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {plants.map(plant => {
        const photo = attachments(plant, FIELDS.photos)[0]
        const src = photo?.thumbnails?.large?.url ?? photo?.url

        return (
          <div key={plant.id} className="flex flex-col h-80 rounded-lg border overflow-hidden">
            <div className='italic font-medium'>{text(plant, FIELDS.scientificName)}</div>
            <div>{text(plant, FIELDS.commonNames)}</div>
            {src && <img src={src} className="w-full flex-1 object-cover" />}
          </div>
        )
      })}
    </div>
  )
}
