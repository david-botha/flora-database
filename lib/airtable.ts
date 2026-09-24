import { cacheLife, cacheTag } from 'next/cache'
import { FIELDS } from './fields'

export type AirtableRecord = {
  id: string
  createdTime: string
  fields: Record<string, unknown>
}

type ListResponse = {
  records: AirtableRecord[]
  offset?: string
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name}.`)
  }
  return value
}

/*
  TEMPORARY until the Airtable quota resets on 1 October 2026

  The hourly rebuilds that kept attachment URLs alive used ~2,160 API calls a
  month against a limit of 1,000. Photos no longer need Airtable (see lib/photos.ts)
  but plant text still does, which leaves the site unbuildable.

  data/plants.json is that text, recovered from an archive of the live site
  taken on 13 September 2026. Setting PLANTS_SNAPSHOT=1 builds from it and
  makes no Airtable request at all.

  To revert: delete this block, the import, and data/plants.json.
*/
async function snapshot(): Promise<AirtableRecord[]> {
  const { default: plants } = await import('@/data/plants.json')
  return plants as AirtableRecord[]
}

// Fetches every record from the table
export async function getPlants(): Promise<AirtableRecord[]> {
  'use cache'
  cacheLife({ stale: 1800, revalidate: 1800, expire: 5400 })
  cacheTag('plants')

  if (process.env.PLANTS_SNAPSHOT === '1') return snapshot()

  const token = requireEnv('AIRTABLE_TOKEN')
  const baseId = requireEnv('AIRTABLE_BASE_ID')
  const table = requireEnv('AIRTABLE_TABLE')

  const all: AirtableRecord[] = []
  let offset: string | undefined

  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`)
    url.searchParams.set('pageSize', '100')
    if (offset) url.searchParams.set('offset', offset)

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      throw new Error(
        `Airtable request failed: ${res.status} ${res.statusText}. ` +
          `Check the token's scope and that the table name matches exactly.`
      )
    }

    const page: ListResponse = await res.json()
    all.push(...page.records)
    offset = page.offset
  } while (offset)

  return all
}

/*
  Fetches every record, trimmed to just what the grid renders.
  Scientific Name, Common Names, Family, Status, Flower Colour.
  Anything else needs getPlants(). Photos come from lib/photos.ts.
*/
export async function getGridPlants(): Promise<AirtableRecord[]> {
  const plants = await getPlants()

  return plants.map(plant => ({
    id: plant.id,
    createdTime: plant.createdTime,
    fields: {
      [FIELDS.scientificName]: plant.fields[FIELDS.scientificName],
      [FIELDS.commonNames]: plant.fields[FIELDS.commonNames],
      [FIELDS.family]: plant.fields[FIELDS.family],
      [FIELDS.status]: plant.fields[FIELDS.status],
      [FIELDS.flowerColour]: plant.fields[FIELDS.flowerColour],
    },
  }))
}

// Fetches a single record from the table
export async function getPlant(id: string): Promise<AirtableRecord | null> {
  const plants = await getPlants()
  return plants.find(plant => plant.id === id) ?? null
}
