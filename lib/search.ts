import { AirtableRecord } from './airtable'
import { FIELDS } from '@/lib/fields'
import { text } from '@/lib/airtable'

export function one(value: string | string[] | undefined): string | undefined {
  const first = Array.isArray(value) ? value[0] : value
  return first?.trim() || undefined
}

export function filterPlants(plants: AirtableRecord[], q: string | undefined): AirtableRecord[] {
  if (!q) return plants

  const needle = q.toLowerCase()

  return plants.filter(plant => {
    const haystack = [
      text(plant, FIELDS.scientificName),
      text(plant, FIELDS.commonNames),
      text(plant, FIELDS.family),
    ]
      .filter((v): v is string => v !== null)
      .join(' ')
      .toLowerCase()

    return haystack.includes(needle)
  })
}
