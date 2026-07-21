import { cacheLife, cacheTag } from 'next/cache'

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
    throw new Error(`Missing ${name}. Copy .env.local.example to .env.local and fill it in.`)
  }
  return value
}

// Fetches every record from the table, following Airtable's pagination.
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

// Reads a field as a string, tolerating Airtable's varied value shapes.
export function text(record: AirtableRecord, field: string): string | null {
  const value = record.fields[field]
  if (value == null) return null
  if (typeof value === 'string') return value.trim() || null
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  // Single-select and lookup fields can arrive as arrays.
  if (Array.isArray(value)) {
    const joined = value.filter(v => typeof v === 'string').join(', ')
    return joined || null
  }
  return null
}

// Returns every attachment on a field, in the order the collector arranged them.
export function attachments(record: AirtableRecord, field: string): Attachment[] {
  const value = record.fields[field]
  if (!Array.isArray(value)) return []
  return value.filter((v): v is Attachment => v != null && typeof v === 'object' && 'url' in v)
}
