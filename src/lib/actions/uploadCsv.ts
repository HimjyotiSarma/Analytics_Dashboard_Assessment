'use server'

import { createHash } from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import { parse } from 'csv-parse/sync'

export type State = {
  hash: string
  existed: boolean
  filePath: string
}
export async function uploadCsvJson(
  prevState: State,
  formData: FormData
): Promise<State> {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file uploaded')
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // Hash Content
  const hash = createHash('sha256').update(buffer).digest('hex')
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

  const filePath = path.join(uploadsDir, `${hash}.json`)

  try {
    await fs.access(filePath)
    return { hash, existed: true, filePath: `/uploads/${hash}.json` }
  } catch {
    const records = parse(buffer.toString(), {
      columns: true,
      skip_empty_lines: true,
    })
    await fs.writeFile(filePath, JSON.stringify(records, null, 2))
    return { hash, existed: false, filePath: `/uploads/${hash}.json` }
  }
}
