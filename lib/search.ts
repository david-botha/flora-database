import { AirtableRecord } from './airtable'
import { FIELDS } from '@/lib/fields'
import { text } from '@/lib/airtable'

export function one(value: string | string[] | undefined): string | undefined {
  const first = Array.isArray(value) ? value[0] : value
  return first?.trim() || undefined
}

export function many(value: string | string[] | undefined): string[] {
  const values = Array.isArray(value) ? value : [value]

  return values.map(item => item?.trim()).filter((v): v is string => Boolean(v))
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

// Adds a value to the URL if it's missing, removes it if it's there.
export function toggleParam(
  params: URLSearchParams,
  key: string,
  value: string
): string {
  const next = new URLSearchParams(params)
  const current = next.getAll(key)

  next.delete(key)
  for (const item of current) {
    if (item !== value) next.append(key, item)
  }
  if (!current.includes(value)) next.append(key, value)

  return next.toString()
}

export function setParam(
  params: URLSearchParams,
  key: string,
  value: string | undefined
): string {
  const next = new URLSearchParams(params)

  if (value) {
    next.set(key, value)
  } else {
    next.delete(key)
  }

  return next.toString()
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
