# Pretres

**Trees & Wild Flowers of Pretoria** — a public reference site cataloguing the indigenous, introduced, and invasive plant species found in and around Pretoria's nature reserves.

**Available at:** [pretres.co.za](https://pretres.co.za).

> **Note (September 2026):** Photos are temporarily unavailable. Airtable's API quota for the month is exhausted, so the scheduled rebuilds that refresh its expiring attachment URLs can't run. Plant data, search, and filtering are unaffected. Images are soon to be migrated to permanent storage to remove the dependency.

## Screenshots

![Grid view — search, filters, and a photo grid of plants](docs/screenshots/grid-view.png)

## Features

- **Browse & search** — every plant in one grid, searchable by scientific name, common name, or family.
- **Filter & sort** — filter by conservation status (native, invasive, weed, etc.) and flower colour; sort alphabetically by scientific or common name.
- **Plant detail pages** — family, conservation status, flower colour, the meaning of the scientific name, a description, and control notes for invasive species.
- **Photo gallery** — a display of photos with keyboard (arrow keys, Esc) and click navigation.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Airtable](https://airtable.com) as the content source

## Architecture notes

- Data fetching is centralised in [`lib/airtable.ts`](lib/airtable.ts). `getPlants()` pages through the entire Airtable table. `getGridPlants()` and `getPlant()` both build on it.
- Plant pages are fully static. `generateStaticParams` in [`app/plants/[id]/page.tsx`](app/plants/[id]/page.tsx) prebuilds every plant at build time, so visiting one serves a static file.
- Search, filtering, and sorting runs client-side. [`app/page.tsx`](app/page.tsx) fetches the full plant list at build time and passes it as a prop. [`app/plant-grid.tsx`](app/plant-grid.tsx) filters/searches/sorts that list in the browser. The only area that needs a live request is reading the URL's query string for initial filter state, since that isn't known until a request comes in. Filter/search/sort state is then reflected in the URL as the user interacts.
- Airtable's attachment URLs expire periodically, so the site is rebuilt on Vercel every hour via a deploy hook triggered by [cron-job.org](https://cron-job.org).

## Getting started

### Prerequisites

You need an Airtable base with a table of plants. See [Airtable schema](#airtable-schema) below for the fields the app expects.

### Environment variables

Create a `.env.local` file in the project root:

```bash
AIRTABLE_TOKEN=your_personal_access_token
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE=your_table_name
```

- `AIRTABLE_TOKEN` — a [personal access token](https://airtable.com/create/tokens) scoped to `data.records:read` on the base.
- `AIRTABLE_BASE_ID` — the base ID (starts with `app...`).
- `AIRTABLE_TABLE` — the exact table name (or table ID).

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Airtable schema

The app reads these fields from the configured table (see [`lib/fields.ts`](lib/fields.ts)):

| Field | Type | Used for |
| --- | --- | --- |
| `Scientific Name` | text | Title, search, default sort |
| `Common Names` | text | Subtitle, search, alternate sort |
| `Family` | text | Detail page, search |
| `Status` | single select | Status badge, filter (e.g. *Native to Pretoria area*, *Listed Invasive*, *Weed* — see [`lib/status.ts`](lib/status.ts) for the full list and styling) |
| `Flower colour` | single select | Colour badge, filter (see [`lib/flower-colours.ts`](lib/flower-colours.ts) for the recognised values) |
| `Meaning of Scientific name and synonyms` | long text | Detail page |
| `Description` | long text | Detail page |
| `Notes` | long text | Detail page (e.g. control/eradication notes for invasives) |
| `Official Photos` | attachment | Grid thumbnail (first photo) and the detail page's photo gallery |

## Deployment

Deployed on Vercel. Set the three `AIRTABLE_*` environment variables in the Vercel project settings, and point a cron trigger (e.g. [cron-job.org](https://cron-job.org)) at the project's deploy hook on a schedule (currently every 60 minutes) to keep Airtable attachment URLs from expiring.
