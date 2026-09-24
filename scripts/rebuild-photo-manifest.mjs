/*
  Rebuilds data/photos.json from a Sep 13 archive (not in this repo).

  The first manifest listed three copies of every photo: Airtable's original,
  its `full` thumbnail and its `large` thumbnail (512px). This keeps only
  the originals plus the existing grid-sized entry that the plant cards use.
*/

import { readFileSync, writeFileSync } from 'node:fs'

const ARCHIVE = '../flora-archive'
const MANIFEST = 'data/photos.json'

const photoMap = JSON.parse(readFileSync(`${ARCHIVE}/photo-map.json`, 'utf8'))
const oldManifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))

const attachment = /\{"id":"(att\w+)","width":(\d+),"height":(\d+),"url":"([^"]+)"/g

const manifest = {}
let before = 0
let after = 0

for (const [recordId, entries] of Object.entries(oldManifest)) {
  // The page payload is a JS string inside the HTML, so its quotes are escaped.
  const html = readFileSync(`${ARCHIVE}/pages/${recordId}.html`, 'utf8').replaceAll('\\"', '"')
  const keyFor = new Map(photoMap[recordId].photos.map(p => [p.url, p.key]))

  const seen = new Set()
  const photos = []
  for (const [, id, w, h, url] of html.matchAll(attachment)) {
    if (seen.has(id)) continue
    seen.add(id)

    const k = keyFor.get(url)
    if (!k) throw new Error(`${recordId}: no R2 key for ${id}`)
    photos.push({ k, w: Number(w), h: Number(h) })
  }

  const grid = entries.find(entry => entry.g)
  if (grid) photos.push(grid)

  before += entries.length
  after += photos.length
  manifest[recordId] = photos
}

// Same shape as before: one line per plant, so diffs stay readable.
const lines = Object.entries(manifest).map(
  ([recordId, photos]) => `  ${JSON.stringify(recordId)}: ${JSON.stringify(photos)}`,
)
writeFileSync(MANIFEST, `{\n${lines.join(',\n')}\n}\n`)

console.log(`${Object.keys(manifest).length} plants, ${before} entries → ${after}`)
