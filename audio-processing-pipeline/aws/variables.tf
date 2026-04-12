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


