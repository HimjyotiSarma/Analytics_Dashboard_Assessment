'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { FileMeta } from '@/lib/types/ev'

type DataContextTypes = {
  fileMeta: FileMeta | undefined
  setFileMeta: (fileMeta: FileMeta) => void
  isHydrating: boolean
}

const DataContext = createContext<DataContextTypes | undefined>(undefined)

export function DataContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [fileMeta, setFileMeta] = useState<FileMeta | undefined>(undefined)
  const [isHydrating, setIsHydrating] = useState(true)

  // ✅ Hydrate only the small metadata (NOT the whole dataset)
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('fileMetaContext')
      if (storedData) {
        setFileMeta(JSON.parse(storedData))
      }
    } catch (err) {
      console.warn('Failed to load fileMetaContext from localStorage:', err)
    } finally {
      setIsHydrating(false)
    }
  }, [])

  useEffect(() => {
    if (fileMeta) {
      try {
        localStorage.setItem('fileMetaContext', JSON.stringify(fileMeta))
      } catch (err) {
        console.warn('Failed to store fileMetaContext in localStorage:', err)
      }
    }
  }, [fileMeta])

  return (
    <DataContext.Provider value={{ fileMeta, setFileMeta, isHydrating }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataContextProvider')
  }
  return context
}
