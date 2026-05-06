variable "name_prefix" {
  description = "Prefix used for named resources."
  type        = string
}

variable "tags" {
  description = "Tags applied to all supported resources."
  type        = map(string)
  default     = {}
}
