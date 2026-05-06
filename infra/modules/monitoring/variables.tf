variable "name_prefix" {
  description = "Prefix used for named resources."
  type        = string
}

variable "lambda_function_name" {
  description = "Lambda function to monitor."
  type        = string
}

variable "alarm_email" {
  description = "Optional email address for alarm notifications."
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags applied to all supported resources."
  type        = map(string)
  default     = {}
}
