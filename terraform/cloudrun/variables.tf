variable "backend_image" {
  description = "Backend Container Image"
  type        = string
}

variable "frontend_image" {
  description = "Frontend Container Image"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
}

variable "project_id" {
  description = "Project ID"
  type        = string
}

variable "db_instance_name" {
  description = "Cloud SQL Instance Name"
  type        = string
}

variable "db_name" {
  description = "Database Name"
  type        = string
}

variable "db_user" {
  description = "DB User Name"
  type        = string
}

variable "db_password" {
  description = "Database Password"
  type        = string
  sensitive   = true
}

variable "service_account_email" {
  description = "IAM Service Account Email"
  type        = string
}

variable "db_connection_name" {
  description = "DB Connection Name"
  type        = string
}

variable "vpc_connector_name" {
  description = "VPC Connector Name"
  type        = string
}

