# Sonic — KMP Mobile App (Active)

[![Kotlin](https://img.shields.io/badge/Kotlin-Multiplatform-7F52FF?style=flat-square&logo=kotlin&logoColor=white)](https://kotlinlang.org/docs/multiplatform.html)
[![Compose](https://img.shields.io/badge/Compose_Multiplatform-1.x-4285F4?style=flat-square&logo=jetpackcompose&logoColor=white)](https://www.jetbrains.com/lp/compose-multiplatform/)
[![Android](https://img.shields.io/badge/Android-API_26%2B-3DDC84?style=flat-square&logo=android&logoColor=white)](https://developer.android.com)
[![iOS](https://img.shields.io/badge/iOS-15%2B-000000?style=flat-square&logo=apple&logoColor=white)](https://developer.apple.com)
![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)

> [!IMPORTANT]
> **This is the primary mobile client for Sonic.** The earlier Expo/React Native app (`apps/sonic`) was deprecated due to performance issues — including audio playback reliability, JavaScript bridge overhead, and animation fidelity at scale. This KMP implementation delivers fully native performance on both Android and iOS from a shared Kotlin codebase.

The **Sonic KMP app** is a native **Kotlin Multiplatform (KMP)** mobile client for the Sonic music streaming platform, targeting both **Android** and **iOS** from a single shared codebase using Compose Multiplatform for the UI layer.

## Table of Contents

- [Architecture](#architecture)
- [Module Structure](#module-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup & Configuration](#setup--configuration)
- [Building & Running](#building--running)
<!-- - [CI/CD — Appetize.io](#cicd--appetizeio) -->
- [Key Libraries](#key-libraries)

---

## Architecture

The project follows a **multi-module, feature-first** architecture with clear separation between core infrastructure and feature modules.

```
composeApp/          ← App entry point (Android + iOS)
    │
    ├── core/        ← Shared infrastructure modules
    │   ├── ui/          ← Design system, theme, shared composables
    │   ├── navigation/  ← NavHost, routes, navigation contracts
    │   ├── network/     ← Ktor HTTP client, API service layer
    │   ├── auth/        ← Authentication state and session management
    │   └── player/      ← Media player abstraction layer
    │
    └── features/    ← UI feature modules (each self-contained)
        ├── auth/        ← Sign-in / Sign-up screens
        ├── home/        ← Home feed screen
        ├── search/      ← Search screen
        ├── discovery/   ← Discovery screen
        ├── library/     ← Library (albums, artists, tracks)
        ├── player/      ← Now-playing player screen
        └── album/       ← Album detail screen
```

### Dependency Flow

```
composeApp
    └── features/* (UI)
            └── core/ui, core/navigation
            └── core/network (data fetching)
            └── core/auth (session)
            └── core/player (playback)
```

Each feature module depends only on `core/` modules — never on other feature modules. This enforces loose coupling and makes each feature independently testable.

### Dependency Injection

[Koin](https://insert-koin.io/) is used for dependency injection across all modules. Each module exposes a Koin `Module` that is aggregated in `composeApp`.

---

## Module Structure

### Core Modules

| Module            | Description                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| `core:ui`         | Shared Material 3 theme, typography, color palette, common composables (buttons, cards, loading states) |
| `core:navigation` | Type-safe navigation definitions, `NavHost` setup, route contracts shared across features               |
| `core:network`    | Ktor HTTP client configuration, authentication interceptors, base service abstractions                  |
| `core:auth`       | Better Auth session management, token storage via Android EncryptedSharedPreferences / iOS Keychain     |
| `core:player`     | Platform-agnostic media player abstraction; Android implementation uses ExoPlayer / Media3              |

### Feature Modules

| Module               | Description                                                                           |
| -------------------- | ------------------------------------------------------------------------------------- |
| `features:auth`      | Sign-in and Sign-up screens with form validation                                      |
| `features:home`      | Home feed displaying recent albums, recommendations, and featured content             |
| `features:search`    | Full-text search UI with results for tracks, albums, and artists                      |
| `features:discovery` | Curated discovery feed                                                                |
| `features:library`   | User's music library — albums, artists, playlists                                     |
| `features:player`    | Full-screen now-playing screen with playback controls, seek bar, and queue management |
| `features:album`     | Album detail screen with track listing                                                |

---

## Features

- 🎵 **Native audio playback** — ExoPlayer / Media3 on Android; AVPlayer bridge on iOS
- 🏗️ **Shared UI** — Compose Multiplatform across Android and iOS
- 🔐 **Authentication** — Better Auth session-based auth with encrypted credential storage
- 🖼️ **Image loading** — Coil 3 with Ktor network fetcher
- 💉 **Dependency injection** — Koin
- 🗝️ **Settings persistence** — Multiplatform Settings (no-arg)
- 🌐 **HTTP networking** — Ktor client with JSON serialization

---

## Prerequisites

| Tool                                                   | Version                              | Notes                                     |
| ------------------------------------------------------ | ------------------------------------ | ----------------------------------------- |
| [Android Studio](https://developer.android.com/studio) | Hedgehog or newer                    | Includes Kotlin plugin                    |
| [Xcode](https://developer.apple.com/xcode/)            | ≥ 15                                 | macOS only, for iOS target                |
| [JDK](https://adoptium.net)                            | 17                                   | Required for Gradle                       |
| [Kotlin](https://kotlinlang.org)                       | ≥ 2.0                                | Bundled via Gradle toolchain              |
| [Gradle](https://gradle.org)                           | via wrapper (`gradlew`)              | No global install required                |
| Android SDK                                            | API 26 (minSdk) — API 35 (targetSdk) | Configured in `build.gradle.kts`          |
| Cocoapods                                              | Latest                               | Only needed for iOS dependency management |

---

## Setup & Configuration

### 1. Clone and open the project

Open the `apps/sonic-kmp/` directory in **Android Studio** (recommended) or any IDE with KMP support.

### 2. Configure the backend URL

The base URL for the network client is injected at build time. Update `core/network` to point to your backend:

- **For local development:** Use your machine's LAN IP address (e.g., `http://192.168.1.100:5000`)
- **For CI/CD builds:** Passed via the `BASE_URL` environment variable / GitHub Actions input

### 3. Sync Gradle

Android Studio will automatically sync Gradle on project open. To trigger manually:

```bash
./gradlew --refresh-dependencies
```

### 4. iOS Setup (macOS only)

```bash
# Open the Xcode project
open iosApp/iosApp.xcodeproj
```

If using CocoaPods:

```bash
cd iosApp
pod install
open iosApp.xcworkspace
```

---

## Building & Running

### Android

#### Via Android Studio

1. Select the `composeApp` run configuration from the toolbar
2. Choose your target device/emulator
3. Click **Run**

#### Via Command Line

```bash
# Debug APK
./gradlew :composeApp:assembleDebug

# Install on connected device
./gradlew :composeApp:installDebug

# Release APK (requires signing config)
./gradlew :composeApp:assembleRelease
```

Output APK location: `composeApp/build/outputs/apk/debug/composeApp-debug.apk`

### iOS

#### Via Xcode (recommended)

1. Open `iosApp/iosApp.xcodeproj` in Xcode
2. Select a simulator or connected device
3. Press **Run** (⌘R)

#### Via Command Line (simulator)

```bash
xcodebuild build \
  -project iosApp/iosApp.xcodeproj \
  -scheme iosApp \
  -sdk iphonesimulator \
  -configuration Debug \
  -derivedDataPath build/ios-build \
  -destination 'generic/platform=iOS Simulator'
```

---

<!-- ## CI/CD — Appetize.io

A **GitHub Actions** workflow (`.github/workflows/ios-build-appetize.yml`) automatically builds the iOS simulator app and uploads it to [Appetize.io](https://appetize.io) for cloud-based preview.

### Trigger

- **Automatic:** On every push to any branch
- **Manual:** Via `workflow_dispatch` with an optional `base_url` input

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `APPETIZE_TOKEN` | Appetize.io API token for authenticated uploads |
| `BASE_URL` | Default backend base URL injected at build time |

### Workflow Steps

1. Check out the repository
2. Set up JDK 17 and Gradle
3. Build the iOS Simulator app using `xcodebuild`
4. Zip the `.app` bundle
5. Upload to Appetize.io via their REST API
6. Archive the zip as a GitHub Actions artifact

--- -->

## Key Libraries

| Library                                                                                                      | Purpose                                              |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)                                 | Shared UI across Android and iOS                     |
| [Koin](https://insert-koin.io/)                                                                              | Dependency injection                                 |
| [Ktor Client](https://ktor.io/docs/client-create-new-application.html)                                       | Multiplatform HTTP networking                        |
| [Coil 3](https://coil-kt.github.io/coil/)                                                                    | Async image loading (Compose + Ktor network fetcher) |
| [Kotlinx Serialization](https://github.com/Kotlin/kotlinx.serialization)                                     | JSON serialization                                   |
| [Multiplatform Settings](https://github.com/russhwolf/multiplatform-settings)                                | Key-value persistent settings                        |
| [AndroidX Lifecycle](https://developer.android.com/jetpack/androidx/releases/lifecycle)                      | ViewModel + runtime Compose lifecycle                |
| [AndroidX Security Crypto](https://developer.android.com/reference/androidx/security/crypto/package-summary) | Encrypted credential storage on Android              |
| [AndroidX Splash Screen](https://developer.android.com/reference/androidx/core/splashscreen/package-summary) | Android 12+ splash screen API                        |
| [Okio](https://square.github.io/okio/)                                                                       | Multiplatform I/O for file handling                  |

---

## Android App Config

| Property       | Value                |
| -------------- | -------------------- |
| Application ID | `com.aftab005.sonic` |
| Namespace      | `com.aftab005.sonic` |
| Min SDK        | API 26 (Android 8.0) |
| Target SDK     | API 35               |
| Compile SDK    | API 35               |
| JVM Target     | 11                   |

---

## Learn More

- [Kotlin Multiplatform Documentation](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)
- [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)
- [Koin for KMP](https://insert-koin.io/docs/reference/koin-mp/kmp/)
- [Ktor Client](https://ktor.io/docs/client-create-new-application.html)
