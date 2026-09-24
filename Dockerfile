# Multi-stage Dockerfile para EscuelaApp (Next.js 16 + Prisma + SQLite/PostgreSQL)

# 1. Base image con Node.js y dependencias del sistema
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# 2. Instalación de dependencias
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate

# 3. Compilación de la aplicación
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# 4. Imagen final de producción (Ultra ligera)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Crear directorios para persistencia de datos y fotos
RUN mkdir -p /app/prisma /app/public/uploads/avatars

# Copiar artefactos optimizados (Next.js standalone)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Exponer el puerto
EXPOSE 3000

# Iniciar servidor
CMD ["node", "server.js"]
