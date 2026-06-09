# Sonic — Backend API

[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=flat-square)](https://orm.drizzle.team)
[![Meilisearch](https://img.shields.io/badge/Meilisearch-0.58-FF5CAA?style=flat-square&logo=meilisearch&logoColor=white)](https://www.meilisearch.com)

The **Sonic Backend** is a NestJS REST API that powers all Sonic client applications. It handles authentication, content management (tracks, albums, artists, genres), audio file uploads to AWS S3, full-text search via Meilisearch, and an HMAC-secured webhook system for receiving status updates from the AWS audio processing pipeline.

---

## Table of Contents

- [Architecture](#architecture)
- [Module Overview](#module-overview)
- [Database Schema](#database-schema)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [Database Management](#database-management)
- [API Structure](#api-structure)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Architecture

```
┌─────────────────────────────────────────────┐
│               NestJS Application            │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │ Content  │  │  Search  │   │
│  │ Module   │  │ Module   │  │  Module  │   │
│  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Admin   │  │ Webhooks │  │   DB     │   │
│  │ Module   │  │ Module   │  │  Module  │   │
│  └──────────┘  └──────────┘  └──────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  Global: Config │ Events │ Scheduler │   │
│  └──────────────────────────────────────┘   │
└──────────────┬────────────────┬─────────────┘
               │                │
       ┌───────▼──────┐  ┌──────▼──────────┐
       │  PostgreSQL  │  │  Meilisearch    │
       │  (Drizzle)   │  │  Search Index   │
       └──────────────┘  └─────────────────┘
               │
       ┌───────▼──────────────────────────┐
       │          AWS Services            │
       │  S3 (upload / processed images)  │
       │  CloudFront CDN (media delivery) │
       └──────────────────────────────────┘
```

### Request Pipeline

Every incoming request passes through:

1. **Selective body parsing** — `/api/auth/*` routes skip body parsing (Better Auth owns its body); `/api/webhooks/*` routes capture raw bytes for HMAC signature verification.
2. **CORS** — configured to allow the admin dashboard, Metro bundler, and mobile app origins.
3. **Global Exception Filter** — standardises error responses across all modules.
4. **Transform Interceptor** — wraps all successful responses in a consistent `{ data, statusCode }` envelope.

---

## Module Overview

| Module           | Path            | Responsibility                                                                                                        |
| ---------------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `AuthModule`     | `src/auth/`     | Session-based authentication via Better Auth. Handles sign-up, sign-in, sign-out, and session management.             |
| `ContentModule`  | `src/content/`  | CRUD for albums, artists, tracks, genres, recordings, and discovery content. Coordinates S3 presigned URL generation. |
| `AdminModule`    | `src/admin/`    | Admin-only endpoints for bulk content management and privileged operations.                                           |
| `SearchModule`   | `src/search/`   | Meilisearch index management and full-text search across tracks, albums, and artists.                                 |
| `WebhooksModule` | `src/webhooks/` | Receives HMAC-signed webhook events from AWS Lambda (job registration & status updates).                              |
| `DbModule`       | `src/db/`       | Provides the Drizzle ORM database connection as a global NestJS provider.                                             |

### Content Sub-modules

The `ContentModule` is further decomposed:

| Sub-module   | Responsibility                                                        |
| ------------ | --------------------------------------------------------------------- |
| `album/`     | Album CRUD, artwork upload via S3 presigned URLs                      |
| `artist/`    | Artist CRUD, profile image management                                 |
| `track/`     | Track CRUD, linking to albums and artists                             |
| `genre/`     | Genre management                                                      |
| `recording/` | Raw audio recording lifecycle (upload initiation → processing status) |
| `upload/`    | S3 presigned URL generation for direct client uploads                 |
| `discovery/` | Curated discovery feed content                                        |

---

## Database Schema

Managed by **Drizzle ORM**. Migrations live in `drizzle/`.

```
┌────────────────┐      ┌──────────────────┐
│     user       │◄────►│    account       │  (Better Auth)
└──────┬─────────┘      └──────────────────┘
       │                ┌──────────────────┐
       │                │    session       │  (Better Auth)
       │                └──────────────────┘
       │
       │         ┌──────────────┐     ┌──────────────┐
       │         │    artist    │     │    genre     │
       │         └──────┬───────┘     └──────┬───────┘
       │                │                    │
       │         ┌──────▼───────┐     ┌──────▼───────┐
       │         │ track_artist │     │ album_genre  │
       │         └──────────────┘     └──────────────┘
       │                │                    │
       │  ┌─────────────▼──────────────┐     │
       └─►│           album            │◄────┘
          └─────────────┬──────────────┘
                        │
               ┌────────▼────────┐
               │      track      │
               └────────┬────────┘
                        │
               ┌────────▼────────┐
               │    recording    │
               └─────────────────┘
```

**Tables:**

| Table              | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `user`             | Platform user accounts                                             |
| `account`          | OAuth / credential account linkages (Better Auth)                  |
| `session`          | Active user sessions                                               |
| `verification`     | Email/phone verification tokens                                    |
| `artist`           | Music artists                                                      |
| `album`            | Music albums with artwork                                          |
| `album_artist`     | Many-to-many: albums ↔ artists                                     |
| `track`            | Individual track metadata                                          |
| `track_artist`     | Many-to-many: tracks ↔ artists                                     |
| `recording`        | Audio file recording entity (upload lifecycle + processing status) |
| `recording_artist` | Many-to-many: recordings ↔ artists                                 |
| `genre`            | Music genres                                                       |
| `album_genre`      | Many-to-many: albums ↔ genres                                      |

---

## Prerequisites

| Tool                                       | Version                                     |
| ------------------------------------------ | ------------------------------------------- |
| [Node.js](https://nodejs.org)              | ≥ 18                                        |
| [pnpm](https://pnpm.io)                    | 9.0.0                                       |
| PostgreSQL                                 | 15 (via Docker/Podman or native)            |
| [Meilisearch](https://www.meilisearch.com) | v1.44+                                      |
| AWS Account                                | Required for S3 + CloudFront media delivery |

---

## Setup & Installation

### 1. Install dependencies

From the **repo root**:

```bash
pnpm install
```

Or from within this directory:

```bash
pnpm install
```

### 2. Start infrastructure services

From the **repo root**, use Podman Compose to spin up PostgreSQL and Meilisearch:

```bash
POSTGRES_USER=postgres \
POSTGRES_PASSWORD=postgres \
POSTGRES_DB=sonic \
MEILISEARCH_MASTER_KEY=sonic-meili-local-key-2026 \
podman-compose up -d
```

### 3. Configure environment variables

Create a `.env` file in this directory (see [Environment Variables](#environment-variables)):

```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Run database migrations

```bash
pnpm drizzle-migrate
```

---

## Environment Variables

Create a `.env` file in `apps/backend/` with the following variables:

```env
# ─── Server ──────────────────────────────────────────────────────────────────
PORT=5000

# ─── Database ────────────────────────────────────────────────────────────────
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sonic?sslmode=disable

# ─── Authentication (Better Auth) ────────────────────────────────────────────
# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=<your-secret>
BETTER_AUTH_URL=http://localhost:5000

# ─── AWS ─────────────────────────────────────────────────────────────────────
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
AWS_REGION=ap-south-2

AWS_AUDIO_BUCKET=<upload-audio-bucket-name>
AWS_IMAGE_BUCKET=<content-images-bucket-name>
AWS_AUDIO_PROCESSED_BUCKET=<processed-audio-bucket-name>

# ─── CloudFront CDN ──────────────────────────────────────────────────────────
AWS_CLOUDFRONT_IMAGE_DOMAIN=<your-cloudfront-image-domain>
AWS_CLOUDFRONT_AUDIO_DOMAIN=<your-cloudfront-audio-domain>
USE_CLOUDFRONT=true

# ─── Webhooks ────────────────────────────────────────────────────────────────
# Must match WEBHOOK_SECRET in Lambda + Terraform
# Generate with: openssl rand -hex 32
WEBHOOK_SECRET=<hex-secret>

# ─── Meilisearch ─────────────────────────────────────────────────────────────
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_MASTER_KEY=sonic-meili-local-key-2026
```

### Variable Reference

| Variable                      | Required | Description                                                                                                |
| ----------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `PORT`                        | No       | HTTP server port. Defaults to `3000` if unset.                                                             |
| `DATABASE_URL`                | ✅       | Full PostgreSQL connection string including host, port, DB name, and SSL options.                          |
| `BETTER_AUTH_SECRET`          | ✅       | Random secret used to sign sessions. Must be at least 32 characters.                                       |
| `BETTER_AUTH_URL`             | ✅       | Public base URL of this server. Used by Better Auth for OAuth redirects and email links.                   |
| `AWS_ACCESS_KEY_ID`           | ✅       | AWS IAM access key with permissions for S3 (GetObject, PutObject) on the relevant buckets.                 |
| `AWS_SECRET_ACCESS_KEY`       | ✅       | Corresponding AWS IAM secret access key.                                                                   |
| `AWS_REGION`                  | ✅       | AWS region where S3 buckets and CloudFront distributions are deployed.                                     |
| `AWS_AUDIO_BUCKET`            | ✅       | S3 bucket name for raw audio uploads. Presigned upload URLs target this bucket.                            |
| `AWS_IMAGE_BUCKET`            | ✅       | S3 bucket name for album artwork and artist images.                                                        |
| `AWS_AUDIO_PROCESSED_BUCKET`  | ✅       | S3 bucket where the Go worker writes HLS segments after transcoding.                                       |
| `WEBHOOK_SECRET`              | ✅       | Shared HMAC-SHA256 secret. Lambda signs its requests; the backend verifies the `X-Sonic-Signature` header. |
| `AWS_CLOUDFRONT_IMAGE_DOMAIN` | No       | CloudFront distribution domain for image delivery. Required when `USE_CLOUDFRONT=true`.                    |
| `AWS_CLOUDFRONT_AUDIO_DOMAIN` | No       | CloudFront distribution domain for audio delivery. Required when `USE_CLOUDFRONT=true`.                    |
| `USE_CLOUDFRONT`              | No       | When `true`, public media URLs use CloudFront domains instead of direct S3 URLs.                           |
| `MEILISEARCH_HOST`            | ✅       | Full URL of the Meilisearch instance.                                                                      |
| `MEILISEARCH_MASTER_KEY`      | ✅       | Meilisearch master API key. Must match the key used to start Meilisearch.                                  |

---

## Running the Server

```bash
# Development (hot-reload with ts-node)
pnpm dev

# Development (explicit start with watch)
pnpm start:dev

# Debug mode (with Node.js inspector)
pnpm start:debug

# Production (requires a prior build)
pnpm build && pnpm start:prod
```

The server listens on `0.0.0.0:<PORT>` (default `5000`).

---

## Database Management

Drizzle Kit is used for schema migrations.

```bash
# Generate migration SQL from schema changes
pnpm drizzle-generate

# Apply pending migrations to the connected database
pnpm drizzle-migrate

# Push schema directly to the DB without migrations (dev only — destructive)
pnpm drizzle-push

# Open Drizzle Studio (visual DB browser on http://local.drizzle.studio)
pnpm drizzle-studio
```

Migration files are stored in `drizzle/`. Always commit generated migration files.

---

## API Structure

All routes are prefixed under `/api/`:

| Prefix             | Module         | Notes                                                                       |
| ------------------ | -------------- | --------------------------------------------------------------------------- |
| `/api/auth/**`     | AuthModule     | Handled entirely by Better Auth — body parsing is bypassed for these routes |
| `/api/content/**`  | ContentModule  | CRUD for albums, artists, tracks, genres, recordings                        |
| `/api/admin/**`    | AdminModule    | Admin-only operations                                                       |
| `/api/search/**`   | SearchModule   | Full-text search queries                                                    |
| `/api/webhooks/**` | WebhooksModule | Signed webhook receiver for AWS Lambda callbacks                            |

### Response Format

All responses (except Better Auth routes) are wrapped by the `TransformInterceptor`:

```json
{
  "data": { ... },
  "statusCode": 200
}
```

Errors are standardised by the `GlobalExceptionFilter`:

```json
{
  "statusCode": 404,
  "message": "Track not found",
  "error": "Not Found"
}
```

### Pagination Headers

List endpoints expose pagination metadata via HTTP headers:

| Header          | Description                  |
| --------------- | ---------------------------- |
| `x-total-count` | Total number of items        |
| `x-next-cursor` | Cursor for the next page     |
| `x-prev-cursor` | Cursor for the previous page |

---

## Testing

```bash
# Run all unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:cov

# End-to-end tests
pnpm test:e2e

# Debug tests
pnpm test:debug
```

Tests are co-located with their modules as `*.spec.ts` files. E2E test configuration is in `test/jest-e2e.json`.

---

## Deployment

### Production Build

```bash
pnpm build
node dist/main
```

### Docker / Container

The app can be containerised. Ensure all environment variables are provided via your container orchestration tool (e.g., ECS task definitions, Kubernetes secrets).

### Required Infrastructure

Before deploying:

1. **PostgreSQL 15** — a managed service like AWS RDS or a self-hosted instance.
2. **Meilisearch** — a self-hosted instance or a [Meilisearch Cloud](https://cloud.meilisearch.com) deployment.
3. **AWS S3 Buckets** — three buckets: upload audio, processed audio, and content images.
4. **AWS CloudFront** — two distributions (optional but strongly recommended for production).
5. **Audio Processing Pipeline** — Terraform-provisioned AWS infrastructure (see `audio-processing-pipeline/aws/`).

### Health Check

The server logs `Server is running on port <PORT>` on startup. Use this as a readiness signal in your infrastructure.
