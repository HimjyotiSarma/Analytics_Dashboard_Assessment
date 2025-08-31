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

  // Hydrate from Local Storage
  useEffect(() => {
    const storedData = localStorage.getItem('fileMetaContext')
    if (storedData) {
      console.log('Stored Data: ', JSON.parse(storedData))
      setFileMeta(JSON.parse(storedData))
      setIsHydrating(false)
    }
  }, [])

  useEffect(() => {
    if (fileMeta) {
      localStorage.setItem('fileMetaContext', JSON.stringify(fileMeta))
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
