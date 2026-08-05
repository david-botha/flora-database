import { Suspense } from 'react'
import { getGridPlants } from '@/lib/airtable'
import { PlantGrid } from './plant-grid'

export default async function Home() {
  const plants = await getGridPlants()

  // PlantGrid reads the URL for its initial filters, which isn't known until
  // a request comes in. The boundary lets everything else prerender.
  return (
    <Suspense>
      <PlantGrid plants={plants} />
    </Suspense>
  )
}
