variable "name_prefix" {
  description = "Prefix used for named resources."
  type        = string
}

variable "lambda_zip_path" {
  description = "Path to the Lambda deployment zip."
  type        = string
}

variable "services_table_name" {
  description = "DynamoDB table name used by the API."
  type        = string
}

variable "services_table_arn" {
  description = "DynamoDB table ARN used for least-privilege IAM."
  type        = string
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days."
  type        = number
  default     = 14
}

variable "tags" {
  description = "Tags applied to all supported resources."
  type        = map(string)
  default     = {}
}
