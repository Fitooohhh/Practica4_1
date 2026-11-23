#!/bin/bash
set -euxo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y python3 python3-apt openssh-server curl ca-certificates
systemctl enable ssh
systemctl start ssh
echo "Terraform bootstrap listo: $(date -Is)" > /var/log/campuscircular-bootstrap.log
