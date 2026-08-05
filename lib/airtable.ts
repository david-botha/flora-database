import { cacheLife, cacheTag } from 'next/cache'
import { FIELDS } from './fields'
import { attachments } from './plant'

export type Attachment = {
  id: string
  url: string
  filename: string
  type: string
  width?: number
  height?: number
  thumbnails?: {
    small?: { url: string; width: number; height: number }
    large?: { url: string; width: number; height: number }
    full?: { url: string; width: number; height: number }
  }
}

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

// Fetches every record from the table
export async function getPlants(): Promise<AirtableRecord[]> {
  'use cache'
  cacheLife({ stale: 1800, revalidate: 1800, expire: 5400 })
  cacheTag('plants')

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
  Scientific Name, Common Names, Family, Status, Flower Colour, one thumbnail.
  Anything else needs getPlants(). 
*/
export async function getGridPlants(): Promise<AirtableRecord[]> {
  const plants = await getPlants()

  return plants.map(plant => {
    const photo = attachments(plant, FIELDS.photos)[0]
    const thumbnail = photo?.thumbnails?.large?.url ?? photo?.url

    return {
      id: plant.id,
      createdTime: plant.createdTime,
      fields: {
        [FIELDS.scientificName]: plant.fields[FIELDS.scientificName],
        [FIELDS.commonNames]: plant.fields[FIELDS.commonNames],
        [FIELDS.family]: plant.fields[FIELDS.family],
        [FIELDS.status]: plant.fields[FIELDS.status],
        [FIELDS.flowerColour]: plant.fields[FIELDS.flowerColour],
        [FIELDS.photos]: thumbnail ? [{ url: thumbnail }] : [],
      },
    }
  })
}

// Fetches a single record from the table
export async function getPlant(id: string): Promise<AirtableRecord | null> {
  const plants = await getPlants()
  return plants.find(plant => plant.id === id) ?? null
}
