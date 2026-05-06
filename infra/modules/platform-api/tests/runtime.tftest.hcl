provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
}

run "lambda_runtime_and_logs" {
  command = plan

  variables {
    name_prefix         = "test-platform-catalog"
    lambda_zip_path     = "../../../app/function.zip"
    services_table_name = "test-platform-catalog-services"
    services_table_arn  = "arn:aws:dynamodb:us-east-1:123456789012:table/test-platform-catalog-services"
    tags = {
      Test = "true"
    }
  }

  assert {
    condition     = aws_lambda_function.api.runtime == "nodejs22.x"
    error_message = "Lambda must use the expected Node.js runtime."
  }

  assert {
    condition     = aws_cloudwatch_log_group.api.retention_in_days > 0
    error_message = "Lambda log retention must be explicitly configured."
  }
}
