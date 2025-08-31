'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts'
import { EVRecord } from '@/lib/types/ev'

type Props = {
  records: EVRecord[]
}

const AverageRangeByMakeChart: React.FC<Props> = ({ records }) => {
  // Group by Make and calculate average Electric Range
  const grouped = records.reduce<Record<string, number[]>>((acc, rec) => {
    if (!acc[rec.Make]) acc[rec.Make] = []
    acc[rec.Make].push(Number(rec['Electric Range']) || 0)
    return acc
  }, {})

  const data = Object.entries(grouped).map(([make, ranges]) => ({
    make,
    avgRange: ranges.reduce((a, b) => a + b, 0) / ranges.length,
  }))

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h2 className="text-xl font-semibold mb-2 text-center">
        Average Electric Range by Make
      </h2>
      <ResponsiveContainer width="95%" height="90%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 40, // leave space for bottom labels
          }}
          barSize={25}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="make"
            angle={-30}
            textAnchor="end"
            interval={0}
            height={80}
          >
            <Label
              //   value="Car Make"
              position="bottom"
              offset={20}
              style={{ textAnchor: 'middle' }}
            />
          </XAxis>
          <YAxis>
            <Label
              value="Average Range (miles)"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip />
          {/* <Legend /> */}
          <Bar dataKey="avgRange" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AverageRangeByMakeChart
