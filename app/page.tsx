import { Suspense } from 'react'
import { getGridPlants } from '@/lib/airtable'
import { PlantGrid } from './plant-grid'

export default async function Home() {
  const plants = await getGridPlants()

  // PlantGrid reads its initial filters from the URL, which doesn't exist at
  // build time. useSearchParams makes everything inside this boundary render
  // in the browser instead. The plant data is already in the page, so it's instant.
  return (
    <Suspense>
      <PlantGrid plants={plants} />
    </Suspense>
  )
}
