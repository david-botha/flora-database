export const STATUSES = {
  'Native to Pretoria area': {
    label: 'Native to Pretoria area',
    chip: 'bg-green-50 text-green-800 ring-green-600/20',
    dot: 'bg-green-600',
  },
  'Listed Invasive': {
    label: 'Listed Invasive',
    chip: 'bg-red-50 text-red-800 ring-red-600/20',
    dot: 'bg-red-600',
  },
  'Introduced to Pretoria reserves': {
    label: 'Introduced to Pretoria reserves',
    chip: 'bg-orange-50 text-orange-800 ring-orange-600/20',
    dot: 'bg-orange-500',
  },
  Weed: {
    label: 'Weed',
    chip: 'bg-purple-50 text-purple-800 ring-purple-600/20',
    dot: 'bg-purple-600',
  },
  'Invasive, but not in Gauteng': {
    label: 'Invasive, but not in Gauteng',
    chip: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
    dot: 'bg-yellow-500',
  },
  'Uncertain, possibly introduced': {
    label: 'Uncertain, possibly introduced',
    chip: 'bg-blue-50 text-blue-800 ring-blue-600/20',
    dot: 'bg-blue-600',
  },
} as const

export type Status = (typeof STATUSES)[keyof typeof STATUSES]

export function status(value: string | null): Status | null {
  if (!value) return null
  return STATUSES[value.trim() as keyof typeof STATUSES] ?? null
}
