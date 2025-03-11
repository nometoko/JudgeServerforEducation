resource "google_cloud_run_v2_service" "backend" {
  name     = "backend-service"
  location = var.region

  template {
    service_account = var.service_account_email

    containers {
      image = var.backend_image
      env {
        name  = "DATABASE_URL"
        value = "postgresql://${var.db_user}:${var.db_password}@/${var.db_name}?host=/cloudsql/${var.project_id}:${var.region}:${var.db_instance_name}"
      }
    }

    vpc_access {
      connector = "projects/${var.project_id}/locations/${var.region}/connectors/${var.vpc_connector_name}"
      egress    = "PRIVATE_RANGES_ONLY"
    }
  }

  timeouts {
    create = "60m"
  }

  traffic {
    percent         = 100
    type = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

# resource "google_cloud_run_v2_service" "frontend" {
#   name     = "frontend-service"
#   location = var.region

#   template {
#     service_account = var.service_account_email

#     containers {
#       image = var.frontend_image
#     }
#   }
# }
