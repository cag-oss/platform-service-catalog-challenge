resource "aws_dynamodb_table" "services" {
  name         = "${var.name_prefix}-services"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "serviceId"

  attribute {
    name = "serviceId"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
  }

  tags = var.tags
}
