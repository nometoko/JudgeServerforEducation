resource "google_cloud_run_v2_service" "backend" {
  name     = "backend-service"
  location = var.region

  template {
    service_account = var.service_account_email

    containers {
      image = "asia.gcr.io/${var.project_id}/${var.backend_image}@${var.digest}"
      env {
        name = "DATABASE_URL"
        # value = "postgresql+psycopg2://${var.db_user}:${var.db_password}@/${var.db_name}?host=/cloudsql/${var.project_id}:${var.region}:${var.db_instance_name}"
        value = "postgresql+psycopg2://${var.db_user}:${var.db_password}@10.233.0.3:5432/${var.db_name}"
      }
      env {
        name  = "EXEC_DIR"
        value = "/app/compile_resource"
      }
      env {
        name  = "MAKEFILE_NAME"
        value = "Makefile"
      }
      env {
        name  = "MAKEFILE_PROG_DEFAULT"
        value = "final"
      }
      env {
        name  = "STATIC_DIR"
        value = "/app/static"
      }
      env {
        name  = "PEPPER"
        value = "YKFy/DD+MSjehfP9zcrguXpAm1kDadSx+Q93bnEgcSOhoQAsTpXWR3wGXN8wnwH/9tf/KMsSPqrnaYLzJXGNeZ9mTQejbMkvI9PI7WDzGRdwwtX2gUQY69I45s3/IWdpREAGIWiNMrxyzxq1zT2UdZqrKKpWcU6+wNV7W86xjZtf5/fBNmylPZ6d9fdptxFSugBAaUcQeja6FDfbcYHbEXhqdS+giKCxSFNDFj5VShA3DUOhkmQW3pXN3aHC1qn0FttV1gMNgXHn/vhshl8h3WvmtMcPQRq58cD2oyBbCjM7Taoklg9fy4sxkLNJSWnLgwdn1ThlCL7RC2Ka0ZXoVg=="
      }
      env {
        name  = "SECRET_KEY"
        value = "PWcf8owcIjsFgTCboPZGWzk3+aIkYnIkcg5jk68Vg+M="
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
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}
