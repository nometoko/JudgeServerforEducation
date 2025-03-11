terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

module "iam" {
  source = "./iam"
  project_id = var.project_id
  service_account_name = var.service_account_name
}

module "networking" {
  source = "./networking"
  region = var.region
}

module "cloudrun" {
  source                = "./cloudrun"
  backend_image         = var.backend_image
  frontend_image        = var.frontend_image
  project_id            = var.project_id
  region                = var.region
  db_instance_name      = var.db_instance_name
  db_name               = var.db_name
  db_user               = var.db_user
  db_password           = var.db_password
  service_account_email = module.iam.app_sa_email
  db_connection_name    = module.cloudsql.db_connection_name
  vpc_connector_name    = module.networking.vpc_connector_name
}

module "cloudsql" {
  source             = "./cloudsql"
  region             = var.region
  project_id         = var.project_id
  vpc_self_link      = module.networking.vpc_self_link
  db_instance_name   = var.db_instance_name
  db_tier            = var.db_tier
  db_name            = var.db_name
  db_user            = var.db_user
  db_password        = var.db_password
}

output "backend_url" {
  value = module.cloudrun.backend_url
}

output "vpc_connector_name" {
  value = module.networking.vpc_connector_name
}

# output "frontend_url" {
#   value = module.cloudrun.frontend_url
# }

