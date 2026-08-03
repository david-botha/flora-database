import { getPlants, getPlant, text, attachments } from '@/lib/airtable'
import { FIELDS } from '@/lib/fields'
import { status } from '@/lib/status'
import { FLOWER_COLOURS } from '@/lib/flower-colours'
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
  const raw = text(plant, FIELDS.status)
  const badge = status(raw)
  const colour = FLOWER_COLOURS[text(plant, FIELDS.flowerColour)?.trim() ?? '']
  const pulse = raw === 'Listed Invasive' ? 'motion-safe:animate-pulse' : ''

  return (
    <main className="max-w-7xl mx-auto p-8 flex flex-col gap-6">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← Back to all plants
      </Link>

      <header>
        <h1 className="text-3xl italic font-serif font-semibold">
          {text(plant, FIELDS.scientificName)}
        </h1>
        <p className="text-lg text-gray-600">{text(plant, FIELDS.commonNames)}</p>
      </header>

      <dl className="flex flex-col gap-4">
        <dl className="flex flex-wrap gap-x-12 gap-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Family</dt>
            <dd>{text(plant, FIELDS.family) ?? '—'}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Status</dt>
            <dd>
              {badge ? (
                <span
                  className={`-ml-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${badge.chip}`}
                >
                  <span className={`size-2 rounded-full ${badge.dot} ${pulse}`} />
                  {badge.label}
                </span>
              ) : (
                '—'
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Flower colour</dt>
            <dd>
              {text(plant, FIELDS.flowerColour) ? (
                <span
                  className={`-ml-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${colour?.chip ?? 'bg-gray-50 text-gray-700 ring-gray-200'}`}
                >
                  <span className={`size-2 rounded-full ${colour.dot ?? 'bg-gray-300'}`} />
                  {text(plant, FIELDS.flowerColour)}
                </span>
              ) : (
                '—'
              )}
            </dd>
          </div>
        </dl>
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
      <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
      <dd className="whitespace-pre-line">{value}</dd>
    </div>
  )
}
