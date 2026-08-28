# Nothing OS Portfolio × Admin Dashboard

> A high-performance, developer portfolio fusing **Nothing OS visual aesthetics** with an **X (Twitter) profile layout**, featuring a dedicated **Admin Dashboard** and **Node.js/Express Backend Server**.

[![Live Demo](https://img.shields.io/badge/demo-oxvishall.vercel.app-black?style=flat&logo=vercel&logoColor=white)](https://oxvishall.vercel.app)
[![Theme](https://img.shields.io/badge/theme-Nothing%20OS-000000?style=flat&labelColor=000000&color=ffffff)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js)](#)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat&logo=express)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)](#)
[![License](https://img.shields.io/badge/license-MIT-000000?style=flat&labelColor=000000&color=ffffff)](LICENSE)

---

## 🌟 Overview

**nothing-os-themed-portfolio** is a full-stack portfolio application designed around Nothing OS's brutalist dot-matrix aesthetic and Information Architecture inspired by X (Twitter) profile pages.

It features a static-first client with dynamic fallback, an interactive **Admin Panel** for real-time project & experience management, and an **Express + MongoDB backend** for persistence and view tracking.

- 🎨 **Frontend Repository**: [oxvishall/nothing-os-themed-portfolio](https://github.com/oxvishall/nothing-os-themed-portfolio)
- ⚡ **Backend Server Repository**: [oxvishall/vibecoded-portfolio/server](https://github.com/oxvishall/vibecoded-portfolio/tree/main/server)

---

## ✨ Features

- 📱 **Nothing OS Aesthetics**: Custom dot-matrix typography (`Doto`, `DM Serif Display`, `Space Grotesk`), monochrome design system, and canvas-rendered NDot grid textures.
- 🛠️ **Admin Dashboard (`/admin/dashboard`)**:
  - Secure password authentication (`/admin/login`).
  - Real-time CRUD operations for Projects and Work Experiences.
  - Built-in **TipTap Rich Text Editor** for formatted descriptions.
  - Image uploads backed by **Vercel Blob Storage**.
- 👁️ **Live Portfolio View Counter**: Real-time server-side view tracking endpoint (`POST /api/views`) with eye-icon counter in the bio section.
- 📊 **Live GitHub Metrics**: Dynamic contribution counts and activity calculations via upstream API (`/api/github-stats`).
- 🌓 **Interface Theme Switcher**: Instant Light/Dark mode toggle with persistent state and custom SVG dark-mode filtering.
- 🔗 **Deep Linking & Highlighting**: URL parameter query matching (`?project=id`) for auto-scrolling and pulse-highlighting target projects.
- ⚡ **Full-Stack Architecture**: Next.js App Router frontend proxying route handlers to an Express.js & MongoDB backend.

---

## 🛠️ Tech Stack

### Frontend (`/portfolio`)
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & React 19
- **Styling**: Vanilla CSS Design Tokens + Tailwind CSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Rich Text Editor**: [TipTap](https://tiptap.dev/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Analytics**: Firebase Analytics

### Backend Server ([vibecoded-portfolio/server](https://github.com/oxvishall/vibecoded-portfolio/tree/main/server))
- **Runtime**: Node.js & Express.js (TypeScript)
- **Database**: MongoDB via Mongoose
- **Storage**: `@vercel/blob` for media & image uploads
- **Deployment**: Vercel Serverless / Node Runtime

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend App                     │
│               (https://oxvishall.vercel.app)                │
├──────────────────────────────┬──────────────────────────────┤
│  Public UI Components        │  Admin Panel (/admin)        │
│  - BioSection & View Counter │  - Login (/admin/login)      │
│  - Projects & Experiences    │  - Dashboard Editor          │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Route Handlers                    │
│   /api/views  •  /api/projects  •  /api/experience          │
└──────────────────────────────┬──────────────────────────────┘
                               │ (HTTP API Proxy)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Backend Server                   │
│   (https://github.com/oxvishall/vibecoded-portfolio/server)  │
├──────────────────────────────┬──────────────────────────────┤
│  MongoDB Database (Mongoose) │  Vercel Blob Storage         │
│  - Views Count Collection    │  - Uploaded Project Images   │
│  - Projects & Experiences    │                              │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ or [Bun](https://bun.sh/)
- [MongoDB](https://www.mongodb.com/) cluster instance

### 1. Clone the Repositories
```bash
git clone https://github.com/oxvishall/nothing-os-themed-portfolio.git
cd nothing-os-themed-portfolio
```

### 2. Configure Environment Variables

Create a `.env` file in the root of `portfolio`:

```env
# Server Backend API URL
API_URL=https://vibecoded-portfolio-server.vercel.app/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

If running the **Express Backend Server** locally ([`vibecoded-portfolio/server`](https://github.com/oxvishall/vibecoded-portfolio/tree/main/server)):

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ADMIN_PASSWORD=your_secure_admin_password
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### 3. Install & Run Locally

#### Running Frontend (Next.js):
```bash
bun install  # or npm install
bun dev      # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Running Backend Server ([Source Code](https://github.com/oxvishall/vibecoded-portfolio/tree/main/server)):
```bash
cd ../vibecoded-portfolio/server
npm install
npm run dev
```

---

## 📂 Directory Structure

```
portfolio/
├── app/
│   ├── admin/               ← Admin dashboard & login pages
│   │   ├── dashboard/
│   │   └── login/
│   ├── api/                 ← Next.js API Proxy routes (projects, experience, views)
│   ├── components/          ← UI components (BioSection, CoverBanner, ProfileTabs, Sidebar)
│   ├── data/                ← Default/static portfolio dataset (portfolio.tsx)
│   ├── globals.css          ← Nothing OS theme design tokens & styles
│   ├── layout.tsx           ← Metadata, fonts & root HTML layout
│   └── page.tsx             ← Portfolio main landing page
├── lib/
│   ├── analytics.ts         ← Firebase analytics trackers
│   └── firebase.ts          ← Firebase initialization
├── public/                  ← Icons, images, and web fonts
└── README.md                ← Project documentation
```

---

## 🔒 Admin Access

To access the project management dashboard:
1. Navigate to `/admin/login` on the deployed site or localhost.
2. Enter your `ADMIN_PASSWORD` (configured on the Express backend).
3. Manage, edit, reorder, or delete projects and experience entries in real time.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Crafted with ❤️ by <a href="https://github.com/oxvishall"><b>Vishal Aakash</b></a>
</p>
