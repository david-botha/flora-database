import Link from 'next/link'
import { Skeleton } from './page'

// Next renders this the moment a plant link is clicked. The pages themselves
// are prebuilt, so this covers the transfer, not a fetch — without it a slow
// connection sits on the grid for seconds with nothing to show a tap landed.
export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto p-8 flex flex-col gap-6">
      <Link
        href="/"
        className="group inline-flex items-center gap-1.5 self-start text-sm text-gray-500 transition-colors hover:text-gray-800"
      >
        <span className="transition-transform group-hover:-translate-x-0.5">←</span>
        Back to all plants
      </Link>

      <Skeleton />
    </main>
  )
}
