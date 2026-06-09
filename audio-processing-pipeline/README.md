# Sonic — Audio Processing Pipeline

[![AWS](https://img.shields.io/badge/AWS-Batch%20%7C%20Lambda%20%7C%20S3%20%7C%20SQS-FF9900?style=flat-square&logo=amazonaws&logoColor=white)](https://aws.amazon.com)
[![Terraform](https://img.shields.io/badge/Terraform-1.5%2B-7B42BC?style=flat-square&logo=terraform&logoColor=white)](https://www.terraform.io)
[![Go](https://img.shields.io/badge/Go-1.21%2B-00ADD8?style=flat-square&logo=go&logoColor=white)](https://go.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Lambda-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)

The **Sonic Audio Processing Pipeline** is a fully serverless, event-driven audio transcoding system built on AWS. Raw audio files uploaded by administrators are automatically transcoded to **HLS (HTTP Live Streaming)** format using `ffmpeg`, then stored in S3 and delivered to clients via CloudFront CDN.

---

## Table of Contents

- [Architecture](#architecture)
- [Components](#components)
- [Event Flow](#event-flow)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Terraform Infrastructure](#terraform-infrastructure)
- [Local Development with LocalStack](#local-development-with-localstack)
- [Deployment](#deployment)

---

## Architecture

```
Admin (via backend API)
        │
        │ Upload raw audio file
        ▼
┌───────────────────┐
│  S3 Upload Bucket  │  (upload-audio-bucket)
└─────────┬─────────┘
          │ S3:ObjectCreated event
          ▼
┌───────────────────┐
│    SQS Queue      │  (audio-processing-queue)
│  + Dead Letter Q  │  (audio-processing-dlq, max 3 retries)
└─────────┬─────────┘
          │ triggers
          ▼
┌─────────────────────────────────────────┐
│  Lambda: audio_processing_lambda        │
│  (Node.js)                              │
│  - Parse S3 event from SQS record       │
│  - Submit AWS Batch job                 │
│  - Notify backend via HMAC webhook      │
└─────────┬───────────────────────────────┘
          │ SubmitJob
          ▼
┌─────────────────────────────────────────┐
│  AWS Batch                              │
│  Job Queue → Compute Environment        │
│  (Fargate or EC2)                       │
└─────────┬───────────────────────────────┘
          │ runs Docker container
          ▼
┌─────────────────────────────────────────┐
│  Go Worker (audio_processing_go)        │
│  - Download raw file from S3            │
│  - Run ffmpeg → HLS segments            │
│  - Upload .m3u8 + segments to S3        │
└─────────┬───────────────────────────────┘
          │ upload artifacts
          ▼
┌───────────────────────────┐
│  S3 Processed Bucket      │  (processed-audio-bucket)
│  recordings/{id}/         │
│    ├── index.m3u8          │  ← HLS master playlist
│    ├── index0.ts           │  ← Segment files
│    └── ...                 │
└─────────┬─────────────────┘
          │
          ▼
┌───────────────────────────┐
│  CloudFront CDN           │  Delivers HLS to clients
└───────────────────────────┘

Status Updates (parallel flow):
┌─────────────────────────────────────────┐
│  Lambda: status_tracker_lambda          │
│  (Node.js)                              │
│  - Listens to AWS Batch state changes   │
│  - Posts status webhook to backend      │
│    (PENDING → RUNNING → SUCCEEDED/FAILED)│
└─────────────────────────────────────────┘
```

---

## Components

### `audio_processing_lambda/` — Trigger Lambda (Node.js)

**Runtime:** Node.js 20.x  
**Trigger:** SQS queue (sourced from S3 ObjectCreated events)

**Responsibilities:**
- Reads SQS messages, parses the embedded S3 event
- Extracts the `recordingId` from the S3 object key (`recordings/{recordingId}.ext`)
- Submits an **AWS Batch job** with the input/output bucket and key as container environment overrides
- Sends an HMAC-signed webhook to the backend to register the new job ID

**Key environment variables:**

| Variable | Description |
|----------|-------------|
| `BATCH_JOB_QUEUE` | ARN of the AWS Batch job queue |
| `BATCH_JOB_DEFINITION` | ARN of the AWS Batch job definition |
| `PROCESSED_BUCKET_NAME` | Name of the S3 output bucket |
| `WEBHOOK_SECRET` | HMAC-SHA256 secret for signing webhook payloads |
| `BACKEND_URL` | Base URL of the NestJS backend |
| `AWS_REGION` | AWS region |
| `AWS_ENDPOINT_URL` | (Optional) LocalStack endpoint for local testing |

---

### `audio_processing_go/` — HLS Transcoding Worker (Go)

**Runtime:** Docker (Go binary)  
**Execution:** AWS Batch managed compute environment

**Responsibilities:**
- Downloads the raw audio file from S3 (`INPUT_BUCKET` / `INPUT_KEY`)
- Runs `ffmpeg` to transcode to HLS format (`.m3u8` manifest + `.ts` segments)
- Uploads all output artifacts to the processed S3 bucket (`OUTPUT_BUCKET`) under the same key prefix

**Required environment variables (set by Lambda via Batch container overrides):**

| Variable | Description |
|----------|-------------|
| `INPUT_BUCKET` | S3 bucket containing the raw audio file |
| `INPUT_KEY` | S3 object key of the raw audio file |
| `OUTPUT_BUCKET` | S3 bucket to write HLS output |
| `AWS_REGION` | AWS region |
| `AWS_ENDPOINT_URL` | (Optional) LocalStack endpoint |

The container uses the **AWS Task Role** (not access keys) when running in AWS Batch — credentials are automatically injected by the ECS runtime.

---

### `status_tracker_lambda/` — Status Webhook Lambda (Node.js)

**Runtime:** Node.js 20.x  
**Trigger:** AWS Batch job state change events (via EventBridge or CloudWatch Events)

**Responsibilities:**
- Receives AWS Batch job status change notifications
- Maps Batch states (`SUBMITTED`, `PENDING`, `RUNNABLE`, `STARTING`, `RUNNING`, `SUCCEEDED`, `FAILED`) to backend recording states
- Sends signed status update webhooks to the backend

---

### `aws/` — Terraform Infrastructure

All AWS resources are defined as Terraform configuration in `aws/main.tf`.

**Provisioned resources:**

| Resource | Description |
|----------|-------------|
| S3 Buckets (×3) | Upload audio, processed audio, content images |
| S3 Event Notifications | ObjectCreated → SQS |
| SQS Queue | Audio processing queue with visibility timeout |
| SQS Dead Letter Queue | DLQ for failed messages (max 3 retries) |
| Lambda Functions (×2) | Audio processing trigger + status tracker |
| Lambda SQS Event Source | Connects SQS to the trigger Lambda |
| AWS Batch Compute Env | Fargate or EC2 managed compute |
| AWS Batch Job Queue | Ordered job queue |
| AWS Batch Job Definition | Container definition pointing to ECR image |
| ECR Repository | Private Docker registry for the Go worker image |
| IAM Roles & Policies | Lambda execution, Batch task, S3 access |
| CloudFront Distributions (×2) | CDN for images and audio (optional) |
| CloudFront OAC | Origin Access Control securing S3 access |

---

## Event Flow

### Upload → Processing

```
1.  Admin calls POST /api/content/upload (backend generates S3 presigned URL)
2.  Client uploads file directly to s3://upload-audio-bucket/recordings/{recordingId}.{ext}
3.  S3 emits ObjectCreated event → SQS queue
4.  Lambda (audio_processing_lambda) receives SQS event:
    a. Parses recordingId from S3 key
    b. Calls SubmitJobCommand on AWS Batch
    c. POSTs HMAC-signed webhook to backend /api/webhooks/aws/register-job
5.  Backend stores jobId against recordingId, sets status = PROCESSING
6.  AWS Batch runs the Go Docker container:
    a. Downloads raw file from S3
    b. Transcodes to HLS via ffmpeg
    c. Uploads index.m3u8 + *.ts segments to processed bucket
7.  Lambda (status_tracker_lambda) receives Batch SUCCEEDED event:
    a. POSTs signed status update to backend /api/webhooks/aws/job-status
8.  Backend sets recording status = COMPLETE, stores HLS manifest URL
9.  Mobile clients stream audio via CloudFront URL → HLS manifest
```

### HMAC Webhook Security

All webhook payloads from Lambda to the backend are signed using **HMAC-SHA256**:

```
X-Sonic-Signature: <sha256(secret, JSON_body)>
```

The backend verifies this signature using the `rawBody` captured during the webhook request. The `WEBHOOK_SECRET` must match between the Lambda environment and the backend `.env`.

---

## Prerequisites

| Tool | Version |
|------|---------|
| [Terraform](https://www.terraform.io) | ≥ 1.5 |
| [Go](https://go.dev) | ≥ 1.21 |
| [Docker](https://docker.com) / [Podman](https://podman.io) | Any |
| [AWS CLI](https://aws.amazon.com/cli/) | v2 |
| AWS account with permissions for S3, Lambda, SQS, Batch, ECR, CloudFront, IAM |

---

## Environment Variables

### `audio-processing-pipeline/.env`

Used by LocalStack setup scripts:

```env
LOCALSTACK_AUTH_TOKEN=<your-localstack-auth-token>
```

### Terraform (`aws/terraform.tfvars`)

Create `aws/terraform.tfvars` with your values:

```hcl
# AWS Credentials
aws_access_key = "AKIA..."
aws_secret_key = "<secret>"
aws_region     = "ap-south-2"

# S3 Bucket Names (must be globally unique)
upload_bucket_name         = "my-upload-audio-bucket"
processed_bucket_name      = "my-processed-audio-bucket"
content_images_bucket_name = "my-content-images-bucket"

# SQS / Batch Names
audio_processing_queue_name        = "audio-processing-queue"
audio_processing_dlq_name          = "audio-processing-dlq"
audio_processing_max_receive_count = 3
batch_job_queue_name               = "audio-processing-job-queue"
batch_job_definition_name          = "audio-processing-job-definition"

# ECR Image for the Go worker
processor_docker_image = "<account>.dkr.ecr.<region>.amazonaws.com/audio-processing-code"

# Security
webhook_secret = "<hex-secret>"  # Must match backend WEBHOOK_SECRET

# Endpoint URLs
backend_url  = "https://api.yourserver.com"
frontend_url = "https://admin.yourserver.com"

# CloudFront
enable_cloudfront = true

# CORS
cors_allowed_origins = [
  "https://admin.yourserver.com",
  "http://localhost:5173"
]
```

---

## Terraform Infrastructure

### Initialize and Apply

```bash
cd audio-processing-pipeline/aws

# Initialize providers and modules
terraform init

# Preview infrastructure changes
terraform plan -var-file="terraform.tfvars"

# Apply (creates all AWS resources)
terraform apply -var-file="terraform.tfvars"
```

### Outputs

After a successful `terraform apply`, Terraform outputs the CloudFront domain names. Copy these into the backend `.env`:

```env
AWS_CLOUDFRONT_IMAGE_DOMAIN=<terraform output>
AWS_CLOUDFRONT_AUDIO_DOMAIN=<terraform output>
```

### Destroy

```bash
# Tear down all provisioned infrastructure
terraform destroy -var-file="terraform.tfvars"
```

---

## Building & Deploying the Go Worker

### 1. Build the Docker image

```bash
cd audio-processing-pipeline/audio_processing_go
docker build -t audio-processing-code .
```

### 2. Push to ECR

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region <region> | \
  docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com

# Tag and push
docker tag audio-processing-code:latest <account>.dkr.ecr.<region>.amazonaws.com/audio-processing-code:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/audio-processing-code:latest
```

### 3. Update the Terraform variable

Set `processor_docker_image` in `terraform.tfvars` to the full ECR image URL and re-apply.

---

## Deploying the Lambda Functions

Pre-built Lambda ZIP files are included:

| File | Lambda |
|------|--------|
| `aws/audio_processing_lambda.zip` | Trigger Lambda |
| `aws/status_tracker_lambda.zip` | Status tracker Lambda |

To rebuild:

```bash
# Trigger Lambda
cd audio-processing-pipeline/audio_processing_lambda
npm install
zip -r ../aws/audio_processing_lambda.zip .

# Status Lambda
cd audio-processing-pipeline/status_tracker_lambda
npm install
zip -r ../aws/status_tracker_lambda.zip .
```

Then re-run `terraform apply` to deploy the updated packages.

---

## Local Development with LocalStack

[LocalStack](https://localstack.cloud) emulates AWS services locally for development and testing.

```bash
cd audio-processing-pipeline

# Set your LocalStack auth token in .env
echo "LOCALSTACK_AUTH_TOKEN=<your-token>" > .env

# Start LocalStack
podman-compose up -d   # or docker-compose up -d
```

When using LocalStack, set `AWS_ENDPOINT_URL=http://localhost:4566` in:
- Lambda environment variables
- Go worker environment variables

The Terraform configuration also supports a LocalStack endpoint — set `use_localstack = true` in your `terraform.tfvars` if your Terraform config exposes that variable.
