<div align="center">

# 🎵 Sonic

**A full-stack, cloud-native music streaming platform**

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-9.0.0-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.x-EF4444?style=flat-square&logo=turborepo&logoColor=white)](https://turbo.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-UNLICENSED-gray?style=flat-square)](LICENSE)

</div>

---

## Overview

Sonic is a **multi-platform music streaming application** built as a Turborepo monorepo. The active mobile client is **Sonic KMP** — a native Kotlin Multiplatform app with Compose Multiplatform UI targeting iOS and Android. The earlier Expo/React Native client (`apps/sonic`) has been **deprecated due to performance limitations** and is no longer under active development. The monorepo also includes an admin dashboard, a NestJS REST API backend, and a fully automated AWS-powered audio processing pipeline.

Audio uploaded by admins is automatically transcoded to HLS format via an AWS Batch + Go worker pipeline, stored in S3, and delivered to clients via CloudFront CDN. Meilisearch powers full-text search across tracks, albums, and artists.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Clients                          │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Sonic (KMP)  │  │    Admin     │  │  Sonic (RN)  │   │
│  │ Compose MP   │  │  Dashboard   │  │  DEPRECATED  │   │
│  │ iOS/Android  │  │  React/Vite  │  │  Expo + RN   │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘   │
└─────────┼─────────────────┼─────────────────────────────┘
          │                 │
          └─────────────────▼
                            │ HTTP / REST
          ┌─────────────────▼─────────────────┐
          │         NestJS Backend API        │
          │          (apps/backend)           │
          │   Auth │ Content │ Search │ Admin │
          └───────┬──────────┬────────────────┘
                  │          │
          ┌───────▼──┐  ┌────▼────────────────────┐
          │PostgreSQL│  │       Meilisearch       │
          │(Drizzle) │  │    (Full-text Search)   │
          └──────────┘  └─────────────────────────┘

                   Audio Upload Flow
          ┌──────────────────────────────────────┐
          │    Admin uploads raw audio file      │
          │           (via Backend API)          │
          │                 │                    │
          │         S3 Upload Bucket             │
          │                 │ S3 Event           │
          │            SQS Queue                 │
          │                 │ trigger            │
          │      Lambda (audio_processing)       │
          │                 │ submit job         │
          │         AWS Batch (Go worker)        │
          │          ffmpeg → HLS segments       │
          │                 │ upload             │
          │      S3 Processed Bucket             │
          │                 │                    │
          │    CloudFront CDN → Clients          │
          └──────────────────────────────────────┘
```

---

## Repository Structure

```
sonic/                              ← Turborepo monorepo root
├── apps/
│   ├── backend/                    ← NestJS REST API server
│   ├── sonic/                      ← Expo (React Native) mobile app [DEPRECATED]
│   ├── sonic-kmp/                  ← Kotlin Multiplatform mobile app [ACTIVE]
│   └── admin-dashboard/            ← Refine + Vite admin web app
├── audio-processing-pipeline/      ← AWS audio transcoding infrastructure
│   ├── audio_processing_go/        ← Go worker (HLS transcoding via ffmpeg)
│   ├── audio_processing_lambda/    ← Node.js Lambda (SQS → AWS Batch trigger)
│   ├── status_tracker_lambda/      ← Node.js Lambda (job status webhook)
│   └── aws/                        ← Terraform infrastructure definitions
├── packages/                       ← Shared packages (reserved)
├── turbo.json                      ← Turborepo task pipeline config
├── pnpm-workspace.yaml             ← PNPM workspace definition
└── podman-compose.yaml             ← Local dev services (Postgres + Meilisearch)
```

---

## Applications at a Glance

| App                         | Tech Stack                                                    | Purpose                                                                   |
| --------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `apps/backend`              | NestJS 11, Drizzle ORM, PostgreSQL, Better Auth, Meilisearch  | REST API — auth, content management, search, webhooks                     |
| `apps/sonic` ⚠              | Expo 54, React Native, Expo Router, React Native Track Player | **Deprecated** — superseded by `apps/sonic-kmp` due to performance issues |
| `apps/sonic-kmp`            | Kotlin Multiplatform, Compose Multiplatform, Ktor, Koin       | Native KMP mobile client (iOS + Android)                                  |
| `apps/admin-dashboard`      | React 19, Refine, shadcn/ui, Vite, Tailwind CSS v4            | Web admin panel for content management                                    |
| `audio-processing-pipeline` | Go, Node.js Lambda, AWS Batch, Terraform                      | Serverless audio transcoding to HLS                                       |

---

## Prerequisites

| Tool                                                       | Version              | Purpose                         |
| ---------------------------------------------------------- | -------------------- | ------------------------------- |
| [Node.js](https://nodejs.org)                              | ≥ 18                 | JS runtime                      |
| [pnpm](https://pnpm.io)                                    | 9.0.0                | Package manager                 |
| [Turbo](https://turbo.build)                               | 2.x (auto-installed) | Monorepo task orchestration     |
| [Podman](https://podman.io) / [Docker](https://docker.com) | Any                  | Local service containers        |
| [Android Studio](https://developer.android.com/studio)     | Latest               | Android emulator (mobile apps)  |
| [Xcode](https://developer.apple.com/xcode/)                | ≥ 15                 | iOS builds (macOS only)         |
| [Android SDK](https://developer.android.com/studio)        | Latest               | KMP Android target              |
| [JDK](https://adoptium.net)                                | 17                   | KMP Gradle builds               |
| [Go](https://go.dev)                                       | ≥ 1.21               | Audio processing worker         |
| [Terraform](https://www.terraform.io)                      | ≥ 1.5                | AWS infrastructure provisioning |

---

## Quick Start

### 1. Clone & Install Dependencies

```bash
git clone <repository-url> sonic
cd sonic
pnpm install
```

### 2. Configure Environment Variables

Each app has its own `.env` file. Copy the templates and fill in your values:

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env

# Expo Mobile App
cp apps/sonic/.env.example apps/sonic/.env

# Admin Dashboard
cp apps/admin-dashboard/.env.example apps/admin-dashboard/.env
```

> See the **Environment Variables** section below for the full reference.

### 3. Start Local Infrastructure

Sonic requires PostgreSQL and Meilisearch. Start them using Podman Compose (or Docker Compose):

```bash
# From the repo root — uses podman-compose.yaml
POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres POSTGRES_DB=sonic \
MEILISEARCH_MASTER_KEY=sonic-meili-local-key-2026 \
podman-compose up -d

# Or with Docker Compose
docker compose -f podman-compose.yaml up -d
```

### 4. Run Database Migrations

```bash
cd apps/backend
pnpm drizzle-migrate
```

### 5. Start All Web Apps

```bash
# From the repo root — starts backend + admin-dashboard in parallel
pnpm dev
```

Individual apps:

```bash
# Backend only
cd apps/backend && pnpm dev

# Admin Dashboard only
cd apps/admin-dashboard && pnpm dev

# Expo mobile app (opens Metro bundler)
cd apps/sonic && pnpm start
```

---

## Environment Variables

### Root-level (podman-compose)

These variables are used by `podman-compose.yaml` to bootstrap local services:

| Variable                 | Description                | Example                      |
| ------------------------ | -------------------------- | ---------------------------- |
| `POSTGRES_USER`          | PostgreSQL username        | `postgres`                   |
| `POSTGRES_PASSWORD`      | PostgreSQL password        | `postgres`                   |
| `POSTGRES_DB`            | PostgreSQL database name   | `sonic`                      |
| `MEILISEARCH_MASTER_KEY` | Meilisearch master API key | `sonic-meili-local-key-2026` |

---

### Backend (`apps/backend/.env`)

| Variable                      | Required | Description                                      | Example                                               |
| ----------------------------- | -------- | ------------------------------------------------ | ----------------------------------------------------- |
| `PORT`                        | No       | HTTP port for the NestJS server                  | `5000`                                                |
| `DATABASE_URL`                | ✅       | Full PostgreSQL connection string                | `postgresql://postgres:postgres@localhost:5432/sonic` |
| `BETTER_AUTH_SECRET`          | ✅       | Secret key for Better Auth session signing       | `<random 32+ char string>`                            |
| `BETTER_AUTH_URL`             | ✅       | Base URL of the backend (used in OAuth flows)    | `http://localhost:5000`                               |
| `AWS_ACCESS_KEY_ID`           | ✅       | AWS IAM access key                               | `AKIA...`                                             |
| `AWS_SECRET_ACCESS_KEY`       | ✅       | AWS IAM secret key                               | `...`                                                 |
| `AWS_REGION`                  | ✅       | AWS region for S3/CloudFront                     | `ap-south-2`                                          |
| `AWS_AUDIO_BUCKET`            | ✅       | S3 bucket for raw audio uploads                  | `my-upload-audio-bucket`                              |
| `AWS_IMAGE_BUCKET`            | ✅       | S3 bucket for content images                     | `my-content-images-bucket`                            |
| `AWS_AUDIO_PROCESSED_BUCKET`  | ✅       | S3 bucket for HLS-processed audio                | `my-processed-audio-bucket`                           |
| `WEBHOOK_SECRET`              | ✅       | HMAC secret for validating AWS webhook callbacks | `<hex string>`                                        |
| `AWS_CLOUDFRONT_IMAGE_DOMAIN` | No       | CloudFront domain for images                     | `your-image.cloudfront.net`                           |
| `AWS_CLOUDFRONT_AUDIO_DOMAIN` | No       | CloudFront domain for audio                      | `your-audio.cloudfront.net`                           |
| `USE_CLOUDFRONT`              | No       | Serve media through CloudFront CDN               | `true`                                                |
| `MEILISEARCH_HOST`            | ✅       | Meilisearch server URL                           | `http://localhost:7700`                               |
| `MEILISEARCH_MASTER_KEY`      | ✅       | Meilisearch master key                           | `sonic-meili-local-key-2026`                          |

---

### Expo Mobile App (`apps/sonic/.env`)

| Variable              | Required | Description                                                          | Example                     |
| --------------------- | -------- | -------------------------------------------------------------------- | --------------------------- |
| `EXPO_PUBLIC_API_URL` | ✅       | Base URL of the backend API (must be reachable from device/emulator) | `http://192.168.1.100:5000` |

> **Note:** When running on a physical device or emulator, use your machine's LAN IP address (not `localhost`).

---

### Admin Dashboard (`apps/admin-dashboard/.env`)

| Variable       | Required | Description                 | Example                 |
| -------------- | -------- | --------------------------- | ----------------------- |
| `VITE_API_URL` | ✅       | Base URL of the backend API | `http://localhost:5000` |

---

### Audio Processing Pipeline

#### Lambda Functions (set as AWS Lambda environment variables)

| Variable                | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `BATCH_JOB_QUEUE`       | ARN of the AWS Batch job queue                   |
| `BATCH_JOB_DEFINITION`  | ARN of the AWS Batch job definition              |
| `PROCESSED_BUCKET_NAME` | Name of the S3 output bucket                     |
| `WEBHOOK_SECRET`        | HMAC secret for signing backend notifications    |
| `BACKEND_URL`           | Base URL of the NestJS backend                   |
| `AWS_REGION`            | AWS region                                       |
| `AWS_ENDPOINT_URL`      | (Optional) LocalStack endpoint for local testing |

#### Go Batch Worker (set via AWS Batch container overrides)

| Variable           | Description                                      |
| ------------------ | ------------------------------------------------ |
| `INPUT_BUCKET`     | S3 bucket containing the raw audio file          |
| `INPUT_KEY`        | S3 key of the raw audio file                     |
| `OUTPUT_BUCKET`    | S3 bucket to upload HLS artifacts                |
| `AWS_REGION`       | AWS region                                       |
| `AWS_ENDPOINT_URL` | (Optional) LocalStack endpoint for local testing |

#### Terraform (`audio-processing-pipeline/aws/terraform.tfvars`)

| Variable                     | Description                                          |
| ---------------------------- | ---------------------------------------------------- |
| `aws_access_key`             | AWS IAM access key for Terraform                     |
| `aws_secret_key`             | AWS IAM secret key for Terraform                     |
| `aws_region`                 | AWS deployment region                                |
| `upload_bucket_name`         | Raw audio upload S3 bucket name                      |
| `processed_bucket_name`      | Processed HLS audio S3 bucket name                   |
| `content_images_bucket_name` | Content images S3 bucket name                        |
| `webhook_secret`             | Shared HMAC secret (must match backend)              |
| `backend_url`                | Publicly accessible backend URL for Lambda callbacks |
| `frontend_url`               | Admin dashboard URL (used in CORS config)            |
| `processor_docker_image`     | ECR image URL for the Go audio worker                |
| `cors_allowed_origins`       | List of allowed CORS origins                         |
| `enable_cloudfront`          | Whether to provision CloudFront distributions        |

---

## Development Commands

### Monorepo-level (from root)

```bash
pnpm dev          # Start all apps in dev/watch mode
pnpm build        # Build all apps
pnpm lint         # Lint all apps
pnpm check-types  # Type-check all apps
pnpm format       # Format all files with Prettier
```

### Backend

```bash
cd apps/backend
pnpm dev                 # Start with hot-reload
pnpm build               # Compile TypeScript
pnpm start:prod          # Run compiled production build
pnpm drizzle-generate    # Generate SQL migration files
pnpm drizzle-migrate     # Apply migrations to the database
pnpm drizzle-push        # Push schema changes (dev only)
pnpm drizzle-studio      # Open Drizzle Studio (DB GUI)
pnpm test                # Run unit tests
pnpm test:e2e            # Run end-to-end tests
```

### Expo Mobile App

```bash
cd apps/sonic
pnpm start               # Start Metro bundler
pnpm android             # Run on Android device/emulator
pnpm ios                 # Run on iOS simulator (macOS only)
pnpm web                 # Run in web browser
pnpm lint                # Run ESLint
```

### KMP Mobile App

```bash
cd apps/sonic-kmp
./gradlew :composeApp:assembleDebug       # Build Android APK
./gradlew :composeApp:installDebug        # Build & install on device
# iOS: Open iosApp/iosApp.xcodeproj in Xcode and run
```

### Admin Dashboard

```bash
cd apps/admin-dashboard
pnpm dev      # Start Vite dev server
pnpm build    # Build production bundle
pnpm start    # Serve production build
```

---

## CI/CD

The repository includes a GitHub Actions workflow for automated iOS builds:

**`.github/workflows/ios-build-appetize.yml`**

- Triggered on every push, or manually with a custom `BASE_URL` input
- Builds the KMP iOS app for the simulator using `xcodebuild`
- Uploads the `.app` bundle to [Appetize.io](https://appetize.io) for preview
- Archives the build as a GitHub Actions artifact

**Required GitHub Secrets:**

| Secret           | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `APPETIZE_TOKEN` | Appetize.io API token for uploading builds                  |
| `BASE_URL`       | Default backend URL injected into the KMP app at build time |

---

## Audio Processing Pipeline — Deep Dive

The audio pipeline is a fully serverless, event-driven architecture on AWS:

```
1. Admin → Backend API → S3 (upload-audio-bucket)
2. S3 ObjectCreated event → SQS Queue
3. SQS → Lambda (audio_processing_lambda) → AWS Batch Job submission
4. AWS Batch → Go Docker container → ffmpeg HLS transcoding
5. Go worker → S3 (processed-audio-bucket) uploads HLS segments + manifest
6. Status Tracker Lambda → Backend webhook → Recording status updated
```

**Key components:**

- **`audio_processing_lambda/`** — Node.js Lambda. Reads SQS messages, parses S3 events, submits Batch jobs, and notifies the backend via HMAC-signed webhook.
- **`audio_processing_go/`** — Go Docker image run in AWS Batch. Downloads the raw file, runs `ffmpeg` to produce HLS segments, uploads results to S3.
- **`status_tracker_lambda/`** — Node.js Lambda. Tracks AWS Batch job state changes and posts status updates to the backend.
- **`aws/`** — Terraform configurations provisioning all AWS resources: S3 buckets, SQS queues, Lambda functions, AWS Batch compute environments, IAM roles, and CloudFront distributions.

### Local Testing with LocalStack

```bash
cd audio-processing-pipeline
# Set your LocalStack auth token in .env
LOCALSTACK_AUTH_TOKEN=<your-token> podman-compose up -d
```

Set `AWS_ENDPOINT_URL=http://localhost:4566` in both Lambda and Go worker environments when testing locally.

---

## Database Schema

The PostgreSQL database is managed via Drizzle ORM. Core entities:

| Table              | Description                               |
| ------------------ | ----------------------------------------- |
| `user`             | Registered users                          |
| `account`          | OAuth / credential accounts (Better Auth) |
| `session`          | Active user sessions                      |
| `verification`     | Email / phone verification tokens         |
| `artist`           | Music artists                             |
| `album`            | Music albums                              |
| `album_artist`     | Album ↔ Artist junction                   |
| `track`            | Individual tracks (metadata)              |
| `track_artist`     | Track ↔ Artist junction                   |
| `recording`        | Raw audio recordings (uploaded files)     |
| `recording_artist` | Recording ↔ Artist junction               |
| `genre`            | Genres                                    |
| `album_genre`      | Album ↔ Genre junction                    |

---

## Tech Stack Summary

| Layer                   | Technology                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------ |
| **Monorepo**            | Turborepo, pnpm workspaces                                                           |
| **Backend**             | NestJS 11, TypeScript, Drizzle ORM, Better Auth                                      |
| **Database**            | PostgreSQL 15                                                                        |
| **Search**              | Meilisearch v1.44                                                                    |
| **Storage**             | AWS S3 + CloudFront CDN                                                              |
| **Audio Transcoding**   | AWS Batch, Go + ffmpeg (HLS)                                                         |
| **Event Orchestration** | AWS SQS, AWS Lambda (Node.js)                                                        |
| **Infrastructure**      | Terraform (AWS)                                                                      |
| **Mobile** ✅           | Kotlin Multiplatform, Compose Multiplatform, Ktor, Koin                              |
| **Mobile** ⚠ Deprecated | ~~Expo 54, React Native, Expo Router, React Native Track Player~~ (see `apps/sonic`) |
| **Admin Web**           | React 19, Refine, shadcn/ui, Vite, Tailwind CSS v4                                   |
| **Auth**                | Better Auth (sessions + OAuth)                                                       |
| **Containerization**    | Podman / Docker                                                                      |

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm lint && pnpm check-types` to validate
4. Open a pull request

---

## License

This project is **UNLICENSED** — all rights reserved.
