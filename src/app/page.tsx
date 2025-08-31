'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useData } from '@/lib/context/DataContext'
import { EVRecord } from '@/lib/types/ev'
import { upload } from '@vercel/blob/client'

const EXPECTED_HEADERS = [
  'VIN (1-10)',
  'County',
  'City',
  'State',
  'Postal Code',
  'Model Year',
  'Make',
  'Model',
  'Electric Vehicle Type',
  'Clean Alternative Fuel Vehicle (CAFV) Eligibility',
  'Electric Range',
  'Base MSRP',
  'Legislative District',
  'DOL Vehicle ID',
  'Vehicle Location',
  'Electric Utility',
  '2020 Census Tract',
]

export default function HomePage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { setFileMeta } = useData()
  const router = useRouter()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)

    Papa.parse<EVRecord>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const uploadedHeaders = result.meta.fields || []

        const isValid =
          uploadedHeaders.length === EXPECTED_HEADERS.length &&
          uploadedHeaders.every((h, idx) => h.trim() === EXPECTED_HEADERS[idx])

        if (!isValid) {
          setError(
            '❌ Invalid CSV format. Please upload the correct EV dataset.'
          )
          setLoading(false)
          return
        }

        try {
          setError(null)

          // ✅ Convert parsed rows into JSON file (Blob)
          const jsonBlob = new Blob([JSON.stringify(result.data)], {
            type: 'application/json',
          })

          // ✅ Upload JSON to Vercel Blob
          const blob = await upload(
            `projects/ev_dataset/${file.name.replace('.csv', '.json')}`,
            jsonBlob,
            {
              access: 'public',
              handleUploadUrl: '/api/uploads',
              onUploadProgress: (progress) => {
                setUploadProgress(progress.percentage)
              },
            }
          )

          // ✅ Save metadata to context (store blob.url instead of raw data to avoid quota issues)
          setFileMeta({
            hash: Date.now().toString(), // simple unique id
            existed: false,
            filePath: blob.url, // use blob url for fetching later
          })

          router.push('/info')
        } catch (err) {
          console.error(err)
          setError('❌ Failed to upload file.')
        } finally {
          setLoading(false)
        }
      },
      error: () => {
        setError('❌ Failed to parse the CSV file.')
        setLoading(false)
      },
    })
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="flex flex-col items-center justify-center flex-1 px-6 py-10">
        {/* Upload Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            📊 Upload EV Dataset
          </h1>
          <p className="text-gray-600 mb-6">
            Please upload the official{' '}
            <strong>Electric Vehicle Population</strong> CSV file.
          </p>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="border border-gray-300 p-2 rounded w-full mb-4 cursor-pointer text-sm"
          />

          {loading && (
            <p className="text-blue-500 animate-pulse">
              {uploadProgress > 0
                ? `Uploading... ${uploadProgress.toFixed(0)}%`
                : 'Parsing and processing...'}
            </p>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Info Section */}
        <div className="mt-10 bg-white shadow-md rounded-xl p-6 max-w-3xl w-full">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            ℹ Supported CSV Format
          </h2>
          <p className="text-gray-600 text-sm mb-2">
            Your CSV should contain the following headers in this exact order:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-700">
            {EXPECTED_HEADERS.map((h, idx) => (
              <li
                key={idx}
                className="bg-gray-100 px-2 py-1 rounded text-center"
              >
                {h}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            ⚠️ Only <strong>.csv</strong> files with the correct structure will
            be accepted.
          </p>
        </div>
      </div>
    </main>
  )
}
