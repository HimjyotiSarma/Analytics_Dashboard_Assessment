export interface EVRecord {
  'VIN (1-10)': string
  County: string
  City: string
  State: string
  'Postal Code': number
  'Model Year': number
  Make: string
  Model: string
  'Electric Vehicle Type': string
  'Clean Alternative Fuel Vehicle (CAFV) Eligibility': string
  'Electric Range': number
  'Base MSRP': number
  'Legislative District': number
  'DOL Vehicle ID': number
  'Vehicle Location': string
  'Electric Utility': string
  '2020 Census Tract': number
}

export type FileMeta = {
  hash: string
  existed: boolean
  filePath: string // parsed rows instead of filePath
}
