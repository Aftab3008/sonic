variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}
variable "aws_access_key" {
  description = "AWS Access Key"
  type        = string
  sensitive   = true
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
  type        = string
  sensitive   = true
}

variable "upload_bucket_name" {
  description = "Upload file bucket name"
  type        = string
  default     = "production-audio-upload-bucket"
}

variable "processed_bucket_name" {
  description = "Processed file bucket name"
  type        = string
  default     = "production-audio-processed-bucket" # Use a globally unique name
}

variable "content_images_bucket_name" {
  description = "Content images bucket name"
  type        = string
  default     = "production-content-images-bucket"
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

# Provide the ARN of your built container image located in Amazon ECR instead of Docker Hub if you use AWS.
variable "processor_docker_image" {
  description = "Audio processing Docker image URL"
  type        = string
  default     = "public.ecr.aws/amazonlinux/amazonlinux:latest"
}
variable "audio_processing_dlq_name" {
  description = "Audio processing SQS Dead Letter Queue name"
  type        = string
  default     = "audio-processing-dlq"
}

variable "audio_processing_max_receive_count" {
  description = "The maximum number of times a message can be received before being moved to the DLQ"
  type        = number
  default     = 3
}

variable "webhook_secret" {
  description = "Shared secret for HMAC signing of webhooks"
  type        = string
  sensitive   = true
}

variable "backend_url" {
  description = "Base URL of the backend API for status notifications"
  type        = string
}

variable "frontend_url" {
  description = "Base URL of the frontend for CORS"
  type        = string
}

variable "enable_cloudfront" {
  description = "Enable CloudFront CDN for S3 buckets"
  type        = bool
  default     = true
}

variable "cors_allowed_origins" {
  description = "A list of origins that are allowed to make cross-site requests"
  type        = list(string)
}
