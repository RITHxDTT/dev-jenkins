# syntax=docker/dockerfile:1

# ==========================================
# Stage 1: Base image
# ==========================================
FROM node:20-alpine AS base

# Install libc6-compat for Alpine compatibility with certain native dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ==========================================
# Stage 2: Install dependencies
# ==========================================
FROM base AS deps
WORKDIR /app

# Copy package manifests
COPY package.json package-lock.json* ./

# Install dependencies using clean install
RUN npm ci

# ==========================================
# Stage 3: Build the application
# ==========================================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Run Next.js production build (generates .next/standalone)
RUN npm run build

# ==========================================
# Stage 4: Production Runner (Minimal image)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets if available
COPY --from=builder /app/public ./public

# Set correct permissions for Next.js cache
RUN mkdir .next && chown nextjs:nodejs .next

# Copy standalone build and static assets
# Automatically leverages Next.js output: "standalone"
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Run the standalone Node.js server
CMD ["node", "server.js"]
