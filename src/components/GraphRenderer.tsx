'use client'

import { EVRecord } from '@/lib/types/ev'
import { InsightType } from './FilterRecordSet'
import CountyChart from './Charts/CountyChart'
import EVCountByMake from './Charts/EVCountByMake'
import AverageElectricRange from './Charts/AverageElectricRange'
import EVCountByModelYearChart from './Charts/EVCountByModelYearChart'
import EVTypeChart from './Charts/EVTypeChart'

export default function GraphRenderer({
  records,
  selectedInsight,
}: {
  records: EVRecord[]
  selectedInsight: InsightType | null
}) {
  if (!selectedInsight) {
    return <p className="text-gray-500">Select an insight to view a chart</p>
  }

  switch (selectedInsight) {
    case 'make':
      return <EVCountByMake records={records} />
    case 'year':
      return <EVCountByModelYearChart records={records} />
    case 'county':
      return <CountyChart records={records} />
    case 'evType':
      return <EVTypeChart records={records} />
    case 'avgRangeByMake':
      return <AverageElectricRange records={records} />
    default:
      return <p>No chart available</p>
  }
}
