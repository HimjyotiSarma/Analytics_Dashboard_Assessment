'use client'

import { useState } from 'react'
import { EVRecord } from '@/lib/types/ev'

export type InsightType =
  | 'make'
  | 'year'
  | 'county'
  | 'evType'
  | 'avgRangeByMake'

const insights: { key: InsightType; label: string }[] = [
  { key: 'make', label: 'EV Count by Make' },
  { key: 'year', label: 'EV Count by Model Year' },
  { key: 'county', label: 'EV Count by County' },
  { key: 'evType', label: 'EV Type Distribution' },
  { key: 'avgRangeByMake', label: 'Avg Electric Range by Make' },
]

export default function FilterRecordSet({
  records,
  onSelectInsight,
}: {
  records: EVRecord[]
  onSelectInsight: (insight: InsightType) => void
}) {
  const [selected, setSelected] = useState<InsightType | null>(null)

  const handleSelect = (key: InsightType) => {
    setSelected(key)
    onSelectInsight(key)
  }

  return (
    <aside className="w-72 border-r border-gray-200 min-h-full bg-gray-50 p-4">
      <h2 className="font-semibold text-lg mb-4 text-gray-700 border-b border-gray-300 pb-2">
        Insights
      </h2>
      <ul className="space-y-2">
        {insights.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => handleSelect(item.key)}
              className={`w-full text-left px-3 py-2 rounded transition ${
                selected === item.key
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-blue-100'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
