'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { useData } from '@/lib/context/DataContext'
import { EVRecord } from '@/lib/types/ev'
import Spinner from '@/components/Spinner'
import FilterRecordSet, { InsightType } from '@/components/FilterRecordSet'
import GraphRenderer from '@/components/GraphRenderer'

export default function InfoPage() {
  const { fileMeta } = useData()
  const [records, setRecords] = useState<EVRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<InsightType | null>(
    null
  )
  const [showSidebar, setShowSidebar] = useState(false)
  const [showMobileNotice, setShowMobileNotice] = useState(false)

  // ✅ Detect mobile and show popup
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowMobileNotice(true)
    }
  }, [])

  // ✅ Fetch dataset JSON from blob URL
  useEffect(() => {
    if (fileMeta?.filePath) {
      setLoading(true)
      fetch(fileMeta.filePath)
        .then((res) => res.json())
        .then((data: EVRecord[]) => {
          setRecords(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to fetch dataset:', err)
          setLoading(false)
        })
    }
  }, [fileMeta])

  return (
    <main className="flex flex-col min-h-screen">
      <Header />

      {/* Mobile popup */}
      {showMobileNotice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              ⚠ Viewing on Mobile
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              This dataset is quite large, and graphs may be best observed on a
              desktop or larger screen for clarity.
            </p>
            <button
              onClick={() => setShowMobileNotice(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Mobile header */}
      <div className="flex items-center justify-between px-4 py-2 md:hidden border-b">
        <h1 className="text-lg font-semibold">Dataset Insights</h1>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="px-3 py-1 border rounded text-sm bg-blue-500 text-white"
        >
          {showSidebar ? 'Close' : 'Menu'}
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-gray-50 border-r border-gray-200 transition-transform duration-200 md:static md:translate-x-0 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <FilterRecordSet
            records={records}
            onSelectInsight={(insight) => {
              setSelectedInsight(insight)
              setShowSidebar(false)
            }}
          />
        </div>

        {/* Overlay for mobile */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 px-6 md:px-10 py-6 overflow-y-auto">
          <h1 className="hidden md:block text-2xl font-bold mb-6 text-gray-800">
            Dataset Insights
          </h1>

          {!fileMeta ? (
            <p className="text-red-500">
              ⚠ No data loaded. Please upload CSV from homepage.
            </p>
          ) : loading ? (
            <div className="flex flex-col items-center space-y-4">
              <Spinner />
              <p className="text-blue-500 text-lg">Loading dataset...</p>
            </div>
          ) : (
            <div className="w-full h-full max-h-[650px]">
              <GraphRenderer
                records={records}
                selectedInsight={selectedInsight}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
