# Sonic — Mobile App (Expo) ⚠️ DEPRECATED

> [!CAUTION]
> **This application is no longer actively developed.**
> The Expo/React Native implementation was deprecated due to performance limitations encountered at scale — specifically around audio playback reliability, animation jank, and the overhead of the JavaScript bridge. Active mobile development has moved to **[apps/sonic-kmp](../sonic-kmp/README.md)**, the Kotlin Multiplatform (Compose Multiplatform) client. This codebase is preserved for reference only.

[![Expo](https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square)](https://tanstack.com/query)
![Deprecated](https://img.shields.io/badge/Status-Deprecated-red?style=flat-square)

~~The **Sonic Expo app** was the primary cross-platform mobile client~~ for the Sonic music streaming platform. Built with Expo 54 and React Native, it targeted **iOS**, **Android**, and **Web**. It has since been superseded by the KMP implementation for performance and native fidelity reasons.

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

- 🎵 **Music streaming** — HLS audio playback via React Native Track Player
- 🔍 **Search** — full-text search powered by Meilisearch (via backend API)
- 📚 **Library** — browse albums, artists, tracks, and genres
- 🗂️ **Local files** — scan and play audio files stored on-device
- 🔍 **Discovery** — curated content feed
- 🔐 **Authentication** — session-based sign-in / sign-up via Better Auth
- 🎨 **Adaptive theming** — automatic light/dark mode
- 📱 **Edge-to-edge UI** — uses Expo Navigation Bar and system UI APIs
- 🔒 **Secure storage** — credentials stored via Expo SecureStore
- 🎧 **Background playback** — full media session + lock screen controls

---

## Architecture

```
┌──────────────────────────────────────────────┐
│               Expo Router (file-based)       │
│                                              │
│  app/                                        │
│  ├── index.tsx          ← Auth guard / entry │
│  ├── (auth)/            ← Sign-in, Sign-up   │
│  └── (root)/                                 │
│      ├── (tabs)/        ← Tab navigation     │
│      │   ├── home/      ← Home feed          │
│      │   ├── search/    ← Search screen      │
│      │   ├── discover/  ← Discovery          │
│      │   ├── library/   ← Library            │
│      │   └── local-files/ ← Local scanner    │
│      ├── player/        ← Full-screen player │
│      └── account/       ← Account settings   │
└─────────────────────┬────────────────────────┘
                      │
         ┌────────────▼────────────┐
         │      State Layer        │
         │  Zustand (player store) │
         │  TanStack Query (API)   │
         │  MMKV (local cache)     │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │      Network Layer      │
         │   ky HTTP client        │
         │   Better Auth SDK       │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │     Backend API         │
         │  (NestJS REST + HLS)    │
         └─────────────────────────┘
```

---

## Project Structure

```
apps/sonic/
├── app/                        ← Expo Router pages (file-based routing)
│   ├── _layout.tsx             ← Root layout (fonts, providers, splash screen)
│   ├── index.tsx               ← Auth guard (redirects based on session)
│   ├── modal.tsx               ← Global modal route
│   ├── (auth)/                 ← Authentication screens
│   └── (root)/                 ← Authenticated app shell
│       ├── _layout.tsx         ← Root stack navigator
│       ├── (tabs)/             ← Bottom tab navigator
│       │   ├── home/           ← Home feed
│       │   ├── search/         ← Search
│       │   ├── discover/       ← Discovery
│       │   ├── library/        ← Library
│       │   └── local-files/    ← Local audio file scanner
│       ├── player/             ← Full-screen now-playing
│       └── account/            ← Account / settings
├── components/                 ← Shared UI components
├── constants/                  ← App-wide constants (colors, sizes)
├── hooks/                      ← Custom React hooks
├── lib/                        ← Core logic (auth client, API client)
├── providers/                  ← React context providers
├── store/                      ← Zustand stores (player state, etc.)
├── utils/                      ← Utility functions
├── plugins/                    ← Expo config plugins (e.g. withMedia3Fix)
├── assets/                     ← Images, fonts, icons
├── app.config.ts               ← Expo configuration
└── eas.json                    ← EAS Build profiles
```

---

## Prerequisites

| Tool                                                 | Version  | Notes                                 |
| ---------------------------------------------------- | -------- | ------------------------------------- |
| [Node.js](https://nodejs.org)                        | ≥ 18     |                                       |
| [pnpm](https://pnpm.io)                              | 9.0.0    | Or use `npm` / `yarn`                 |
| [Expo CLI](https://docs.expo.dev/more/expo-cli/)     | Latest   | `npm install -g expo-cli`             |
| [EAS CLI](https://docs.expo.dev/build/introduction/) | ≥ 18.4.0 | `npm install -g eas-cli` (for builds) |
| Android Studio                                       | Latest   | For Android emulator                  |
| Xcode                                                | ≥ 15     | For iOS simulator (macOS only)        |

---

## Setup & Installation

### 1. Install dependencies

From the **monorepo root**:

```bash
pnpm install
```

Or from this directory:

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start the backend

Ensure the Sonic backend is running and accessible from your device/emulator. See `apps/backend/README.md`.

---

## Environment Variables

Create a `.env` file in `apps/sonic/`:

```env
# Base URL of the Sonic backend API
# Use your machine's LAN IP when running on a physical device or emulator
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000
```

| Variable              | Required | Description                                                                                                                                                                                |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `EXPO_PUBLIC_API_URL` | ✅       | Full base URL of the NestJS backend. **Must be reachable from the device/emulator** — use your machine's local IP address (not `localhost`) when testing on a physical device or emulator. |

> **Finding your local IP:**
>
> ```bash
> # macOS / Linux
> ipconfig getifaddr en0
> # or
> ip addr show
> ```

---

## Running the App

### Start the Metro Bundler

```bash
pnpm start
# or
npx expo start
```

This opens the Expo developer menu. From there you can:

- Press `a` — open on Android emulator
- Press `i` — open on iOS simulator (macOS only)
- Press `w` — open in web browser
- Scan the QR code with the **Expo Go** app (limited — some native modules won't work)

### Run on a Specific Platform

```bash
# Android (builds and installs the dev client)
pnpm android

# iOS (macOS only)
pnpm ios

# Web
pnpm web
```

> **Note:** The app uses native modules (React Native Track Player, MMKV, SecureStore) that **require a development build**, not Expo Go. Use `expo run:android` / `expo run:ios` or install the pre-built APK (`dev_build.apk`).

---

## Building for Production

Sonic uses **EAS Build** for cloud builds.

### EAS Build Profiles

| Profile         | Description                                       |
| --------------- | ------------------------------------------------- |
| `development`   | Dev client with internal distribution             |
| `preview`       | Internal distribution (test with team)            |
| `prod-test`     | Production settings, APK output (for testing)     |
| `ios-simulator` | iOS simulator build (extends development)         |
| `production`    | Full production build with auto-increment version |

### Running EAS Builds

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build for Android (dev)
eas build --platform android --profile development

# Build for iOS (simulator)
eas build --platform ios --profile ios-simulator

# Build for production
eas build --platform all --profile production
```

### Local Android Debug Build

```bash
pnpm android
# Or directly:
npx expo run:android
```

---

## Key Libraries

| Library                                                                                                        | Purpose                                     |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [Expo Router](https://expo.github.io/router/)                                                                  | File-based navigation (v6)                  |
| [React Native Track Player](https://rntp.dev/)                                                                 | Audio playback engine with background mode  |
| [TanStack Query](https://tanstack.com/query)                                                                   | Server state management and caching         |
| [Zustand](https://zustand-demo.pmnd.rs/)                                                                       | Client-side state management (player state) |
| [Better Auth Expo](https://www.better-auth.com/docs/integrations/expo)                                         | Session-based authentication                |
| [React Native MMKV](https://github.com/mrousavy/react-native-mmkv)                                             | Ultra-fast local key-value storage          |
| [Expo SecureStore](https://docs.expo.dev/sdk/securestore/)                                                     | Encrypted credential storage                |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)                                 | High-performance UI animations              |
| [Shopify FlashList](https://shopify.github.io/flash-list/)                                                     | Performant large list rendering             |
| [Gorhom Bottom Sheet](https://gorhom.github.io/react-native-bottom-sheet/)                                     | Player and modal bottom sheets              |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev)                                       | Form handling and validation                |
| [ky](https://github.com/sindresorhus/ky)                                                                       | HTTP client for API requests                |
| [Expo Image](https://docs.expo.dev/sdk/image/)                                                                 | Optimised image loading                     |
| [Expo Linear Gradient](https://docs.expo.dev/sdk/linear-gradient/)                                             | Gradient backgrounds                        |
| [@missingcore/react-native-metadata-retriever](https://github.com/MissingCore/react-native-metadata-retriever) | Local audio file metadata extraction        |

---

## App Configuration

`app.config.ts` defines the Expo configuration:

| Key               | Value                                  |
| ----------------- | -------------------------------------- |
| App Name          | `Sonic`                                |
| Bundle ID (iOS)   | `com.aftab3008.sonic`                  |
| Package (Android) | `com.aftab3008.sonic`                  |
| Scheme            | `sonic://`                             |
| EAS Project ID    | `138c1cc4-60f7-4220-a164-79318520c9d2` |
| New Architecture  | Enabled (`newArchEnabled: true`)       |
| React Compiler    | Enabled (experimental)                 |

### Android Permissions

| Permission                          | Purpose                                |
| ----------------------------------- | -------------------------------------- |
| `FOREGROUND_SERVICE`                | Background audio playback              |
| `FOREGROUND_SERVICE_MEDIA_PLAYBACK` | Media playback foreground service type |
| `WAKE_LOCK`                         | Prevent CPU sleep during playback      |
| `READ_MEDIA_AUDIO`                  | Access local audio files               |

### iOS Capabilities

| Capability                 | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| `UIBackgroundModes: audio` | Background audio playback                |
| Face ID Permission         | Biometric authentication via SecureStore |
