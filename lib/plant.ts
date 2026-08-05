import type { AirtableRecord, Attachment } from './airtable'

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
