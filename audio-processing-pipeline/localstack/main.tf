variable "aws_access_key" {
  description = "AWS Access Key"
  type        = string
  default     = "test"
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
  type        = string
  default     = "test"
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "aws_endpoint" {
  description = "LocalStack endpoint"
  type        = string
  default     = "http://localhost:4566"
}

variable "upload_bucket_name" {
  description = "Upload file bucket name"
  type        = string
  default     = "upload-bucket"
}

variable "processed_bucket_name" {
  description = "Processed file bucket name"
  type        = string
  default     = "processed-bucket"
}

variable "audio_processing_queue_name" {
  description = "Audio processing SQS queue name"
  type        = string
  default     = "audio-processing-queue"
}

variable "batch_job_queue_name" {
  description = "Audio processing AWS Batch Job Queue name"
  type        = string
  default     = "audio-processing-job-queue"
}

variable "batch_job_definition_name" {
  description = "Audio processing AWS Batch Job Definition name"
  type        = string
  default     = "audio-processing-job-definition"
}

provider "aws" {
  access_key                  = var.aws_access_key
  secret_key                  = var.aws_secret_key
  region                      = var.aws_region
  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    ec2    = var.aws_endpoint
    lambda = var.aws_endpoint
    s3     = var.aws_endpoint
    sns    = var.aws_endpoint
    sqs    = var.aws_endpoint
    iam    = var.aws_endpoint
    batch  = var.aws_endpoint
  }
}

# Phase 1: Create S3 buckets and SQS queue with necessary permissions and notifications
resource "aws_s3_bucket" "upload-bucket" {
  bucket = var.upload_bucket_name
}

resource "aws_s3_bucket" "processed-bucket" {
  bucket = var.processed_bucket_name
}

resource "aws_sqs_queue" "audio-processing-queue" {
  name                       = var.audio_processing_queue_name
  visibility_timeout_seconds = 1800
}

resource "aws_sqs_queue_policy" "upload-s3-sqs-policy" {
  queue_url = aws_sqs_queue.audio-processing-queue.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.audio-processing-queue.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_s3_bucket.upload-bucket.arn
          }
        }
      }
    ]
  })
}

resource "aws_s3_bucket_notification" "upload-bucket-notification" {
  bucket = aws_s3_bucket.upload-bucket.id

  queue {
    queue_arn     = aws_sqs_queue.audio-processing-queue.arn
    events        = ["s3:ObjectCreated:*"]
    filter_suffix = ".wav"
  }

  queue {
    queue_arn     = aws_sqs_queue.audio-processing-queue.arn
    events        = ["s3:ObjectCreated:*"]
    filter_suffix = ".mp3"
  }

  queue {
    queue_arn     = aws_sqs_queue.audio-processing-queue.arn
    events        = ["s3:ObjectCreated:*"]
    filter_suffix = ".flac"
  }

  depends_on = [aws_sqs_queue_policy.upload-s3-sqs-policy]
}

# Phase 2: Create IAM role and policy for Lambda function
resource "aws_iam_role" "audio-processing-lambda-execution-role" {
  name = "audio-processing-lambda-execution-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "audio_processing_lambda_sqs_policy" {
  role       = aws_iam_role.audio-processing-lambda-execution-role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"      
}

resource "aws_iam_role_policy" "audio_processing_lambda_batch_policy" {
  name = "audio_processing_lambda_batch_policy"
  role = aws_iam_role.audio-processing-lambda-execution-role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "batch:SubmitJob"
        ]
        Resource = "*"
      }
    ]
  })
}

data "archive_file" "audio-processing-lambda-archive" {
  type        = "zip"
  source_dir  = "${path.module}/../audio_processing_lambda"
  output_path = "${path.module}/audio_processing_lambda.zip"
}

resource "aws_lambda_function" "audio-processing-lambda" {
  function_name = "audio_processing_lambda_trigger"
  role          = aws_iam_role.audio-processing-lambda-execution-role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  filename      = data.archive_file.audio-processing-lambda-archive.filename
  source_code_hash = data.archive_file.audio-processing-lambda-archive.source_code_hash

  environment {
    variables = {
      UPLOAD_BUCKET_NAME    = var.upload_bucket_name
      PROCESSED_BUCKET_NAME = var.processed_bucket_name
      BATCH_JOB_QUEUE       = aws_batch_job_queue.audio_processing_job_queue.name
      BATCH_JOB_DEFINITION  = aws_batch_job_definition.audio_processing_job_def.name
    }
  }
}

resource "aws_lambda_event_source_mapping" "sqs_event_source_mapping_to_lambda" {
  event_source_arn = aws_sqs_queue.audio-processing-queue.arn
  function_name    = aws_lambda_function.audio-processing-lambda.arn
  batch_size       = 1
}

# Phase 3: AWS Batch setup (Job Queue, Compute Environment, and Job Definition)

resource "aws_iam_role" "audio_processing_batch_service_role" {
  name = "audio_processing_batch_service_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          type = "Service"
          Service = "batch.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "audio_processing_batch_service_role_attachment" {
  role       = aws_iam_role.audio_processing_batch_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBatchServiceRole"
}

# Basic VPC setup for the Compute Environment in localstack (AWS Batch requires subnets/SGs)
resource "aws_vpc" "audio_processing_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
}

resource "aws_subnet" "audio_processing_subnet" {
  vpc_id     = aws_vpc.audio_processing_vpc.id
  cidr_block = "10.0.1.0/24"
}

resource "aws_security_group" "audio_processing_sg" {
  name   = "audio_processing_compute_sg"
  vpc_id = aws_vpc.audio_processing_vpc.id
}

resource "aws_batch_compute_environment" "audio_compute_env" {
  name = "audio-processing-compute-env"

  compute_resources {
    max_vcpus          = 16
    security_group_ids = [aws_security_group.audio_processing_sg.id]
    subnets            = [aws_subnet.audio_processing_subnet.id]
    type               = "FARGATE_SPOT"
  }

  service_role = aws_iam_role.audio_processing_batch_service_role.arn
  type         = "MANAGED"
  depends_on   = [aws_iam_role_policy_attachment.audio_processing_batch_service_role_attachment]
}

resource "aws_batch_job_queue" "audio_processing_job_queue" {
  name     = var.batch_job_queue_name
  arn      = aws_batch_job_queue.audio_processing_job_queue.arn
  state    = "ENABLED"
  priority = 1
  compute_environment_order {
    order = 1
    compute_environment = aws_batch_compute_environment.audio_compute_env.arn
  }
}


resource "aws_iam_role" "ecs_task_execution_role" {
  name = "audio_batch_task_execution_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "batch_job_s3_policy" {
  name = "batch_job_s3_policy"
  role = aws_iam_role.ecs_task_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject"
        ]
        Resource = "${aws_s3_bucket.upload-bucket.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject"
        ]
        Resource = "${aws_s3_bucket.processed-bucket.arn}/*"
      }
    ]
  })
}

resource "aws_batch_job_definition" "audio_processing_job_def" {
  name = var.batch_job_definition_name
  type = "container"
  platform_capabilities = ["FARGATE"]

  container_properties = jsonencode({
    image   = "public.ecr.aws/amazonlinux/amazonlinux:latest" # Change to your actual processing docker image
    command = ["./audio_processor"]
    
    executionRoleArn = aws_iam_role.ecs_task_execution_role.arn
    jobRoleArn       = aws_iam_role.ecs_task_execution_role.arn

    resourceRequirements = [
      {
        type  = "VCPU"
        value = "1.0"
      },
      {
        type  = "MEMORY"
        value = "2048"
      }
    ]
    environment = [
      {
        name  = "UPLOAD_BUCKET_NAME"
        value = var.upload_bucket_name
      },
      {
        name  = "PROCESSED_BUCKET_NAME"
        value = var.processed_bucket_name
      }
    ]
  })
}
