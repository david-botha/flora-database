import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <Link
        href="/"
        className="group flex items-center gap-3.5 px-8 py-5 transition-colors hover:text-gray-600"
      >
        {/* The same SVG the grid shows when nothing matches a filter. */}
        <svg
          className="size-10 shrink-0 text-emerald-700 transition-transform group-hover:-rotate-6 motion-reduce:group-hover:rotate-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 21V9" strokeLinecap="round" />
          <path d="M12 9c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6Z" strokeLinejoin="round" />
          <path d="M12 14c0-3-2.2-5-5-5 0 3 2.2 5 5 5Z" strokeLinejoin="round" />
        </svg>

        <div className="flex flex-col gap-1.5">
          <span className="font-serif text-2xl font-semibold leading-none">Pretres</span>
          <span className="text-[11px] uppercase leading-normal tracking-[0.14em] text-gray-500">
            Trees &amp; wild flowers of Pretoria
          </span>
        </div>
      </Link>
    </header>
  )
}
