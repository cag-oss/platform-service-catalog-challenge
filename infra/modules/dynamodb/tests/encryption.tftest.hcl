provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
}

run "dynamodb_security_defaults" {
  command = plan

  variables {
    name_prefix = "test-platform-catalog"
    tags = {
      Test = "true"
    }
  }

  assert {
    condition     = aws_dynamodb_table.services.server_side_encryption[0].enabled == true
    error_message = "DynamoDB server-side encryption must be enabled."
  }

  assert {
    condition     = aws_dynamodb_table.services.point_in_time_recovery[0].enabled == true
    error_message = "DynamoDB point-in-time recovery must be enabled."
  }
}
