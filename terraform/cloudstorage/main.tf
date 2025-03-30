resource "google_storage_bucket" "my_bucket" {
  name          = var.bucket_name
  location      = var.region
  storage_class = var.storage_class
  uniform_bucket_level_access = true
}
