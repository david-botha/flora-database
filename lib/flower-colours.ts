export const FLOWER_COLOURS: Record<string, { label: string; chip: string; dot: string }> = {
  'Blue or bluish': {
    label: 'Blue',
    chip: 'bg-blue-50/60 text-blue-900 ring-blue-200',
    dot: 'bg-blue-500',
  },
  'Brown': {
    label: 'Brown',
    chip: 'bg-amber-50/60 text-amber-900 ring-amber-200',
    dot: 'bg-amber-800',
  },
  'Green or greenish': {
    label: 'Green',
    chip: 'bg-green-50/60 text-green-900 ring-green-200',
    dot: 'bg-green-600',
  },
  'Mauve, purple or purplish': {
    label: 'Purple',
    chip: 'bg-purple-50/60 text-purple-900 ring-purple-200',
    dot: 'bg-purple-500',
  },
  'Orange': {
    label: 'Orange',
    chip: 'bg-orange-50/60 text-orange-900 ring-orange-200',
    dot: 'bg-orange-500',
  },
  'Pink or pinkish': {
    label: 'Pink',
    chip: 'bg-pink-50/60 text-pink-900 ring-pink-200',
    dot: 'bg-pink-400',
  },
  'Red or reddish': {
    label: 'Red',
    chip: 'bg-red-50/60 text-red-900 ring-red-200',
    dot: 'bg-red-600',
  },
  'White or whitish': {
    label: 'White',
    chip: 'bg-gray-50/60 text-gray-800 ring-gray-200',
    dot: 'bg-gray-50 ring-1 ring-gray-300',
  },
  'Yellow or cream': {
    label: 'Yellow',
    chip: 'bg-yellow-50/60 text-yellow-900 ring-yellow-200',
    dot: 'bg-yellow-400',
  },
}

// Anything Airtable adds later still shows up, just in grey.
export function flowerColour(value: string) {
  const trimmed = value.trim()

  return (
    FLOWER_COLOURS[trimmed] ?? {
      label: trimmed,
      chip: 'bg-gray-50 text-gray-700 ring-gray-200',
      dot: 'bg-gray-300',
    }
  )
}
