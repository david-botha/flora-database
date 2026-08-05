import { status as statusMeta } from '@/lib/status'
import { flowerColour } from '@/lib/flower-colours'

const SORTS = [
  { value: 'scientific', label: 'Scientific name' },
  { value: 'common', label: 'Common name' },
] as const

type Props = {
  statuses: string[]
  colours: string[]
  selectedStatuses: string[]
  selectedColours: string[]
  sort: string
  total: number
  showing: number
  onToggleStatus: (value: string) => void
  onToggleColour: (value: string) => void
  onSort: (value: string) => void
  onClear: () => void
}

export function FilterBar({
  statuses,
  colours,
  selectedStatuses,
  selectedColours,
  sort,
  total,
  showing,
  onToggleStatus,
  onToggleColour,
  onSort,
  onClear,
}: Props) {
  const active = selectedStatuses.length + selectedColours.length
  const filtered = showing !== total

  return (
    <details className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 transition duration-300 hover:ring-gray-300 open:ring-gray-200">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 select-none [&::-webkit-details-marker]:hidden">
        <svg
          className="size-4 shrink-0 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M3 5h18M6 12h12M10 19h4" strokeLinecap="round" />
        </svg>
        <span className="font-medium">Filters</span>

        {active > 0 && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-900 ring-1 ring-emerald-600/20 ring-inset tabular-nums">
            {active}
          </span>
        )}

        <span className="ml-auto text-sm text-gray-500 tabular-nums">
          {filtered ? `${showing} of ${total}` : `${total} plants`}
        </span>

        <svg
          className="size-4 shrink-0 text-gray-400 transition duration-300 group-open:rotate-180 motion-reduce:transition-none"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      <div className="flex flex-col gap-5 border-t border-gray-100 px-4 py-4">
        <Group label="Status">
          {statuses.map(value => {
            const meta = statusMeta(value)
            const on = selectedStatuses.includes(value)

            return (
              <Chip
                key={value}
                onClick={() => onToggleStatus(value)}
                on={on}
                onClass={meta ? `${meta.chip} shadow-sm` : undefined}
              >
                <span
                  className={`size-2 shrink-0 rounded-full ${meta?.dot ?? 'bg-gray-400'}`}
                  aria-hidden="true"
                />
                {meta?.label ?? value}
              </Chip>
            )
          })}
        </Group>

        <Group label="Flower colour">
          {colours.map(value => {
            const meta = flowerColour(value)
            const on = selectedColours.includes(value)

            return (
              <Chip
                key={value}
                onClick={() => onToggleColour(value)}
                on={on}
                onClass={`${meta.chip} shadow-sm`}
              >
                <span className={`size-2.5 shrink-0 rounded-full ${meta.dot}`} aria-hidden="true" />
                {meta.label}
              </Chip>
            )
          })}
        </Group>

        <Group label="Sort by">
          {SORTS.map(option => (
            <Chip
              key={option.value}
              onClick={() => onSort(option.value)}
              on={sort === option.value}
              onClass="bg-emerald-50 text-emerald-800 ring-emerald-600/20 shadow-sm"
            >
              {option.label}
            </Chip>
          ))}
        </Group>

        {active > 0 && (
          <div>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-gray-500 underline-offset-4 transition hover:text-gray-900 hover:underline"
            >
              <svg
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </details>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:gap-3">
      <div className="pt-1 text-xs font-semibold tracking-wide text-gray-500 uppercase lg:w-28 lg:shrink-0">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Chip({
  onClick,
  on,
  onClass = 'bg-gray-900 text-white ring-gray-900 shadow-sm',
  children,
}: {
  onClick: () => void
  on: boolean
  onClass?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-sm ring-1 ring-inset transition duration-200 ${
        on ? onClass : 'bg-white text-gray-700 ring-gray-200 hover:bg-gray-50 hover:ring-gray-300'
      }`}
    >
      {children}
    </button>
  )
}
