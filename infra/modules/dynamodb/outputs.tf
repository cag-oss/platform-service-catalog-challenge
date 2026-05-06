output "table_name" {
  description = "Name of the service catalog DynamoDB table."
  value       = aws_dynamodb_table.services.name
}

output "table_arn" {
  description = "ARN of the service catalog DynamoDB table."
  value       = aws_dynamodb_table.services.arn
}
