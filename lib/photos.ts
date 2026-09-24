import manifest from '@/data/photos.json'

/*
  Photos are served from object storage, not Airtable anymore.

  Airtable's attachment URLs expire after ~2 hours, which forced an hourly
  rebuild to refresh them, which burnt through the limits.
  
  The photos were copied out once. data/photos.json maps each record to its
  objects, so image URLs are permanent and need no Airtable request at all.

  Kept free of server-only imports so client components can use it.
*/

const BASE = process.env.NEXT_PUBLIC_PHOTO_BASE ?? ''

export type Photo = {
  key: string
  url: string
  width: number
  height: number
}

// One entry per object: key, width, height, and g=1 on the grid-sized one.
type Entry = { k: string; w: number; h: number; g?: number }

const photos: Record<string, Entry[]> = manifest

function toPhoto(entry: Entry): Photo {
  return {
    key: entry.k,
    url: `${BASE}/${entry.k}`,
    width: entry.w,
    height: entry.h,
  }
}

// Every photo for a plant, with the grid-sized copy filtered out.
export function photosFor(recordId: string): Photo[] {
  return (photos[recordId] ?? []).filter(entry => !entry.g).map(toPhoto)
}

// The grid-sized photo for a card, falling back to the first photo.
export function gridPhoto(recordId: string): Photo | null {
  const entries = photos[recordId]
  if (!entries?.length) return null
  return toPhoto(entries.find(entry => entry.g) ?? entries[0])
}
