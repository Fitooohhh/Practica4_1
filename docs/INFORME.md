# Informe técnico — CampusCircular

## Idea del MVP

CampusCircular es una plataforma de intercambio y reutilización de objetos dentro de una comunidad universitaria. Una persona puede publicar un artículo y otra puede buscarlo por texto o categoría. El flujo prioriza reducir residuos y facilitar el acceso a materiales de estudio, movilidad y hogar.

## Arquitectura

- Frontend: React + Vite.
- Backend: Node.js + Express + TypeScript, con API REST.
- Base de datos: PostgreSQL 16, tabla `items` e índices por categoría y fecha.
- Calidad: Vitest para unitarias e integración, Supertest para API y Playwright para E2E.
- Entrega: Dockerfile multi-etapa y Docker Compose; GitHub Actions publica imágenes `amd64` y `arm64` para que la VM ARM de Oracle pueda ejecutarlas.
- Infraestructura: Terraform crea una VCN de Oracle Cloud, subred pública y privada, reglas de red, IP pública y una VM Ubuntu 24.04.
- Configuración: Ansible instala Docker, Git, firewall UFW, reglas iptables y servidor VNC.

## Pruebas implementadas

Hay 14 pruebas unitarias, 8 de integración y 6 E2E. Las pruebas E2E usan el repositorio en memoria para ser deterministas; la ejecución normal de la aplicación usa PostgreSQL.

## Flujo CI/CD

- Push a `dev`: instala dependencias, ejecuta unitarias, integración, E2E, typecheck y build.
- Push a `main`: repite calidad, publica la imagen en Docker Hub y ejecuta Terraform + Ansible cuando existen los secretos necesarios.

## Secrets requeridos en GitHub

`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `OCI_TENANCY_OCID`, `OCI_USER_OCID`, `OCI_FINGERPRINT`, `OCI_PRIVATE_KEY`, `OCI_COMPARTMENT_OCID`, `OCI_UBUNTU_2404_IMAGE_OCID`, `OCI_SSH_PUBLIC_KEY`, `OCI_REGION`, `SSH_PRIVATE_KEY`, `VNC_PASSWORD` y opcionalmente `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ZONE_ID` si se implementa el dominio extra.

La VM se crea en Oracle Cloud con el proveedor OCI de Terraform. Antes de ejecutar `terraform apply` se necesita crear en OCI el usuario/API key y obtener el OCID regional de la imagen Ubuntu 24.04; esos datos se guardan como secretos y no se escriben en el repositorio.

## Ejecución local

```bash
npm ci
docker compose up --build
# Abrir http://localhost:4000
```

Para desarrollo sin PostgreSQL: `REPOSITORY_MODE=memory npm run dev:api` y, en otra terminal, `npm run dev:web`.
