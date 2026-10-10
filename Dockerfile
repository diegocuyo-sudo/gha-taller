# ---- Etapa 1: dependencias de producción ----
FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Etapa 2: imagen final ----
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000

# Datos de versión inyectados por el pipeline con --build-arg
ARG APP_VERSION=dev
ARG GIT_SHA=local
ENV APP_VERSION=$APP_VERSION GIT_SHA=$GIT_SHA

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:${PORT}/health || exit 1
CMD ["node", "src/server.js"]
