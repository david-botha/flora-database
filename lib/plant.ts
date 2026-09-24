import type { AirtableRecord } from './airtable'

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
