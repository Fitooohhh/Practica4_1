output "public_ip" {
  value = oci_core_instance.app.public_ip
}

output "instance_id" {
  value = oci_core_instance.app.id
}

output "vcn_id" {
  value = oci_core_vcn.main.id
}

output "public_subnet_id" {
  value = oci_core_subnet.public.id
}

output "availability_domain" {
  value = local.availability_domain
}

output "cloudflare_record" {
  value = var.enable_cloudflare ? cloudflare_dns_record.app[0].name : "Cloudflare desactivado"
}
