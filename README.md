# EV Analytics Dashboard

A web-based dashboard for analyzing Electric Vehicle (EV) population datasets.  
Built with **Next.js (App Router)**, **React**, **Recharts**, and **Vercel Blob Storage** for file uploads.

🚀 **Live Demo**: [EV Analytics Dashboard](https://analytics-dashboard-assessment-seven-lake.vercel.app/)

---

## 📌 Features

- Upload large CSV datasets (EV population data).
- Validates CSV headers against the official EV dataset format.
- Converts CSV to JSON and stores it in **Vercel Blob Storage**.
- Interactive graphs and insights:
  - EV count by Make
  - EV count by Model Year
  - EV count by County
  - EV Type Distribution (Pie chart)
  - Average Electric Range by Make
- Responsive design:
  - Sidebar hidden on mobile/tablet, replaced with a menu button.
  - Mobile users get a notice recommending desktop for best visualization.
- Persistent state with Context API.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Charts**: Recharts
- **CSV Parsing**: Papa Parse
- **Storage**: Vercel Blob (JSON stored in blob, meta in context)
- **Deployment**: Vercel

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/ev-analytics-dashboard.git
cd ev-analytics-dashboard
```

### 2️⃣ Install dependencies

```bash
npm install
# or
yarn install
```

### 3️⃣ Setup environment variables

Create a `.env.local` file in the project root and add:

```env
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

Get your token from [Vercel Blob Dashboard](https://vercel.com/dashboard/storage).

### 4️⃣ Run locally

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

```
frontend_csv_viewer/
 ┣ src/
 ┃ ┣ app/
 ┃ ┃ ┣ page.tsx            # Homepage (CSV Upload)
 ┃ ┃ ┣ info/page.tsx       # Info page (Graphs)
 ┃ ┃ ┗ api/uploads/        # Upload handler for Vercel Blob
 ┃ ┣ components/           # Header, Sidebar, GraphRenderer, etc.
 ┃ ┣ lib/
 ┃ ┃ ┣ context/            # DataContext (global state)
 ┃ ┃ ┣ actions/            # Server actions (upload helpers)
 ┃ ┃ ┗ types/              # Type definitions
 ┗ README.md
```

---

## 📊 Dataset Notes

- Only **CSV files** with the exact expected headers are supported.
- Files larger than **100MB** require a Vercel Pro plan.

---

## 📌 Roadmap

- [ ] Add user authentication before uploading datasets.
- [ ] Add more advanced filters and combined insights.
- [ ] Export graphs as images or PDF reports.

---

## 📝 License

This project is licensed under the MIT License.

---

👨‍💻 Developed by [Himjyoti Sarma](https://www.linkedin.com/in/himjyoti-sarma-aa3b2719a/)
