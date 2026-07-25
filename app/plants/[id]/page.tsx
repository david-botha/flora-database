import { getPlants, getPlant, text, attachments } from '@/lib/airtable'
import { FIELDS } from '@/lib/fields'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateStaticParams() {
  const plants = await getPlants()
  return plants.map(plant => ({ id: plant.id }))
}

export default async function PlantPage({ params }: PageProps<'/plants/[id]'>) {
  const { id } = await params
  const plant = await getPlant(id)

  if (!plant) notFound()

  const photos = attachments(plant, FIELDS.photos)

  return (
    <main className="max-w-7xl mx-auto p-8 flex flex-col gap-6">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← Back to all plants
      </Link>

      <header>
        <h1 className="text-3xl italic font-serif font-semibold">{text(plant, FIELDS.scientificName)}</h1>
        <p className="text-lg text-gray-600">{text(plant, FIELDS.commonNames)}</p>
      </header>

      <dl>
        <Field label="Family" value={text(plant, FIELDS.family)} />
        <Field label="Status" value={text(plant, FIELDS.status)} />
        <Field label="Flower colour" value={text(plant, FIELDS.flowerColour)} />
        <Field label="Meaning" value={text(plant, FIELDS.meaning)} />
        <Field label="Description" value={text(plant, FIELDS.description)} />
        <Field label="Notes" value={text(plant, FIELDS.notes)} />
      </dl>

      <section className="grid gap-4 sm:grid-cols-2">
        {photos.map(photo => (
          <img
            key={photo.id}
            src={photo.thumbnails?.large?.url ?? photo.url}
            alt={text(plant, FIELDS.scientificName) ?? photo.filename}
            className="w-full rounded-lg aspect-square object-cover"
          />
        ))}
      </section>
    </main>
  )
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="whitespace-pre-line">{value}</dd>
    </div>
  )
}
