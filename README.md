# gha-taller · API de tareas para aprender GitHub Actions

App de ejemplo del **Taller acelerado de GitHub Actions**.

- `src/` API REST en Express (`/health`, `/api/version`, `/api/tareas`)
- `test/` tests con Jest + Supertest (cobertura mínima 80 %)
- `public/` frontend estático que se despliega en GitHub Pages
- `Dockerfile` imagen multi-stage que se publica en GHCR
- `soluciones/` los workflows terminados de cada paso del taller

## Correr en local

```bash
npm install
npm run lint
npm test
npm start            # http://localhost:3000/api/tareas
```

Con Docker:

```bash
docker build -t gha-taller-api --build-arg APP_VERSION=local .
docker run -p 3000:3000 gha-taller-api
```

## Workflows del taller (copiar a `.github/workflows/`)

| Paso | Archivo | Qué hace |
| --- | --- | --- |
| 1 | `hola.yml` | Primer workflow: eventos, contextos, resumen del run |
| 2 | `ci.yml` | Lint + tests en matriz Node 22/24, caché npm, artifact de cobertura |
| 3 | `docker.yml` | Build, smoke test y push de la imagen a `ghcr.io` |
| 4 | `pages.yml` | Despliegue de `public/` a GitHub Pages |
| 4b | `deploy-render.yml` + `docker-con-render.yml` | Workflow reutilizable que despliega en Render (gratis) y verifica `/api/version`; `docker-con-render.yml` es `docker.yml` con el job `deploy` agregado |
| 5 | `release.yml` | En cada tag `vX.Y.Z`: CI reutilizable, imagen semver, deploy a Render con aprobación en `production` y GitHub Release |
| 6 | `dependabot.yml` | Va en `.github/dependabot.yml` (no en workflows) |
