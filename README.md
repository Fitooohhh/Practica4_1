# CampusCircular — Práctica 4.1 Proyecto MVP

CampusCircular es un MVP de economía circular universitaria: permite publicar, buscar y filtrar objetos que los estudiantes desean intercambiar, regalar o reutilizar.

## Tecnologías

- React + Vite + TypeScript
- Node.js + Express + TypeScript
- PostgreSQL 16
- Vitest, Supertest y Playwright
- Docker y Docker Compose
- GitHub Actions
- Terraform para Oracle Cloud Infrastructure (OCI)
- Ansible para Docker, Git, firewall, iptables y VNC

## Ejecutar localmente

Requisitos: Node.js 22 y Docker Desktop.

```powershell
npm install
docker compose up --build
```

Abrir: <http://localhost:4000>

Para desarrollo rápido usando el repositorio en memoria:

```powershell
$env:REPOSITORY_MODE = "memory"
npm run dev:api
# En otra terminal:
npm run dev:web
```

## Pruebas

```powershell
npm run test:unit         # 14 unitarias
npm run test:integration  # 8 de integración
npx playwright install chromium
npm run test:e2e          # 6 E2E
npm run typecheck
npm run build
```

## Ramas y GitHub Actions

- `dev`: cada push ejecuta unitarias, integración, E2E, typecheck y build.
- `main`: repite calidad, construye y publica la imagen `campuscircular` en Docker Hub, y luego ejecuta Terraform y Ansible.

Secretos mínimos de GitHub:

`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `OCI_TENANCY_OCID`, `OCI_USER_OCID`, `OCI_FINGERPRINT`, `OCI_PRIVATE_KEY`, `OCI_COMPARTMENT_OCID`, `OCI_SSH_PUBLIC_KEY`, `OCI_REGION`, `SSH_PRIVATE_KEY` y `VNC_PASSWORD`.

## Crear el repositorio desde cero

Después de crear un repositorio vacío en GitHub:

```powershell
git init
git add .
git commit -m "feat: crear MVP CampusCircular"
git branch -M dev
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin dev
```

Cuando tengas configurados los secretos, crea y publica `main` para activar el flujo de Docker, Terraform y Ansible:

```powershell
git checkout -b main
git push -u origin main
```

## Crear la infraestructura en Oracle Cloud

No se crea ninguna VM hasta ejecutar `terraform apply`. La preparación inicial se hace una sola vez en OCI:

1. Crear o elegir un **Compartment**.
2. Crear un usuario para Terraform o usar uno autorizado y generar una **API Key**. Guardar: tenancy OCID, user OCID, fingerprint y archivo privado `.pem`.
3. Generar un par de claves SSH para acceder a Ubuntu:

   ```powershell
   ssh-keygen -t ed25519 -C campuscircular -f "$env:USERPROFILE\.ssh\campuscircular"
   ```

4. Copiar `terraform/terraform.tfvars.example` a `terraform/terraform.tfvars` y completar los valores. No subir ese archivo a GitHub. Terraform selecciona automáticamente la imagen compatible más reciente de Ubuntu 24.04.
5. Ejecutar desde `terraform/`:

   ```powershell
   terraform init
   terraform plan
   terraform apply
   ```

6. Obtener la IP pública:

   ```powershell
   terraform output -raw public_ip
   ```

Terraform crea la VCN `10.0.0.0/16`, subred pública, subred privada, gateway, reglas para 22/80/443/5901 y la VM Ubuntu 24.04 `VM.Standard.E4.Flex` pagada con 1 OCPU y 2 GB. La forma recomendada es dejar la VCN y las subredes en Terraform para que la evidencia de la práctica sea reproducible.

## Configurar la VM con Ansible

Desde una máquina con Ansible (WSL, Linux o GitHub Actions):

```bash
ansible-galaxy collection install -r ansible/requirements.yml
export DOCKER_IMAGE=TU_USUARIO/campuscircular:latest
export VNC_PASSWORD='una-clave-de-al-menos-8-caracteres'
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

El playbook instala Docker, Docker Compose, Git, UFW, iptables, Xvfb y x11vnc; abre los puertos solicitados y levanta la aplicación con PostgreSQL en el puerto 80.

Para entrar por SSH:

```bash
ssh -i ~/.ssh/campuscircular ubuntu@IP_PUBLICA
```

## Cloudflare — punto extra

Si tienes un dominio administrado en Cloudflare, define en Terraform:

```hcl
enable_cloudflare    = true
cloudflare_api_token = "..."
cloudflare_zone_id   = "..."
domain_name          = "campuscircular.tudominio.com"
```

El registro A apuntará a la IP pública de la VM y quedará proxificado por Cloudflare. Los secretos deben ir en GitHub Actions, nunca en el repositorio.

## Detener recursos

Cuando termines la demostración, para evitar cargos o consumo innecesario:

```powershell
cd terraform
terraform destroy
```
