output "api_endpoint" {
  description = "Base URL for the platform catalog API."
  value       = module.platform_api.api_endpoint
}

output "services_table_name" {
  description = "DynamoDB table used by the platform catalog API."
  value       = module.dynamodb.table_name
}

output "dashboard_name" {
  description = "CloudWatch dashboard for operational visibility."
  value       = module.monitoring.dashboard_name
}
