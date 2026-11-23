variable "tenancy_ocid" {
  type        = string
  description = "OCID de la tenancy de Oracle Cloud"
}

variable "user_ocid" {
  type        = string
  description = "OCID del usuario IAM usado por Terraform"
}

variable "fingerprint" {
  type        = string
  description = "Fingerprint de la API key de OCI"
}

variable "private_key_path" {
  type        = string
  description = "Ruta a la clave privada de la API de OCI"
}

variable "region" {
  type    = string
  default = "us-ashburn-1"
}

variable "compartment_ocid" {
  type        = string
  description = "OCID del compartimento donde se crearán los recursos"
}

variable "availability_domain" {
  type    = string
  default = ""
}

variable "ssh_public_key" {
  type        = string
  sensitive   = true
  description = "Clave pública SSH que se instalará en la VM"
}

variable "project_name" {
  type    = string
  default = "campuscircular"
}

variable "vcn_name" {
  type    = string
  default = "campuscircular-vcn"
}

variable "vcn_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  type    = string
  default = "10.0.0.0/24"
}

variable "private_subnet_cidr" {
  type    = string
  default = "10.0.1.0/24"
}

variable "instance_shape" {
  type    = string
  default = "VM.Standard.A1.Flex"
}

variable "ocpus" {
  type    = number
  default = 1
}

variable "memory_in_gbs" {
  type    = number
  default = 2
}

variable "boot_volume_size_gb" {
  type    = number
  default = 50
}

variable "enable_cloudflare" {
  type    = bool
  default = false
}

variable "cloudflare_api_token" {
  type      = string
  sensitive = true
  default   = ""
}

variable "cloudflare_zone_id" {
  type    = string
  default = ""
}

variable "domain_name" {
  type    = string
  default = ""
}
