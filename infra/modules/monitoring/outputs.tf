output "alarm_topic_arn" {
  description = "SNS topic ARN used for CloudWatch alarms."
  value       = aws_sns_topic.alarms.arn
}

output "dashboard_name" {
  description = "CloudWatch dashboard name."
  value       = aws_cloudwatch_dashboard.platform.dashboard_name
}
