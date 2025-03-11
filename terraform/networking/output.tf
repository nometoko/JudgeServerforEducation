output "vpc_self_link" {
  description = "VPC Self Link"
  value = google_compute_network.vpc.self_link
}

output "vpc_connector_name" {
  description = "VPC Connector ID"
  value = google_vpc_access_connector.vpc_connector.name
}
