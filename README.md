# EV Analytics Dashboard (Next.js)

A lightweight, client-first analytics UI for exploring the **Electric Vehicle Population** CSV.  
Upload a CSV, we validate the schema client-side, persist minimal metadata, and render interactive charts with Recharts. The backend (Go/Fiber + DB) can be added later—this README focuses on the frontend.

---

## Features

- **CSV validation (client-side)** with `papaparse` against a strict header list.
- **Server Action upload** → writes a hashed file under `public/uploads/<sha256>.json` (local dev).
- **State via Context** (`fileMeta` only), hydrated from `localStorage` in a safe, SSR-friendly way.
- **Responsive Insights UI**
  - Desktop: sidebar + main graph.
  - Mobile/Tablet: collapsible sidebar + top selector + **mobile notice popup**.
- **Interactive charts** (Recharts):
  - EV Count by **County** (custom triangle bars)
  - EV Count by **Make**
  - EV Count by **Model Year** (tiny/compact line chart)
  - **Average Electric Range by Make**
  - **EV Type Distribution** (pie)
- **Polished UX**: gradients, loading states, and empty/error handling.

---

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Recharts**
- **Papa Parse** (client CSV validation)
- (Optional) **framer-motion** for micro-animations

---

## Expected CSV Schema

Headers must match **exactly** (order + text):

```
VIN (1-10)
County
City
State
Postal Code
Model Year
Make
Model
Electric Vehicle Type
Clean Alternative Fuel Vehicle (CAFV) Eligibility
Electric Range
Base MSRP
Legislative District
DOL Vehicle ID
Vehicle Location
Electric Utility
2020 Census Tract
```

If the uploaded CSV’s headers differ (missing/reordered/renamed), the app shows a clear error and does not proceed.

---

## Project Structure

```
frontend/
├─ app/
│  ├─ page.tsx                 # Homepage: upload & CSV validation
│  └─ info/page.tsx            # Insights page (responsive layout)
├─ components/
│  ├─ Header.tsx
│  ├─ Spinner.tsx
│  ├─ FilterRecordSet.tsx      # Sidebar (desktop) / options (mobile)
│  ├─ GraphRenderer.tsx        # Switchboard for charts
│  ├─ charts/
│  │  ├─ CountyChart.tsx
│  │  ├─ EVCountByMakeChart.tsx
│  │  ├─ EVCountByModelYearChart.tsx
│  │  ├─ AverageRangeByMakeChart.tsx
│  │  └─ EVTypePieChart.tsx
├─ lib/
│  ├─ actions/uploadCsv.ts     # Server Action: save file → public/uploads
│  ├─ context/DataContext.tsx  # fileMeta context (localStorage hydrate)
│  └─ types/ev.ts              # EVRecord, FileMeta types
├─ public/
│  └─ uploads/                 # Output .json files in dev (gitignored)
├─ styles/ (if any)
└─ README.md
```

---

## Getting Started

### Prerequisites

- **Node.js 18+**
- **npm/pnpm/yarn**

### Install

```bash
# with npm
npm install

# or pnpm
pnpm install
```

_(Optional)_ If you plan to add subtle animations:

```bash
npm install framer-motion
```

### Run (dev)

```bash
npm run dev
```

App runs on `http://localhost:3000`.

### Build & Start (prod)

```bash
npm run build
npm run start
```

---

## How It Works (End-to-End)

1. **Upload (Homepage)**

   - We read the file on the client using `Papa.parse({ header: true })`.
   - We compare `result.meta.fields` to the **Expected Headers**.
   - If valid: we post the actual `File` to the **Server Action** via `useActionState`.

2. **Save (Server Action)**

   - Compute `sha256` of file contents.
   - Ensure `public/uploads` exists (`fs.mkdir({ recursive: true })`).
   - Write the buffer to `public/uploads/<hash>.json`.
   - Return `{ hash, existed, filePath: "/uploads/<hash>.json" }`.

3. **Persist Minimal State**

   - `DataContext` stores `fileMeta` (hash, existed, filePath) in component state.
   - A `useEffect` persists `fileMeta` to `localStorage`.
   - On reload, we rehydrate **only** on the client to avoid SSR `localStorage` errors.

4. **Insights (Info Page)**
   - If `fileMeta.filePath` is present, `fetch('/uploads/<hash>.json')` and `setRecords`.
   - Sidebar (desktop) or dropdown (mobile) selects which chart to render.
   - Show spinner while data loads; show a one-time **mobile notice** for small screens.

---

## Key Components

- **`app/page.tsx`**

  - Input `<input type="file" accept=".csv">`
  - Header validation against `EXPECTED_HEADERS`.
  - Calls `action(formData)` from `useActionState(uploadCsvJson, initialState)`.

- **`lib/actions/uploadCsv.ts`**  
  Server Action for saving files to `public/uploads`.

- **`lib/context/DataContext.tsx`**  
  SSR-safe localStorage context for `fileMeta`.

- **`app/info/page.tsx`**  
  Responsive layout with sidebar and mobile popup.

- **Charts (`components/charts/*`)**  
  All charts use `<ResponsiveContainer>` and avoid zero-height issues.

---

## Deployment Notes (Important)

- **Vercel/Serverless** file system is **read-only at runtime**. Writing to `public/uploads` works in **local dev** but **not in serverless production**.  
  For production, use one of:

  - Object storage (S3/Supabase Storage/GCS).
  - Database (Postgres) for rows/blobs.
  - Persistent volume on self-hosted.

- **Security**:
  - Accept only `.csv` MIME types.
  - Enforce header schema (done).
  - Add file size limits.

---

## Troubleshooting

- **“localStorage is not defined”** → Use `useEffect` (already fixed).
- **Quota exceeded** → Only `fileMeta` in localStorage, not dataset.
- **Not allowed to load local resource** → Must `fetch('/uploads/...')`, not `file:///`.
- **Chart not rendering** → Parent must have non-zero height.

---

## License

MIT

---

## Acknowledgements

- EV Population dataset schema (WA state).
- Recharts, TailwindCSS, Papa Parse, Next.js.
