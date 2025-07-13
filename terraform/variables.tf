variable "aws_region" {
  description = "AWS region for resources (S3 bucket in this region)"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (used in naming)"
  type        = string
  default     = "dev"
}

variable "frontend_bucket_name" {
  description = "Name of the S3 bucket to host the frontend"
  type        = string
}

variable "domain_name" {
  description = "(Optional) Custom domain for CloudFront, e.g. www.example.com"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "If using HTTPS with a custom domain, the ACM cert ARN in us-east-1"
  type        = string
  default     = ""
}
