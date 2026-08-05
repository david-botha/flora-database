import type { AirtableRecord } from './airtable'
import { FIELDS } from '@/lib/fields'
import { text } from '@/lib/plant'

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

export function filterByField(
  plants: AirtableRecord[],
  field: string,
  selected: string[]
): AirtableRecord[] {
  if (selected.length === 0) return plants

  return plants.filter(plant => {
    const value = text(plant, field)
    if (!value) return false

    return selected.includes(value)
  })
}

export function sortPlants(plants: AirtableRecord[], sort: string | undefined): AirtableRecord[] {
  const field = sort === 'common' ? FIELDS.commonNames : FIELDS.scientificName

  return plants.toSorted((a, b) => {
    const nameA = text(a, field)
    const nameB = text(b, field)

    if (!nameA && !nameB) return 0
    if (!nameA) return 1
    if (!nameB) return -1
    return nameA.localeCompare(nameB)
  })
}
