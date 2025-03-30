output "app_sa_email" {
  description = "The email of the service account"
  value       = google_service_account.app_sa.email
}

