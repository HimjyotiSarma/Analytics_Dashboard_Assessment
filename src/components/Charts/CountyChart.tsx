'use client'

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts'
import { EVRecord } from '@/lib/types/ev'

const colors = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AA46BE',
  '#FF6666',
  '#2ECC71',
  '#E67E22',
]

// Custom triangle bar shape
const getPath = (x: number, y: number, width: number, height: number) => {
  return `M${x},${y + height}
    C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${
    x + width / 2
  }, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
    Z`
}

const TriangleBar = (props: any) => {
  const { fill, x, y, width, height } = props
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />
}

export default function CountyChart({ records }: { records: EVRecord[] }) {
  // Aggregate count by county
  const countyMap: Record<string, number> = {}
  records.forEach((rec) => {
    countyMap[rec.County] = (countyMap[rec.County] || 0) + 1
  })

  const data = Object.entries(countyMap).map(([county, count]) => ({
    name: county,
    value: count,
  }))

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[100%] h-[100%] min-w-[500px] min-h-[300px]">
        <h2 className="text-xl font-semibold text-center mb-4">
          EV Count by County
        </h2>
        <ResponsiveContainer width="90%" height="90%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 40,
              bottom: 80, // extra for x-axis labels
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              interval={0}
              height={70}
            >
              <Label
                value="County"
                position="bottom"
                offset={20}
                style={{ textAnchor: 'middle' }}
              />
            </XAxis>
            <YAxis>
              <Label
                value="Number of EVs"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: 'middle' }}
              />
            </YAxis>
            <Tooltip />
            <Bar
              dataKey="value"
              shape={<TriangleBar />}
              label={{ position: 'top', fill: '#333', fontSize: 12 }}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
