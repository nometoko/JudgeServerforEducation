variable "project_id" {
  description = "Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
}

variable "backend_image" {
  description = "Backend Image URL"
  type        = string
}

variable "backend_digest" {
  description = "backend docker image digest"
  type        = string
}

variable "service_account_name" {
  description = "Service Account Name"
  type        = string
}

variable "db_instance_name" {
  description = "Cloud SQL Instance Name"
  type        = string
}

variable "db_tier" {
  description = "Cloud SQL Instance Tier"
  type        = string
  default     = "db-f1-micro"
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
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "bucket_name" {
  description = "Cloud Storage Bucket Name"
  type        = string
}

variable "storage_mount_path" {
  description = "Mount Path"
  type        = string
}

variable "storage_class" {
  description = "Storage Class"
  type        = string
  default     = "STANDARD"
}

variable "volume_name" {
  description = "Volume Name"
  type        = string
}
