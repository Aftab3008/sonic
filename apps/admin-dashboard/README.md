# Sonic — Admin Dashboard

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Refine](https://img.shields.io/badge/Refine-5-FF6B6B?style=flat-square)](https://refine.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

The **Sonic Admin Dashboard** is a web-based administration panel for the Sonic music streaming platform. Built with [Refine](https://refine.dev), [React 19](https://react.dev), [shadcn/ui](https://ui.shadcn.com/), and [Vite](https://vitejs.dev), it provides content managers and administrators with full CRUD control over the platform's music catalogue.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Building for Production](#building-for-production)
- [Key Libraries](#key-libraries)

---

## Features

- 👤 **User management** — list, view, and manage registered users
- 🎵 **Track management** — full CRUD for tracks with artist and album linkage
- 💿 **Album management** — create and manage albums with artwork upload
- 🎤 **Artist management** — manage artists and their profiles
- 🎧 **Recording management** — upload raw audio files and monitor processing status (pending → processing → complete)
- 🏷️ **Genre management** — manage music genres and assign them to albums
- 📊 **Dashboard overview** — stats on users, tracks, albums, and recordings
- 🔐 **Authentication** — admin sign-in and sign-out via Better Auth
- 🌙 **Theme** — light/dark mode support
- ⌨️ **Command bar** — kbar-powered keyboard command palette

---

## Architecture

```
┌───────────────────────────────────────────────────┐
│                  Refine Framework                 │
│                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────┐  │
│  │  Resources  │  │ Data Provider│  │  Auth   │  │
│  │  (routes)   │  │  (REST API)  │  │Provider │  │
│  └──────┬──────┘  └──────┬───────┘  └────┬────┘  │
│         │                │               │        │
│  ┌──────▼──────────────────────────────────────┐  │
│  │              React Router v7                │  │
│  └──────┬──────────────────────────────────────┘  │
│         │                                          │
│  ┌──────▼──────────────────────────────────────┐  │
│  │          Pages (CRUD per resource)          │  │
│  │  List │ Show │ Create │ Edit │ Dashboard     │  │
│  └──────┬──────────────────────────────────────┘  │
│         │                                          │
│  ┌──────▼──────────────────────────────────────┐  │
│  │      shadcn/ui + Radix UI Components        │  │
│  │        Tailwind CSS v4 Styling              │  │
│  └─────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
                       │ HTTP REST
          ┌────────────▼────────────────┐
          │      Sonic Backend API       │
          │      (NestJS on :5000)       │
          └──────────────────────────────┘
```

### Data Flow

1. **Refine Resources** define the CRUD operations for each entity (tracks, albums, artists, etc.)
2. The **REST Data Provider** maps Refine operations to backend API calls using `ky`
3. **React Router v7** handles client-side navigation between resource pages
4. The **Auth Provider** manages admin sessions via Better Auth
5. **TanStack Query** caches all server state and handles background refetching

---

## Project Structure

```
apps/admin-dashboard/
├── src/
│   ├── App.tsx                 ← Root Refine configuration (resources, providers)
│   ├── index.tsx               ← React DOM entry point
│   ├── App.css                 ← Global styles
│   ├── components/             ← Shared UI components (tables, forms, layouts)
│   ├── config/                 ← Refine data provider and auth provider setup
│   ├── constants/              ← App-wide constants (API endpoints, enums)
│   ├── hooks/                  ← Custom React hooks
│   ├── lib/                    ← Utility functions (cn, date formatting)
│   ├── pages/                  ← CRUD pages per resource
│   │   ├── dashboard/          ← Overview stats dashboard
│   │   ├── users/              ← User management
│   │   ├── tracks/             ← Track CRUD
│   │   ├── albums/             ← Album CRUD with artwork
│   │   ├── artists/            ← Artist CRUD
│   │   ├── recordings/         ← Recording upload + status monitoring
│   │   ├── genres/             ← Genre management
│   │   ├── login/              ← Admin sign-in
│   │   ├── register/           ← Admin registration
│   │   └── forgotPassword/     ← Password reset
│   ├── providers/              ← React context providers (theme, auth)
│   └── types/                  ← TypeScript interfaces for API entities
├── public/                     ← Static assets
├── index.html                  ← HTML entry point
├── vite.config.ts              ← Vite configuration
├── components.json             ← shadcn/ui configuration
└── Dockerfile                  ← Production container image
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org) | ≥ 18 |
| [pnpm](https://pnpm.io) | 9.0.0 |

The dashboard requires the **Sonic backend** to be running. See `apps/backend/README.md`.

---

## Setup & Installation

### 1. Install dependencies

From the **monorepo root**:

```bash
pnpm install
```

Or from within this directory:

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your values
```

---

## Environment Variables

Create a `.env` file in `apps/admin-dashboard/`:

```env
# Base URL of the Sonic backend API
VITE_API_URL=http://localhost:5000
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Full base URL of the NestJS backend API. The dashboard makes all API calls relative to this URL. |

> **Note:** This variable is bundled into the client-side JavaScript at build time by Vite (because it's prefixed with `VITE_`). Do **not** store secrets here.

---

## Running the App

```bash
# Development server (hot module replacement)
pnpm dev

# The dashboard will be available at http://localhost:5173
```

---

## Building for Production

```bash
# Type-check + build
pnpm build

# Preview the production build locally
pnpm start
```

Production output is written to `dist/`.

### Docker

A `Dockerfile` is included for containerised deployment:

```bash
docker build -t sonic-admin-dashboard .
docker run -p 80:80 -e VITE_API_URL=https://api.yourserver.com sonic-admin-dashboard
```

---

## Key Libraries

| Library | Purpose |
|---------|---------|
| [Refine](https://refine.dev) | CRUD framework for admin panels — handles routing, data fetching, and CRUD conventions |
| [React Router v7](https://reactrouter.com) | Client-side routing (via Refine's router provider) |
| [TanStack Query](https://tanstack.com/query) | Server state management and caching |
| [TanStack Table](https://tanstack.com/table) | Headless table rendering (via Refine's table hooks) |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible component library built on Radix UI |
| [Radix UI](https://www.radix-ui.com/) | Headless, accessible component primitives |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first CSS framework |
| [Lucide React](https://lucide.dev) | Icon library |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev) | Form handling and schema validation |
| [Recharts](https://recharts.org) | Dashboard charts and data visualisation |
| [better-auth](https://www.better-auth.com/) | Admin authentication (shared with backend) |
| [ky](https://github.com/sindresorhus/ky) | HTTP client for API requests |
| [date-fns](https://date-fns.org/) / [dayjs](https://day.js.org/) | Date formatting utilities |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |
| [kbar](https://kbar.vercel.app/) | Command palette (keyboard shortcuts) |
| [next-themes](https://github.com/pacocoursey/next-themes) | Light/dark theme management |
| [cmdk](https://cmdk.paco.me/) | Command menu component |

---

## Resource Pages

Each resource follows the standard Refine CRUD pattern:

| Resource | List | Show | Create | Edit |
|----------|------|------|--------|------|
| `users` | ✅ | ✅ | — | — |
| `tracks` | ✅ | ✅ | ✅ | ✅ |
| `albums` | ✅ | ✅ | ✅ | ✅ |
| `artists` | ✅ | ✅ | ✅ | ✅ |
| `recordings` | ✅ | ✅ | ✅ | — |
| `genres` | ✅ | ✅ | ✅ | ✅ |

---

## Authentication

The dashboard uses **Better Auth** for admin sessions. Authentication is handled via the same backend instance used by the mobile apps — admin accounts must have elevated privileges set in the database.

Sign-in flow:
1. Navigate to `/login`
2. Enter admin credentials
3. Session cookie is set (httpOnly, managed by Better Auth)
4. Refine's auth provider wraps all API calls with the authenticated session
