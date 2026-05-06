terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

module "dynamodb" {
  source      = "../../modules/dynamodb"
  name_prefix = local.name_prefix
  tags        = local.tags
}

module "platform_api" {
  source              = "../../modules/platform-api"
  name_prefix         = local.name_prefix
  lambda_zip_path     = "../../../app/function.zip"
  services_table_name = module.dynamodb.table_name
  services_table_arn  = module.dynamodb.table_arn
  tags                = local.tags
}

module "monitoring" {
  source               = "../../modules/monitoring"
  name_prefix          = local.name_prefix
  lambda_function_name = module.platform_api.lambda_function_name
  alarm_email          = var.alarm_email
  tags                 = local.tags
}
