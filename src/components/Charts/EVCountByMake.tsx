'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts'
import { EVRecord } from '@/lib/types/ev'

type Props = {
  records: EVRecord[]
}

const EVCountByMakeChart: React.FC<Props> = ({ records }) => {
  // Group by Make and count EVs
  const grouped = records.reduce<Record<string, number>>((acc, rec) => {
    acc[rec.Make] = (acc[rec.Make] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(grouped).map(([make, count]) => ({
    make,
    count,
  }))

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h2 className="text-xl font-semibold mb-2 text-center">
        EV Count by Make
      </h2>
      <ResponsiveContainer width="95%" height="90%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 40, // space for labels
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
              position="bottom"
              offset={20}
              style={{ textAnchor: 'middle' }}
            >
              Car Make
            </Label>
          </XAxis>
          <YAxis>
            <Label
              value="EV Count"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" /> {/* Different color */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EVCountByMakeChart
