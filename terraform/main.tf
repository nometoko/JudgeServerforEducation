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
  source               = "./iam"
  project_id           = var.project_id
  service_account_name = var.service_account_name
}

module "networking" {
  source = "./networking"
  region = var.region
}

module "cloudstorage" {
  source        = "./cloudstorage"
  region        = var.region
  bucket_name   = var.bucket_name
  storage_class = var.storage_class
}

module "cloudsql" {
  source           = "./cloudsql"
  region           = var.region
  project_id       = var.project_id
  vpc_self_link    = module.networking.vpc_self_link
  db_instance_name = var.db_instance_name
  db_tier          = var.db_tier
  db_name          = var.db_name
  db_user          = var.db_user
  db_password      = var.db_password
}

module "cloudrun" {
  source                = "./cloudrun"
  backend_image         = var.backend_image
  project_id            = var.project_id
  region                = var.region
  digest                = var.backend_digest
  db_instance_name      = var.db_instance_name
  db_name               = var.db_name
  db_user               = var.db_user
  db_password           = var.db_password
  service_account_email = module.iam.app_sa_email
  db_connection_name    = module.cloudsql.db_connection_name
  vpc_connector_name    = module.networking.vpc_connector_name
  volume_name           = var.volume_name
  storage_mount_path    = var.storage_mount_path
  bucket_name           = module.cloudstorage.bucket_name
}

output "backend_url" {
  value = module.cloudrun.backend_url
}

output "vpc_connector_name" {
  value = module.networking.vpc_connector_name
}

