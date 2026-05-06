output "api_endpoint" {
  description = "Base URL for the HTTP API."
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "lambda_function_name" {
  description = "Name of the API Lambda function."
  value       = aws_lambda_function.api.function_name
}

output "lambda_function_arn" {
  description = "ARN of the API Lambda function."
  value       = aws_lambda_function.api.arn
}
