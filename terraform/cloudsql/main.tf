resource "google_sql_database_instance" "db" {
  name             = var.db_instance_name
  database_version = "POSTGRES_15"
  region          = var.region
  settings {
    tier = "db-f1-micro"

    ip_configuration {
      ipv4_enabled    = false
      private_network = var.vpc_self_link
    }
  }

  depends_on = [  ]
}

resource "google_sql_database" "database" {
  name     = var.db_name
  instance = google_sql_database_instance.db.name
}

resource "google_sql_user" "db_user" {
  name     = var.db_user
  instance = google_sql_database_instance.db.name
  password = var.db_password
}
