'use client'

import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { EVRecord } from '@/lib/types/ev'

type Props = {
  records: EVRecord[]
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AA46BE',
  '#FF6666',
]

const EVTypeChart: React.FC<Props> = ({ records }) => {
  // Aggregate counts by EV Type
  const typeMap: Record<string, number> = {}
  records.forEach((rec) => {
    const type = rec['Electric Vehicle Type'] || 'Unknown'
    typeMap[type] = (typeMap[type] || 0) + 1
  })

  const data = Object.entries(typeMap).map(([type, count]) => ({
    name: type,
    value: count,
  }))

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-lg font-semibold text-center mb-2">
        EV Count by Vehicle Type
      </h2>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={({ name, value }) => `${name} (${value})`}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default EVTypeChart
