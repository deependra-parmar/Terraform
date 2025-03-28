locals {
  website_files = [
    "index.html",
    "index.css",
    "index.js",
    "beep.wav",
    "success.mp3"
  ]
}

# Bucket to store website
resource "google_storage_bucket" "website" {
  name = "example-website-bucket-by-dp"
  location = "US"
}

# Making the bucket publicly accessible
resource "google_storage_object_access_control" "public_rule" {
  bucket = google_storage_bucket.website.name
  for_each = google_storage_bucket_object.website_files
  object = each.value.name
  role = "READER"
  entity = "allUsers"
}

# Uploading the static files in the bucket
resource "google_storage_bucket_object" "website_files" {
  for_each = toset(local.website_files)
  name = each.value
  source = "../website/${each.value}"
  bucket = google_storage_bucket.website.name
}

# Reserve an external IP Address
resource "google_compute_global_address" "website_ip" {
  name = "website-lb-ip"
}

# Getting the managed DNS Zone
data "google_dns_managed_zone" "dns_zone" {
  name = "terraform-gcp"
}

# Adding the IP to the DNS
resource "google_dns_record_set" "game" {
  name = "${data.google_dns_managed_zone.dns_zone.dns_name}"
  type = "A"
  ttl = 300
  managed_zone = data.google_dns_managed_zone.dns_zone.name
  rrdatas = [google_compute_global_address.website_ip.address]
}

# Add a bucket as a CDN's source
resource "google_compute_backend_bucket" "website-backend" {
  name = "website-bucket"
  bucket_name = google_storage_bucket.website.name
  description = "Contains file need for the website"
  enable_cdn = true
}

# GCP URL Map
resource "google_compute_url_map" "website-map" {
  name = "website-url-map"
  default_service = google_compute_backend_bucket.website-backend.self_link
  host_rule {
    hosts = ["*"]
    path_matcher = "allpaths"
  }
  path_matcher {
    name = "allpaths"
    default_service = google_compute_backend_bucket.website-backend.self_link
  }
}

# GCP HTTP ELB
resource "google_compute_target_http_proxy" "website-proxy" {
  name = "website-target-proxy"
  url_map = google_compute_url_map.website-map.self_link
}

# GCP Forwarding rule
resource "google_compute_global_forwarding_rule" "default" {
  name = "website-forwarding-rule"
  load_balancing_scheme = "EXTERNAL"
  ip_address = google_compute_global_address.website_ip.address
  ip_protocol = "TCP"
  port_range = "80"
  target = google_compute_target_http_proxy.website-proxy.self_link
}