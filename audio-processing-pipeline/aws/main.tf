provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
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
  visibility_timeout_seconds = 900
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
  depends_on = [aws_s3_bucket.upload-bucket, aws_sqs_queue.audio-processing-queue]
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

# Attach basic execution role for SQS consumed Lambdas
resource "aws_iam_role_policy_attachment" "audio_processing_lambda_sqs_policy" {
  role       = aws_iam_role.audio-processing-lambda-execution-role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}

# Add policy specifically for submitting jobs to AWS Batch from Lambda
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
  function_name    = "audio_processing_lambda_trigger"
  role             = aws_iam_role.audio-processing-lambda-execution-role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  filename         = data.archive_file.audio-processing-lambda-archive.output_path
  source_code_hash = data.archive_file.audio-processing-lambda-archive.output_base64sha256

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
  depends_on       = [aws_iam_role_policy_attachment.audio_processing_lambda_sqs_policy]
}

# Phase 3: AWS Batch setup (Job Queue, Compute Environment, and Job Definition in Real AWS)

resource "aws_iam_role" "audio_processing_batch_service_role" {
  name = "audio_processing_batch_service_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
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

# Note: In real AWS, fetching existing public subnets is cleaner if they exist.
# Otherwise, we create a new VPC purely for FARGATE Batch.
resource "aws_vpc" "audio_processing_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
}

resource "aws_subnet" "audio_processing_subnet" {
  vpc_id     = aws_vpc.audio_processing_vpc.id
  cidr_block = "10.0.1.0/24"
  # In actual AWS, ECS Fargate needs to pull layers from public ECR internet,
  # or you have to build NAT Gateways! For simplicity of this module we map public IPs automatically
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "audio_igw" {
  vpc_id = aws_vpc.audio_processing_vpc.id
}

resource "aws_route_table" "audio_rt" {
  vpc_id = aws_vpc.audio_processing_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.audio_igw.id
  }
}

resource "aws_route_table_association" "audio_rt_assoc" {
  subnet_id      = aws_subnet.audio_processing_subnet.id
  route_table_id = aws_route_table.audio_rt.id
}

resource "aws_security_group" "audio_processing_sg" {
  name   = "audio_processing_compute_sg"
  vpc_id = aws_vpc.audio_processing_vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_batch_compute_environment" "audio_compute_env" {
  name = "audio-processing-compute-env" # Use compute_environment_name explicitly!

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
  state    = "ENABLED"
  priority = 1
  compute_environment_order {
    order               = 1
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

# The go container needs explicitly S3 read/write bindings!
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
  name                  = var.batch_job_definition_name
  type                  = "container"
  platform_capabilities = ["FARGATE"]

  container_properties = jsonencode({
    image = var.processor_docker_image

    environment = [
      {
        name  = "AWS_REGION"
        value = var.aws_region
      }
    ]

    executionRoleArn = aws_iam_role.ecs_task_execution_role.arn
    jobRoleArn       = aws_iam_role.ecs_task_execution_role.arn

    # Must assign public ip to the runtime so it can pull docker images
    networkConfiguration = {
      assignPublicIp = "ENABLED"
    }

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
  })
}