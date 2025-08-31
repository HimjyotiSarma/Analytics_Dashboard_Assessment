'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { EVRecord } from '@/lib/types/ev'

type Props = {
  records: EVRecord[]
}

const EVCountByModelYearChart: React.FC<Props> = ({ records }) => {
  // Group by Model Year
  const yearMap: Record<string, number> = {}
  records.forEach((rec) => {
    const year = rec['Model Year']?.toString()
    if (year) {
      yearMap[year] = (yearMap[year] || 0) + 1
    }
  })

  // Convert to array + sort by year
  const data = Object.entries(yearMap)
    .map(([year, count]) => ({
      year,
      count,
    }))
    .sort((a, b) => Number(a.year) - Number(b.year))

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-lg font-semibold text-center mb-2">
        EV Count by Model Year
      </h2>
      {/* ✅ Explicit height so ResponsiveContainer works */}
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              angle={-30}
              textAnchor="end"
              interval={0}
              height={50}
              label={{
                value: 'Model Year',
                position: 'insideBottom',
                offset: -10,
              }}
            />
            <YAxis
              label={{
                value: 'EV Count',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#FF8042"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default EVCountByModelYearChart
