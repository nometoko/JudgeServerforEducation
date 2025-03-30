variable "region" {
  description = "GCP Region"
  type        = string
}

variable "project_id" {
    description = "Project ID"
    type        = string
}

variable "vpc_self_link" {
  description = "VPC Self Link"
  type        = string
}

variable "db_instance_name" {
  description = "Cloud SQL Instance Name"
  type        = string
}

variable "db_tier" {
  description = "Cloud SQL Instance Tier"
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
  sensitive = true
}
