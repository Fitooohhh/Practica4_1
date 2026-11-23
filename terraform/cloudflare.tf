provider "cloudflare" {
  api_token = var.cloudflare_api_token != "" ? var.cloudflare_api_token : null
}

resource "cloudflare_dns_record" "app" {
  count   = var.enable_cloudflare ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = var.domain_name
  type    = "A"
  content = oci_core_instance.app.public_ip
  ttl     = 1
  proxied = true
}
